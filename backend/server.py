#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Système de Gestion des Notes - Backend FastAPI
Équivalent du backend Spring Boot pour tests en environnement Emergent

Fonctionnalités :
- Authentification JWT avec 3 rôles (ADMIN, STUDENT, TEACHER)
- CRUD complet pour utilisateurs, notes, matières, classes
- Calculs de moyennes pondérées
- Génération PDF des relevés
- APIs REST complètes

Auteur : Système de Gestion Scolaire
"""

from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pymongo import MongoClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import uuid
import os
from enum import Enum
import logging

# Configuration
SECRET_KEY = "votre-clé-secrète-jwt-très-sécurisée"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 heures

# Configuration MongoDB
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URL)
db = client.gestion_notes

# Configuration du hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuration de l'authentification
security = HTTPBearer()

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Système de Gestion des Notes - API",
    description="API REST pour la gestion des notes scolaires/universitaires",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# MODÈLES DE DONNÉES (Équivalents aux entités Spring Boot)
# ===========================

class RoleEnum(str, Enum):
    """Énumération des rôles utilisateur (équivalent à Role.java)"""
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"

class TranscriptStatusEnum(str, Enum):
    """Statut des relevés de notes"""
    GENERATED = "GENERATED"
    ARCHIVED = "ARCHIVED"
    ERROR = "ERROR"

# ===========================
# MODÈLES PYDANTIC (Équivalents aux DTOs Spring Boot)
# ===========================

class UserBase(BaseModel):
    """Modèle de base utilisateur (équivalent à UserRequest.java)"""
    username: str = Field(..., min_length=3, max_length=50)
    firstname: str = Field(..., min_length=1, max_length=100)
    lastname: str = Field(..., min_length=1, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    """Modèle pour création d'utilisateur"""
    password: str = Field(..., min_length=6, max_length=100)
    role: RoleEnum

class StudentCreate(UserBase):
    """Modèle pour création d'étudiant (équivalent à StudentRequest.java)"""
    password: str = Field(..., min_length=6, max_length=100)
    student_id_num: str = Field(..., min_length=1, max_length=50)

class TeacherCreate(UserBase):
    """Modèle pour création d'enseignant (équivalent à TeacherRequest.java)"""
    password: str = Field(..., min_length=6, max_length=100)
    teacher_id_num: str = Field(..., min_length=1, max_length=50)

class UserResponse(BaseModel):
    """Réponse utilisateur (équivalent à UserResponse.java)"""
    id: str
    username: str
    firstname: str
    lastname: str
    email: str
    role: RoleEnum
    created_at: datetime

class StudentResponse(UserResponse):
    """Réponse étudiant (équivalent à StudentResponse.java)"""
    student_id_num: str

class TeacherResponse(UserResponse):
    """Réponse enseignant (équivalent à TeacherResponse.java)"""
    teacher_id_num: str

class LoginRequest(BaseModel):
    """Demande de connexion (équivalent à LoginRequest.java)"""
    username: str
    password: str

class LoginResponse(BaseModel):
    """Réponse de connexion (équivalent à JwtResponse.java)"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class SubjectCreate(BaseModel):
    """Création de matière (équivalent à SubjectRequest.java)"""
    subject_code: str = Field(..., min_length=1, max_length=20)
    name: str = Field(..., min_length=1, max_length=200)
    coefficient: float = Field(1.0, ge=0.1, le=10.0)
    description: Optional[str] = None

class SubjectResponse(BaseModel):
    """Réponse matière (équivalent à SubjectResponse.java)"""
    id: str
    subject_code: str
    name: str
    coefficient: float
    description: Optional[str]
    created_at: datetime

class GradeCreate(BaseModel):
    """Création de note (équivalent à GradeRequest.java)"""
    student_id: str
    subject_id: str
    value: float = Field(..., ge=0, le=20)
    comment: Optional[str] = None
    recorded_by_teacher_id: Optional[str] = None

class GradeUpdate(BaseModel):
    """Modification de note (équivalent à GradeUpdateRequest.java)"""
    value: Optional[float] = Field(None, ge=0, le=20)
    comment: Optional[str] = None

class GradeResponse(BaseModel):
    """Réponse note (équivalent à GradeResponse.java)"""
    id: str
    value: float
    date: datetime
    comment: Optional[str]
    student_id: str
    student_name: str
    subject_id: str
    subject_name: str
    subject_coefficient: float
    recorded_by: Optional[str]
    
class ClassCreate(BaseModel):
    """Création de classe (équivalent à ClassRequest.java)"""
    name: str = Field(..., min_length=1, max_length=100)
    academic_year: str = Field(..., min_length=7, max_length=9)  # Ex: 2024-2025

class ClassResponse(BaseModel):
    """Réponse classe (équivalent à ClassResponse.java)"""
    id: str
    name: str
    academic_year: str
    created_at: datetime

class EnrollmentCreate(BaseModel):
    """Inscription étudiant à une matière"""
    student_id: str
    subject_id: str
    class_id: str
    semester: str = Field(..., min_length=1, max_length=20)

class TranscriptResponse(BaseModel):
    """Réponse relevé de notes (équivalent à TranscriptResponse.java)"""
    id: str
    generation_date: datetime
    status: TranscriptStatusEnum
    filepath: str
    student: StudentResponse

# ===========================
# FONCTIONS UTILITAIRES
# ===========================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifier le mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hasher le mot de passe"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Créer un token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Obtenir l'utilisateur courant depuis le token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les informations d'identification",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

def require_role(required_roles: List[RoleEnum]):
    """Décorateur pour vérifier les rôles requis"""
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in [role.value for role in required_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissions insuffisantes"
            )
        return current_user
    return role_checker

# ===========================
# ROUTES D'AUTHENTIFICATION
# ===========================

@app.post("/api/auth/signin", response_model=LoginResponse)
async def login(login_request: LoginRequest):
    """
    Connexion utilisateur (équivalent à AuthController.authenticateUser)
    
    Vérifie les informations d'identification et retourne un token JWT
    """
    user = db.users.find_one({"username": login_request.username})
    if not user or not verify_password(login_request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        firstname=user["firstname"],
        lastname=user["lastname"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"]
    )
    
    return LoginResponse(access_token=access_token, user=user_response)

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Obtenir les informations de l'utilisateur connecté"""
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        firstname=current_user["firstname"],
        lastname=current_user["lastname"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"]
    )

# Initialisation de l'admin par défaut
@app.on_event("startup")
async def create_default_admin():
    """Créer un administrateur par défaut au démarrage"""
    admin_exists = db.users.find_one({"username": "admin"})
    if not admin_exists:
        admin_user = {
            "_id": str(uuid.uuid4()),
            "username": "admin",
            "password": get_password_hash("adminpass"),
            "firstname": "Admin",
            "lastname": "Système",
            "email": "admin@example.com",
            "role": RoleEnum.ADMIN.value,
            "created_at": datetime.utcnow()
        }
        db.users.insert_one(admin_user)
        logger.info("Administrateur par défaut créé : admin/adminpass")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Routes API complètes pour le Système de Gestion des Notes
Équivalent aux contrôleurs Spring Boot

Ce fichier contient toutes les routes API pour :
- Gestion des utilisateurs (UserController équivalent)
- Gestion des notes (GradeController équivalent)
- Gestion des matières (SubjectController équivalent)
- Gestion des classes (ClassController équivalent)
- Génération de PDF et exports
"""

from fastapi import APIRouter, HTTPException, Depends, status, Response
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
from .server import (
    db, require_role, RoleEnum, get_current_user,
    get_password_hash, verify_password,
    UserCreate, StudentCreate, TeacherCreate, UserResponse, StudentResponse, TeacherResponse,
    SubjectCreate, SubjectResponse, ClassCreate, ClassResponse,
    GradeCreate, GradeUpdate, GradeResponse, EnrollmentCreate,
    TranscriptResponse, TranscriptStatusEnum
)
import logging

logger = logging.getLogger(__name__)

# Création du routeur principal
router = APIRouter()

# ===========================
# ROUTES GESTION UTILISATEURS (Équivalent UserController.java)
# ===========================

@router.post("/api/admin/users/students", response_model=StudentResponse)
async def register_student(
    student_request: StudentCreate,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Enregistrer un nouvel étudiant (équivalent à registerStudent)
    Accessible uniquement aux administrateurs
    """
    # Vérifier l'unicité du nom d'utilisateur et email
    if db.users.find_one({"username": student_request.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce nom d'utilisateur existe déjà"
        )
    
    if db.users.find_one({"email": student_request.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette adresse email existe déjà"
        )
    
    if db.users.find_one({"student_id_num": student_request.student_id_num}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce numéro étudiant existe déjà"
        )
    
    # Créer l'étudiant
    student_id = str(uuid.uuid4())
    student_data = {
        "_id": student_id,
        "username": student_request.username,
        "password": get_password_hash(student_request.password),
        "firstname": student_request.firstname,
        "lastname": student_request.lastname,
        "email": student_request.email,
        "role": RoleEnum.STUDENT.value,
        "student_id_num": student_request.student_id_num,
        "created_at": datetime.utcnow()
    }
    
    db.users.insert_one(student_data)
    logger.info(f"Nouvel étudiant créé : {student_request.username}")
    
    return StudentResponse(
        id=student_id,
        username=student_request.username,
        firstname=student_request.firstname,
        lastname=student_request.lastname,
        email=student_request.email,
        role=RoleEnum.STUDENT,
        student_id_num=student_request.student_id_num,
        created_at=datetime.utcnow()
    )

@router.post("/api/admin/users/teachers", response_model=TeacherResponse)
async def register_teacher(
    teacher_request: TeacherCreate,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Enregistrer un nouvel enseignant (équivalent à registerTeacher)
    Accessible uniquement aux administrateurs
    """
    # Vérifier l'unicité
    if db.users.find_one({"username": teacher_request.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce nom d'utilisateur existe déjà"
        )
    
    if db.users.find_one({"email": teacher_request.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette adresse email existe déjà"
        )
    
    if db.users.find_one({"teacher_id_num": teacher_request.teacher_id_num}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce numéro enseignant existe déjà"
        )
    
    # Créer l'enseignant
    teacher_id = str(uuid.uuid4())
    teacher_data = {
        "_id": teacher_id,
        "username": teacher_request.username,
        "password": get_password_hash(teacher_request.password),
        "firstname": teacher_request.firstname,
        "lastname": teacher_request.lastname,
        "email": teacher_request.email,
        "role": RoleEnum.TEACHER.value,
        "teacher_id_num": teacher_request.teacher_id_num,
        "created_at": datetime.utcnow()
    }
    
    db.users.insert_one(teacher_data)
    logger.info(f"Nouvel enseignant créé : {teacher_request.username}")
    
    return TeacherResponse(
        id=teacher_id,
        username=teacher_request.username,
        firstname=teacher_request.firstname,
        lastname=teacher_request.lastname,
        email=teacher_request.email,
        role=RoleEnum.TEACHER,
        teacher_id_num=teacher_request.teacher_id_num,
        created_at=datetime.utcnow()
    )

@router.get("/api/admin/users/{user_id}", response_model=UserResponse)
async def find_user_by_id(
    user_id: str,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Rechercher un utilisateur par ID (équivalent à findById)
    Accessible uniquement aux administrateurs
    """
    user = db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        firstname=user["firstname"],
        lastname=user["lastname"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"]
    )

@router.get("/api/admin/users/username/{username}", response_model=UserResponse)
async def find_user_by_username(
    username: str,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Rechercher un utilisateur par nom d'utilisateur (équivalent à findByUsername)
    """
    user = db.users.find_one({"username": username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        firstname=user["firstname"],
        lastname=user["lastname"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"]
    )

@router.get("/api/admin/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Obtenir tous les utilisateurs (équivalent à getAllUsers)
    Accessible uniquement aux administrateurs
    """
    users = list(db.users.find({}))
    return [
        UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            firstname=user["firstname"],
            lastname=user["lastname"],
            email=user["email"],
            role=user["role"],
            created_at=user["created_at"]
        )
        for user in users
    ]

@router.delete("/api/admin/users/delete/{user_id}")
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Supprimer un utilisateur (équivalent à deleteUserById)
    Accessible uniquement aux administrateurs
    """
    result = db.users.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Supprimer aussi les notes associées si c'est un étudiant
    db.grades.delete_many({"student_id": user_id})
    
    logger.info(f"Utilisateur supprimé : {user_id}")
    return {"message": "Utilisateur supprimé avec succès"}

# ===========================
# ROUTES GESTION MATIÈRES
# ===========================

@router.post("/api/subjects", response_model=SubjectResponse)
async def create_subject(
    subject_request: SubjectCreate,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Créer une nouvelle matière
    Accessible uniquement aux administrateurs
    """
    # Vérifier l'unicité du code matière
    if db.subjects.find_one({"subject_code": subject_request.subject_code}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce code de matière existe déjà"
        )
    
    subject_id = str(uuid.uuid4())
    subject_data = {
        "_id": subject_id,
        "subject_code": subject_request.subject_code,
        "name": subject_request.name,
        "coefficient": subject_request.coefficient,
        "description": subject_request.description,
        "created_at": datetime.utcnow()
    }
    
    db.subjects.insert_one(subject_data)
    logger.info(f"Nouvelle matière créée : {subject_request.name}")
    
    return SubjectResponse(
        id=subject_id,
        subject_code=subject_request.subject_code,
        name=subject_request.name,
        coefficient=subject_request.coefficient,
        description=subject_request.description,
        created_at=datetime.utcnow()
    )

@router.get("/api/subjects", response_model=List[SubjectResponse])
async def get_all_subjects(current_user: dict = Depends(get_current_user)):
    """
    Obtenir toutes les matières
    Accessible à tous les utilisateurs connectés
    """
    subjects = list(db.subjects.find({}))
    return [
        SubjectResponse(
            id=str(subject["_id"]),
            subject_code=subject["subject_code"],
            name=subject["name"],
            coefficient=subject["coefficient"],
            description=subject.get("description"),
            created_at=subject["created_at"]
        )
        for subject in subjects
    ]

@router.get("/api/subjects/{subject_id}", response_model=SubjectResponse)
async def get_subject_by_id(
    subject_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obtenir une matière par ID"""
    subject = db.subjects.find_one({"_id": subject_id})
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Matière non trouvée"
        )
    
    return SubjectResponse(
        id=str(subject["_id"]),
        subject_code=subject["subject_code"],
        name=subject["name"],
        coefficient=subject["coefficient"],
        description=subject.get("description"),
        created_at=subject["created_at"]
    )

# ===========================
# ROUTES GESTION CLASSES
# ===========================

@router.post("/api/classes", response_model=ClassResponse)
async def create_class(
    class_request: ClassCreate,
    current_user: dict = Depends(require_role([RoleEnum.ADMIN]))
):
    """
    Créer une nouvelle classe
    Accessible uniquement aux administrateurs
    """
    class_id = str(uuid.uuid4())
    class_data = {
        "_id": class_id,
        "name": class_request.name,
        "academic_year": class_request.academic_year,
        "created_at": datetime.utcnow()
    }
    
    db.classes.insert_one(class_data)
    logger.info(f"Nouvelle classe créée : {class_request.name}")
    
    return ClassResponse(
        id=class_id,
        name=class_request.name,
        academic_year=class_request.academic_year,
        created_at=datetime.utcnow()
    )

@router.get("/api/classes", response_model=List[ClassResponse])
async def get_all_classes(current_user: dict = Depends(get_current_user)):
    """
    Obtenir toutes les classes
    Accessible à tous les utilisateurs connectés
    """
    classes = list(db.classes.find({}))
    return [
        ClassResponse(
            id=str(class_["_id"]),
            name=class_["name"],
            academic_year=class_["academic_year"],
            created_at=class_["created_at"]
        )
        for class_ in classes
    ]

# Ce fichier sera continué dans api_routes_part2.py pour éviter la limite de tokens
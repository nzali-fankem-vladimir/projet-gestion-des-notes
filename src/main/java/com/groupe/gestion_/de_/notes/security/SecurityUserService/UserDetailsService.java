package com.groupe.gestion_.de_.notes.security.SecurityUserService;

import org.springframework.security.core.userdetails.UserDetails;

public interface UserDetailsService {

    public UserDetails loadUserByUsername();
}

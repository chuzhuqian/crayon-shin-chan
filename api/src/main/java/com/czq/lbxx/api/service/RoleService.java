package com.czq.lbxx.api.service;

import com.czq.lbxx.api.entity.Role;
import com.czq.lbxx.api.repository.RoleRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Resource
    RoleRepository roleRepository;

    public List<Role> getAll() {
        return roleRepository.findAll();
    }
}

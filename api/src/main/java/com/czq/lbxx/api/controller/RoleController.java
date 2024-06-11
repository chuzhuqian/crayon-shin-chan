package com.czq.lbxx.api.controller;

import com.czq.lbxx.api.common.Response;
import com.czq.lbxx.api.entity.Role;
import com.czq.lbxx.api.service.RoleService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Resource
    RoleService roleService;

    @GetMapping("list")
    public Response<List<Role>> list() {
        return Response.success(roleService.getAll());
    }
}

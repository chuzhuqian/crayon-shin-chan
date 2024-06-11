package com.czq.lbxx.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Role {

    @Id
    private Long id;

    private String cnName;

    private String jpName;

    private String avatar;

    private String cnActor;

    private String jpActor;

    @Column(columnDefinition = "TEXT")
    private String description;
}

package com.blog.backend.dto;

import lombok.Data;

@Data
public class FAQDTO {
    private String question;
    private String answer;
    private Integer displayOrder;
}

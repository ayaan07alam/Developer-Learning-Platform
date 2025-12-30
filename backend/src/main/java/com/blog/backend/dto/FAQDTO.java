package com.blog.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FAQDTO {
    private String question;
    private String answer;
    private Integer displayOrder;
}

package com.blog.backend.model;

public enum JobCategory {
    // Tech Categories
    SOFTWARE_DEVELOPMENT("Software Development", "Tech"),
    WEB_DEVELOPMENT("Web Development", "Tech"),
    MOBILE_DEVELOPMENT("Mobile Development", "Tech"),
    DATA_SCIENCE("Data Science & Analytics", "Tech"),
    DEVOPS("DevOps & Cloud", "Tech"),
    CYBERSECURITY("Cybersecurity", "Tech"),
    AI_ML("AI & Machine Learning", "Tech"),
    QA_TESTING("QA & Testing", "Tech"),
    UI_UX_DESIGN("UI/UX Design", "Tech"),
    PRODUCT_MANAGEMENT("Product Management", "Tech"),

    // Non-Tech Categories
    MARKETING("Marketing & Sales", "Non-Tech"),
    FINANCE("Finance & Accounting", "Non-Tech"),
    HR("Human Resources", "Non-Tech"),
    OPERATIONS("Operations & Logistics", "Non-Tech"),
    CUSTOMER_SUPPORT("Customer Support", "Non-Tech"),
    BUSINESS_DEVELOPMENT("Business Development", "Non-Tech"),
    CONTENT_WRITING("Content Writing", "Non-Tech"),
    LEGAL("Legal & Compliance", "Non-Tech"),
    ADMINISTRATION("Administration", "Non-Tech"),
    OTHER("Other", "Non-Tech");

    private final String label;
    private final String type;

    JobCategory(String label, String type) {
        this.label = label;
        this.type = type;
    }

    public String getLabel() {
        return label;
    }

    public String getType() {
        return type;
    }
}

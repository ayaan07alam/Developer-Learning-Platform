# 📘 RuntimeRiver: The Complete Technical Reference & Architectural Manifesto
> **Version**: 3.0.0 (The Interview Edition)
> **Author**: RuntimeRiver Engineering
> **Purpose**: A deep-dive architectural analysis answering the "How" and "Why" of every system component.

---

## 📑 Table of Contents
1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Architectural Philosophy](#2-architectural-philosophy-theory)
3. [Backend Engineering & Design Patterns](#3-backend-engineering--design-patterns)
4. [Database Internals & Optimization](#4-database-internals--optimization)
5. [Security & Cryptography](#5-security--cryptography)
6. [Frontend Engineering & Performance](#6-frontend-engineering--performance)
7. [System Scalability & DevOps](#7-system-scalability--devops)
8. [Feature Case Studies](#8-feature-case-studies)

---

## 1. Executive Summary & Product Vision
RuntimeRiver is a **verticalized developer ecosystem** designed to solve the fragmentation in technical education. Unlike generic platforms (Medium, Dev.to), RuntimeRiver integrates the **Read-Run-Apply** loop:
1.  **Read**: Consume technical articles.
2.  **Run**: Execute code snippets instantly in the browser.
3.  **Apply**: Find jobs relevant to the learned skills.

**Metric of Success**: "Time to Hello World" — Reducing the friction between learning a concept and executing it.

---

## 2. Architectural Philosophy (Theory)

### **2.1 The "Modulith" Approach**
We deliberately chose a **Modular Monolith** over Microservices.
-   **Theory**: Conway's Law states that systems mirror communication structures. As a small, high-velocity team, a distributed system would introduce "Microservice Premium" (latency, distributed tracing, eventual consistency complexity).
-   **Implementation**: We have distinct logical boundaries (`com.blog.backend.job`, `com.blog.backend.post`) sharing a single database and JVM.
-   **Benefit**: This maintains **ACID Transactional Integrity** without complex Saga patterns or Two-Phase commits.

### **2.2 Client-Server Decoupling**
-   **REST Maturity**: We adhere to **Level 2 REST Maturity** (Resources, HTTP Verbs).
-   **Statelessness**: The backend stores **zero session state**. All state is encapsulated in the Client (React Context) or the Token (JWT).
    -   *Why?* This allows horizontal scaling. We can spin up 10 backend instances without worrying about "Sticky Sessions".

---

## 3. Backend Engineering & Design Patterns

We leveraged standard **Gang of Four (GoF)** and **Enterprise Integration Patterns**.

### **3.1 Controller-Service-Repository Pattern**
This is our primary Separation of Concerns mechanism.
1.  **Controller Layer**: Handles HTTP concerns (DTO deserialization, Status codes). *Strictly no business logic.*
2.  **Service Layer**: The "Brain". Handles Transaction boundaries (`@Transactional`), Validation, and Orchestration.
3.  **Repository Layer**: The "Connector". Abstraction over SQL via JPA.

### **3.2 Data Transfer Object (DTO) Pattern**
We **never** expose Database Entities directly to the API.
-   **Problem**: Exposing Entities leads to Over-fetching (password hashes, internal flags), Circular Dependencies, and tightly couples API contracts to DB Schema.
-   **Solution**: `PostDTO`, `UserDTO`. We use `ModelMapper` strategies to project data.

### **3.3 Strategy Pattern (in Authentication)**
Spring Security's `AuthenticationProvider` implements the Strategy pattern.
-   We define strategies for `DaoAuthenticationProvider` (Local DB Auth) and potentially `OAuth2AuthenticationProvider`. The `AuthenticationManager` selects the correct strategy at runtime.

### **3.4 Exception Handling (Global Observer)**
We use `@ControllerAdvice`.
-   **Theory**: Aspect-Oriented Programming (AOP). We slice through the application to handle "Cross-Cutting Standard Concerns" (Error handling) in one centralized place, keeping business logic clean.

---

## 4. Database Internals & Optimization

### **4.1 Schema Normalization**
Our Schema is **3rd Normal Form (3NF)** compliant to minimize redundancy.
-   **Post-Tags**: We use a helper table `post_tags` (ElementCollection) rather than storing a comma-separated string.
    -   *Why?* Allows indexing on individual tags for fast search (`SELECT * FROM posts WHERE tag = 'Java'`).

### **4.2 Indexing Strategy (B-Tree)**
PostgreSQL uses B-Tree indexes by default.
-   **Primary Keys (`id`)**: Automatically indexed.
-   **Unique Constraints (`email`, `slug`)**: Enforced via unique indexes.
-   **Composite Index Consideration**: For the Job board, we query by `status` AND `type`. We rely on Postgres's query planner, but we monitor `EXPLAIN ANALYZE` output to add composite indexes if `Seq Scan` becomes a bottleneck.

### **4.3 Transaction Management (ACID)**
-   **Atomicity**: If a user creates a Post but the Image Upload fails, the entire transaction rolls back. No "half-created" ghost posts.
-   **Isolation**: We use the default `READ COMMITTED` isolation level to prevent Dirty Reads.

---

## 5. Security & Cryptography

### **5.1 The 7-Layer Shield**
1.  **Transport Layer**: TLS/SSL (HTTPS) encrypts data in transit.
2.  **Network Layer**: Railway's private network execution.
3.  **Application Layer (Filters)**:
    -   `CorsFilter`: Whitelisting Origins.
    -   `JwtFilter`: Token validation.

### **5.2 JWT Anatomy & Theory**
We use **JSON Web Tokens (RFC 7519)**.
-   **Structure**: `Header.Payload.Signature`
-   **Header**: `{"alg": "HS256"}`
-   **Payload**: Claims (`sub`: userId, `role`: ADMIN, `exp`: timestamp).
-   **Signature**: `HMACSHA256(base64(Header) + "." + base64(Payload), SECRET_KEY)` is calculated on the server.
    -   *Crucial Logic*: If a hacker modifies the Payload (e.g., changes role to ADMIN), the Signature check will fail because they don't have the `SECRET_KEY`.

---

## 6. Frontend Engineering & Performance

### **6.1 Next.js Rendering Paradigms**
We utilize the **Hybrid Rendering** model.
-   **Server-Side Rendering (SSR)**: Used for Blog Posts.
    -   *Why?* Search Crawlers (Googlebot) need fully rendered HTML for SEO. Dynamic Open Graph tags (Twitter Cards) must be generated on the server.
-   **Client-Side Rendering (CSR)**: Used for Dashboard.
    -   *Why?* Highly interactive, personalized data. No SEO requirement.
-   **Static Site Generation (SSG)**: Used for Marketing pages (About, Landing).
    -   *Why?* Performance. Pre-built HTML served from CDN edge locations (Time To First Byte < 50ms).

### **6.2 React Virtual DOM & Reconciliation**
-   **Theory**: React maintains a Virtual DOM tree. When state changes, it diffs the new Virtual DOM with the old one (Reconciliation Algorithm) and computes the minimal set of native DOM operations.
-   **Application**: In our **Code Editor**, typing triggers frequent updates. We use `memo` and optimized state updates to prevent re-rendering the entire page on every keystroke.

### **6.3 CSS Architecture**
-   **Tailwind CSS (Utility-First)**:
    -   *Benefit*: Reduces CSS bundle size. Unlike BEM where every component adds new CSS, Tailwind reuses atomic classes. The final CSS bundle size stays constant even as the app grows.

---

## 7. System Scalability & DevOps

### **7.1 Horizontal Scaling**
Because our backend is **Stateless**, we can scale horizontally.
-   **Load Balancer**: Railway's internal load balancer distributes traffic.
-   **Instance 1** & **Instance 2** don't know about each other. They just verify the JWT signature independently.

### **7.2 Caching Strategy**
-   **L1 Cache (Browser)**: `Cache-Control` headers for static assets (images, JS).
-   **L2 Cache (CDN)**: Vercel Edge caches SSG pages.
-   **L3 Cache (Database)**: PostgreSQL Shared Buffers.
-   *(Future L4)*: Redis implementation for API response caching.

---

## 8. Feature Case Studies

### **8.1 The Compiler: A Study in Sandboxing**
**Problem**: "Arbitrary Code Execution" (ACE) is usually a vulnerability. Here, it's a feature.
**Theory**: We need a strictly controlled environment.
**Solution**: **Ephemeral Containerization**.
-   Every run request spawns a `Docker` container (Alpine Linux).
-   **Resource Quotas**: strictly limited RAM (128MB) and CPU time to prevent "Fork Bombs" or "While(true)" loops from freezing the server.
-   **Network Isolation**: The container has no network access to prevent botnet behavior.

### **8.2 The Media Library: Synchronous vs Asynchronous**
**Approach**: We use **Synchronous Uploads** for simplicity but optimized.
-   **Data Flow**: `Client` -> `Backend (Stream)` -> `Cloudinary`.
-   **Stream Processing**: We process the `MultipartFile` as a stream rather than loading the whole 10MB into Heap Memory, preventing `OutOfMemoryError` on the server under high load.

---

*This documentation demonstrates not just implementation skills, but deep architectural understanding required for Senior Application Engineering roles.*

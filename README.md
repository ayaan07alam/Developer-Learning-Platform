# 🌊 RuntimeRiver - Developer Learning Platform

![RuntimeRiver Banner](https://img.shields.io/badge/Runtime-River-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

**RuntimeRiver** is a cutting-edge, full-stack developer education platform designed to be the ultimate companion for coding enthusiasts. Built with **Next.js 14** and **Spring Boot 3**, it seamlessly bridges the gap between learning, practicing, and career growth.

> "Flow State for Developers"

---

## 🚀 Key Features

### 🖥️ **Interactive Online Compiler & IDE**
*Powered by Piston API*
- **Multi-Language Support**: Write and execute code in **18+ languages** including Java, Python, C++, JavaScript, Go, Rust, and more.
- **Real-time Execution**: Instant compilation and output generation.
- **Standard Input (stdin)**: Support for interactive programs requiring user input (batch mode).
- **Intelligent Editor**: Syntax highlighting, auto-completion, and bracket matching via CodeMirror.

### ✍️ **Advanced Blogging Platform**
- **Rich Text Editor**: A massive upgrade over standard Markdown, featuring a "Notion-style" block editor (TipTap).
- **Media Library**: 
    - Integrated Cloudinary-based image manager.
    - Drag-and-drop uploads.
    - **Role-Based Access**: Admins/Editors can manage the library from the dashboard; Authors can access it via the editor.
- **Smart Features**: 
    - Auto-generated Table of Contents.
    - Reading progress bars.
    - Code block highlighting.
- **Workflow**: Draft -> Review -> Publish lifecycle with role-specific dashboards.

### 💼 **Job Portal**
- **Dual-Role System**: Toggle between **Job Seeker** and **Employer** views.
- **For Seekers**: 
    - Filter jobs by 20+ categories (Tech & Non-Tech).
    - Track application status.
    - Direct application submission.
- **For Employers**:
    - Post detailed job listings.
    - Manage candidates and applications.
    - Dashboard analytics.

### 🛠️ **Developer Tool Suite**
A Swiss Army knife for developers, reducing the need to bookmark 50+ websites.
- **File Utilities**: PDF converters, Image compression, Resizing.
- **Code Utilities**: JSON Formatter, JWT Debugger, Regex Tester.
- **Generators**: QR Code, Password, UUID generators.

### 🎨 **Modern UX/UI**
- **Aesthetic**: "Runtime River" theme with fluid gradients, glassmorphism, and dark mode support.
- **Responsive**: Mobile-first design using Tailwind CSS.
- **Performance**: Server-Side Rendering (SSR) for SEO and lightning-fast loads.

---

## 🏗️ Technical Architecture

### **Frontend (The View)**
*   **Framework**: Next.js 14 (App Router)
*   **Language**: JavaScript / JSX
*   **Styling**: Tailwind CSS, CSS Modules
*   **State Management**: React Context (Auth, Toast)
*   **Editor**: TipTap (Headless wrapper around ProseMirror), CodeMirror
*   **Icons**: Lucide React
*   **Deployment**: Vercel

### **Backend (The Core)**
*   **Framework**: Spring Boot 3.2
*   **Language**: Java 17
*   **Database**: PostgreSQL
*   **Security**: Spring Security 6, JWT (Stateless Auth)
*   **Storage**: Cloudinary (Image CDN)
*   **Execution Engine**: Piston API (External)
*   **Build Tool**: Maven
*   **Deployment**: Railway

---

## 🛠️ Installation & Setup Guide

### prerequisites
- **Node.js**: v18+
- **Java Development Kit (JDK)**: v17+
- **Maven**: v3.8+
- **PostgreSQL**: Local or Cloud instance

### 1. Clone the Repository
```bash
git clone https://github.com/ayaan07alam/Developer-Learning-Platform.git
cd Developer-Learning-Platform
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

**Configure Environment Variables:**
Create `src/main/resources/application.properties` based on the example.
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/runtimeriver
spring.datasource.username=your_postgres_user
spring.datasource.password=your_postgres_password

# Authentication (JWT)
jwt.secret=YOUR_SUPER_SECRET_KEY_AT_LEAST_64_CHARACTERS
jwt.expiration=86400000

# Google OAuth
google.client.id=YOUR_GOOGLE_CLIENT_ID
google.client.secret=YOUR_GOOGLE_CLIENT_SECRET

# Cloudinary (Media Library)
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

# File Upload Limits
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

**Run the Server:**
```bash
mvn spring-boot:run
```
*Server starts on `http://localhost:8080`*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
```

**Configure Environment:**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Install & Run:**
```bash
npm install
npm run dev
```
*Client starts on `http://localhost:3000`*

---

## 👥 User Roles & Permissions

| Feature | Admin | Editor | Reviewer | User |
| :--- | :---: | :---: | :---: | :---: |
| **View Content** | ✅ | ✅ | ✅ | ✅ |
| **Run Code** | ✅ | ✅ | ✅ | ✅ |
| **Apply Jobs** | ✅ | ✅ | ✅ | ✅ |
| **Post Jobs** | ✅ | ✅ | ❌ | ❌ |
| **Create Posts** | ✅ | ✅ | ✅ (Draft) | ❌ |
| **Publish Posts** | ✅ | ✅ | ❌ | ❌ |
| **Media Library** | ✅ | ✅ | ❌ | ❌ |
| **User Mgmt** | ✅ | ❌ | ❌ | ❌ |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by Ayaan Alam & The RuntimeRiver Team
</p>
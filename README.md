# Developer Learning Platform

A comprehensive full-stack developer education platform built with **Next.js** and **Spring Boot**, offering interactive tutorials, coding tools, learning roadmaps, and career opportunities.

## 🚀 Features

### 📚 **Educational Content**
- **Interactive Tutorials** - Step-by-step coding tutorials with live code execution
- **Technical Blog** - In-depth articles on programming topics with reading progress tracking
- **Learning Roadmaps** - Structured learning paths for various technologies
- **Category-based Learning** - Organized content by programming languages and frameworks
- **Table of Contents** - Auto-generated, smooth-scrolling TOC for long articles

### 💼 **Job Platform** (NEW!)
- **Dual Role System** - Switch between Job Seeker and Employer modes
- **Job Seeker Features:**
  - Browse 20+ job categories (Tech & Non-Tech)
  - Search and filter jobs by category, location, and keywords
  - Apply directly through the platform with resume and cover letter
  - Track application history
- **Employer Features:**
  - Post job listings with detailed descriptions
  - Manage applications and view candidate profiles
  - Track job statistics (active, closed, total applicants)
  - Close or delete job postings
- **Job Types:** Full-time, Part-time, Contract, Remote, Hybrid, On-site, Internship, Freelance
- **Categories:** 10 Tech (Software Dev, Web Dev, Mobile, Data Science, DevOps, etc.) + 10 Non-Tech (Marketing, Finance, HR, etc.)

### 🛠️ **Developer Tools**
- **Interactive Code Editor** - Write and execute code directly in the browser
- **Multi-language Support** - Execute code in Python, JavaScript, Java, C++, and more
- **Code Snippets** - Save and share useful code snippets

### 👥 **User Features**
- **Google OAuth Authentication** - Secure login with Google
- **Email/Password Authentication** - Traditional login option
- **User Dashboard** - Manage posts, profile, and activity
- **Role-based Access** - Admin, Editor, and User roles
- **Profile Management** - Personalized user profiles
- **Seamless Login Flow** - Return to previous page after authentication

### ✍️ **Content Management**
- **Rich Text Editor** - Create and edit posts with formatting
- **Post Categories** - Organize content by topics with dedicated category pages
- **FAQ Builder** - Create comprehensive FAQ sections
- **SEO Optimization** - Built-in SEO features for better discoverability
- **Reading Progress Indicator** - Visual progress bar and percentage for blog posts

## 🏗️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS with custom glassmorphism effects
- **UI Components:** Custom components with lucide-react icons
- **Authentication:** JWT + Google OAuth
- **Code Editor:** CodeMirror
- **Theme:** Dark/Light mode support

### **Backend**
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** H2 (Development) / PostgreSQL (Production)
- **Security:** Spring Security + JWT
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven
- **Validation:** Jakarta Bean Validation

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- Git

### **Backend Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayaan07alam/Developer-Learning-Platform.git
   cd Developer-Learning-Platform/backend
   ```

2. **Configure environment variables**
   ```bash
   # Copy the example file
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

3. **Set your credentials in `application.properties`**
   ```properties
   google.client.id=YOUR_GOOGLE_CLIENT_ID
   google.client.secret=YOUR_GOOGLE_CLIENT_SECRET
   jwt.secret=YOUR_JWT_SECRET_KEY
   ```

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend will run on `http://localhost:8080`

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000` (or `http://localhost:3001` if 3000 is occupied)

## 🔐 Environment Variables

### **Backend** (`application.properties`)
```properties
# Google OAuth
google.client.id=YOUR_GOOGLE_CLIENT_ID
google.client.secret=YOUR_GOOGLE_CLIENT_SECRET

# JWT Configuration
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=2592000000

# Database (Production)
spring.datasource.url=jdbc:postgresql://localhost:5432/yourdb
spring.datasource.username=yourusername
spring.datasource.password=yourpassword
```

### **Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🗂️ Project Structure

```
Developer-Learning-Platform/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/blog/backend/
│   │   │   │   ├── config/         # Security & CORS config
│   │   │   │   ├── controller/     # REST API endpoints
│   │   │   │   │   ├── JobController.java
│   │   │   │   │   ├── JobRoleController.java
│   │   │   │   │   └── CategoryController.java
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   │   ├── Job.java
│   │   │   │   │   ├── JobApplication.java
│   │   │   │   │   └── JobRole/Category/Type/Status enums
│   │   │   │   ├── repository/     # Database repositories
│   │   │   │   ├── security/       # JWT & Auth filters
│   │   │   │   └── service/        # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── frontend/                   # Next.js frontend
│   ├── app/                    # Next.js 14 app directory
│   │   ├── blogs/              # Blog pages
│   │   ├── categories/         # Category browsing pages
│   │   ├── jobs/               # Job platform
│   │   │   ├── page.jsx        # Job landing & routing
│   │   │   ├── select-role/    # Role selection
│   │   │   ├── seeker/         # Job seeker dashboard
│   │   │   └── employer/       # Employer dashboard
│   │   ├── learn/              # Tutorial pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── login/              # Authentication
│   │   └── ...
│   ├── components/             # React components
│   │   ├── ForcedLoginPopup.jsx
│   │   ├── LoginPopup.jsx
│   │   ├── ReadingProgress.jsx
│   │   └── ...
│   ├── contexts/               # React contexts (Auth, Toast)
│   ├── lib/                    # Utilities & API clients
│   ├── public/                 # Static assets
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google` - Google OAuth login

### **Posts**
- `GET /api/posts` - Get all posts
- `GET /api/posts/{id}` - Get post by ID
- `POST /api/posts` - Create new post (Auth required)
- `PUT /api/posts/{id}` - Update post (Auth required)
- `DELETE /api/posts/{id}` - Delete post (Auth required)

### **Categories**
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get category by slug
- `POST /api/categories` - Create category (Admin only)

### **Jobs**
- `GET /api/jobs` - Get all active jobs (Auth required)
- `GET /api/jobs/{id}` - Get job details (Auth required)
- `POST /api/jobs` - Create job posting (Employer only)
- `PUT /api/jobs/{id}` - Update job (Employer only)
- `DELETE /api/jobs/{id}` - Delete job (Employer only)
- `POST /api/jobs/{id}/apply` - Apply for job (Job Seeker only)
- `GET /api/jobs/{id}/applications` - View applications (Employer only)
- `GET /api/jobs/my-jobs` - Get employer's jobs
- `GET /api/jobs/my-applications` - Get seeker's applications
- `POST /api/jobs/{id}/close` - Close job posting
- `GET /api/jobs/categories` - Get job categories (Public)
- `GET /api/jobs/types` - Get job types (Public)

### **Job Roles**
- `GET /api/users/job-role` - Get current user's job role
- `POST /api/users/select-job-role` - Select initial job role
- `PUT /api/users/change-job-role` - Switch between roles

### **Users**
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/{id}/role` - Update user role (Admin only)
- `DELETE /api/users/{id}` - Delete user (Admin only)

### **Profile**
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

## 🎨 UI Components

Modern, accessible components with glassmorphism effects:
- Buttons, Cards, Dropdowns
- Navigation Menu with Jobs & Categories
- Custom components: RichTextEditor, CodeBlock, TableOfContents, ReadingProgress
- ForcedLoginPopup for job platform authentication
- Smooth animations and transitions

## 🚦 Getting Started

1. **Clone the repository**
2. **Set up backend** (see Backend Setup above)
3. **Set up frontend** (see Frontend Setup above)
4. **Create a Google OAuth app** and get credentials
5. **Configure environment variables**
6. **Run both servers**
7. **Access the app at** `http://localhost:3000`

### **Using the Job Platform**

1. **Sign up or log in** to your account
2. **Navigate to Jobs** from the header
3. **Select your role:** Job Seeker or Employer
4. **As a Job Seeker:**
   - Browse and search jobs
   - Filter by category
   - Apply with resume and cover letter
5. **As an Employer:**
   - Post new job listings
   - Manage applications
   - View candidate profiles
6. **Switch roles anytime** using the "Switch Role" button

## 📝 Default Admin Account

On first run, an admin account is created:
- **Email:** `ayaanalam78670@gmail.com`
- **Password:** `Admin@123`

**⚠️ Change this password immediately in production!**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ayaan Alam**
- GitHub: [@ayaan07alam](https://github.com/ayaan07alam)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Spring Boot community
- lucide-react for beautiful icons
- All open-source contributors

---

**⭐ If you find this project useful, please consider giving it a star!**
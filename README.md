# Developer Learning Platform

A comprehensive full-stack developer education platform built with **Next.js** and **Spring Boot**, offering interactive tutorials, coding tools, learning roadmaps, and career opportunities.

## 🚀 Features

### 📚 **Educational Content**
- **Interactive Tutorials** - Step-by-step coding tutorials with live code execution
- **Technical Blog** - In-depth articles on programming topics
- **Learning Roadmaps** - Structured learning paths for various technologies
- **Category-based Learning** - Organized content by programming languages and frameworks

### 🛠️ **Developer Tools**
- **Interactive Code Editor** - Write and execute code directly in the browser
- **Multi-language Support** - Execute code in Python, JavaScript, Java, C++, and more
- **Code Snippets** - Save and share useful code snippets

### 👥 **User Features**
- **Google OAuth Authentication** - Secure login with Google
- **User Dashboard** - Manage posts, profile, and activity
- **Role-based Access** - Admin, Editor, and User roles
- **Profile Management** - Personalized user profiles

### ✍️ **Content Management**
- **Rich Text Editor** - Create and edit posts with formatting
- **Post Categories** - Organize content by topics
- **FAQ Builder** - Create comprehensive FAQ sections
- **Table of Contents** - Auto-generated TOC for long articles
- **SEO Optimization** - Built-in SEO features for better discoverability

### 🎯 **Coming Soon**
- Job Board & Hiring Platform
- Advanced Developer Tools
- Community Forums
- Live Coding Challenges

## 🏗️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **CMS:** Sanity.io
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

3. **Configure Sanity (if needed)**
   - Update `sanity.config.js` with your Sanity project details
   - Or remove Sanity integration if not using CMS

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

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
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
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
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── model/          # JPA entities
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
│   │   ├── learn/              # Tutorial pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── login/              # Authentication
│   │   └── ...
│   ├── components/             # React components
│   ├── contexts/               # React contexts (Auth, Toast)
│   ├── lib/                    # Utilities & API clients
│   ├── public/                 # Static assets
│   ├── sanity/                 # Sanity CMS config
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
- `POST /api/categories` - Create category (Admin only)

### **Users**
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/{id}/role` - Update user role (Admin only)
- `DELETE /api/users/{id}` - Delete user (Admin only)

### **Profile**
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

## 🎨 UI Components

Built with **shadcn/ui** for a modern, accessible component library:
- Buttons, Cards, Dropdowns
- Navigation Menu
- Sheet (Sidebar)
- Custom components: RichTextEditor, CodeBlock, TableOfContents

## 🚦 Getting Started

1. **Clone the repository**
2. **Set up backend** (see Backend Setup above)
3. **Set up frontend** (see Frontend Setup above)
4. **Create a Google OAuth app** and get credentials
5. **Configure environment variables**
6. **Run both servers**
7. **Access the app at** `http://localhost:3000`

## 📝 Default Admin Account

On first run, an admin account is created:
- **Email:** `admin@example.com`
- **Password:** `admin123`

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
- shadcn/ui for beautiful components
- All open-source contributors

---

**⭐ If you find this project useful, please consider giving it a star!**
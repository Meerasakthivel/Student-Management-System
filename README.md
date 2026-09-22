# 🎓 StudentHub – Advanced Student Management System

StudentHub is a modern web-based **Student Management System** designed to manage student records, attendance, examination marks, academic analytics, student reports, and report exports from a single dashboard.

The project demonstrates a complete academic management workflow involving **Admin, Teacher, and Parent roles**.

---

## 🚀 Features

### 🔐 Role-Based Login

StudentHub provides separate access levels for:

* 👨‍💼 Admin
* 👩‍🏫 Teacher
* 👨‍👩‍👧 Parent

Each role has access to features relevant to their responsibilities.

---

### 👨‍💼 Admin Module

The Admin can:

* Add new students
* Edit student information
* Delete student records
* Manage departments and sections
* View all students
* Search and filter students
* View dashboard analytics
* Generate academic reports
* Export student records
* Export academic performance
* Create a complete database backup

---

### 👩‍🏫 Teacher Module

Teachers can manage academic activities including:

#### Attendance Management

* Select attendance date
* Select section
* Mark students Present/Absent
* Mark all students present
* Save attendance records
* Automatically calculate attendance percentage

#### Marks Management

* Select examination
* Select subject
* Enter marks out of 100
* Automatically calculate grades
* Update existing marks

---

### 👨‍👩‍👧 Parent Module

Parents can view the student's academic report including:

* Student profile
* Department
* Section
* Attendance percentage
* Average marks
* Overall grade
* Subject-wise marks
* Examination details
* Attendance history

---

## 📊 Dashboard Analytics

The dashboard provides real-time academic statistics:

* Total Students
* Attendance Rate
* Number of Departments
* Average Marks
* Marks Overview Chart
* Attendance Overview Chart
* Recent Student Records

---

## 📑 Report & Export System

Administrators can export:

### Student CSV

Contains:

* Student ID
* Name
* Age
* Section
* Department
* Parent Name
* Parent Email
* Attendance Percentage
* Average Marks

### Academic Report CSV

Contains:

* Student ID
* Student Name
* Department
* Attendance Percentage
* Average Mark
* Grade

### Database Backup

The complete application data can also be exported as a JSON backup.

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Font Awesome
* Chart.js

### Browser Storage

* LocalStorage
* SessionStorage

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Live Server

---

## 📂 Project Structure

```text
StudentHub/
│
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## 🔄 Complete Workflow

```text
                 ┌──────────────┐
                 │     Login    │
                 └───────┬──────┘
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Admin          Teacher         Parent
          │              │              │
          ↓              ↓              ↓
   Add Students      Attendance      View Report
          │              │              │
          ↓              ↓              │
   Manage Students      Marks           │
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                  Dashboard Analytics
                         │
                         ↓
                  Generate Reports
                         │
                         ↓
                    Export Data
```

---

## 🔑 Demo Login Credentials

### Admin

```text
Email: admin@school.com
Password: admin123
```

### Teacher

```text
Email: teacher@school.com
Password: teacher123
```

### Parent

```text
Email: parent@school.com
Password: parent123
```

---

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/StudentHub.git
```

### 2. Open the project

```bash
cd StudentHub
```

### 3. Run the application

Open `index.html` using **VS Code Live Server**.

Alternatively, you can open `index.html` directly in a modern browser.

---

## 💾 Data Storage

This prototype uses the browser's:

```text
LocalStorage
SessionStorage
```

Student information, attendance and marks are stored locally in the browser.

> ⚠️ This is currently a frontend prototype. Data is not stored in a central server or database.

---

## 🔮 Future Enhancements

The project can be extended into a production-ready system by adding:

* Spring Boot / Node.js backend
* MySQL database
* Secure authentication
* Password hashing
* JWT authentication
* REST APIs
* Admin user management
* Teacher management
* Parent-student account linking
* Email notifications
* Attendance alerts
* Performance prediction using Machine Learning
* PDF report generation
* Cloud deployment
* Audit logs

---

## 🎯 Project Objective

The main objective of StudentHub is to provide a centralized platform for managing student academic information and demonstrate how different stakeholders—**administrators, teachers, and parents**—can interact with the same student data through role-specific workflows.

---

## 👩‍💻 Author

**Meera S**

Student Management System – StudentHub

---

## 📄 License

This project is created for educational and academic purposes.

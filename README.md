<div align="center">

<img src="frontend/public/ChatGPT Image Sep 29, 2025, 03_40_38 PM.png" alt="MedScope Logo" width="180"/>

# 🏥 MedScope
### Hospital Management System

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Entity Framework](https://img.shields.io/badge/Entity%20Framework%20Core-8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://learn.microsoft.com/en-us/ef/core/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Graduation Project** — Faculty of Computer Science  
> A comprehensive, role-based hospital management platform built with Clean Architecture.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Roles & Permissions](#-roles--permissions)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Team](#-team)

---

## 🔍 Overview

**MedScope** is a full-stack, multi-hospital management system designed to digitize and streamline healthcare operations. The system supports multiple hospitals under a single unified platform, enabling efficient management of doctors, patients, appointments, blood bank inventory, and bed availability.

The project follows **Clean Architecture** principles with a clear separation of concerns across Domain, Application, Infrastructure, and Presentation layers.

---

## ✨ Key Features

| Module | Description |
|---|---|
| 🔐 **Authentication & Authorization** | JWT-based login with role-based access control (RBAC) |
| 🏛️ **Super Admin Dashboard** | Manage all hospitals, admins, and system-wide reports |
| 🏥 **Admin Dashboard** | Manage doctors, patients, appointments, beds, and blood bank per hospital |
| 👨‍⚕️ **Doctor Portal** | View schedules, manage working hours, access patient records |
| 🧑‍🤝‍🧑 **Patient Portal** | Book appointments, view medical history, track notifications |
| 🛏️ **Bed Management** | Real-time bed availability tracking across hospital wards |
| 🩸 **Blood Bank** | Blood type inventory management and request handling |
| 🤖 **AI Chatbot** | Integrated chatbot for patient guidance and FAQs |
| 📊 **Reports & Analytics** | System-wide and hospital-specific reporting |
| 🌐 **Multi-language Support** | Full Arabic & English interface (i18n) |

---

## 🏗️ System Architecture

MedScope is built on **Clean Architecture**, ensuring high maintainability and testability:

```
MedScope Solution
├── MedScope.Domain          → Entities, Domain Models (no dependencies)
├── MedScope.Application     → Business Logic, DTOs, Interfaces, CQRS Handlers
├── MedScope.Infrastructure  → EF Core, Identity, Services, JWT, Email
└── MedScope.WebApi          → ASP.NET Core Controllers, Middleware, Swagger
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│              (Vite + React 18 + i18n)                │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / REST API
┌─────────────────────▼───────────────────────────────┐
│              ASP.NET Core Web API                    │
│         (Controllers + JWT Middleware)               │
├─────────────────────────────────────────────────────┤
│              Application Layer                       │
│         (Services, DTOs, Business Rules)             │
├─────────────────────────────────────────────────────┤
│             Infrastructure Layer                     │
│      (EF Core + Identity + SQL Server)               │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** ASP.NET Core 8.0 Web API
- **ORM:** Entity Framework Core 8
- **Database:** Microsoft SQL Server
- **Authentication:** ASP.NET Core Identity + JWT Bearer Tokens
- **Architecture:** Clean Architecture + Repository Pattern
- **Documentation:** Swagger / OpenAPI

### Frontend
- **Framework:** React 18 (Vite)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Internationalization:** react-i18next (Arabic / English)
- **Styling:** Vanilla CSS with modern UI design

---

## 👥 Roles & Permissions

| Role | Access Level |
|---|---|
| **Super Admin** | Full system access — manages hospitals, admins, global reports |
| **Admin** | Hospital-level access — manages doctors, patients, beds, blood bank |
| **Doctor** | Personal portal — schedules, working hours, patient records |
| **Patient** | Self-service — appointments, medical history, notifications |

> ⚠️ When a Super Admin **deactivates** an Admin account, the Admin is immediately blocked from logging in and receives a clear notification message.

---

## 📁 Project Structure

```
Medscope/
├── Backend/
│   └── MedScope/
│       ├── MedScope.Domain/           → Entities & Domain Models
│       ├── MedScope.Application/      → Business Logic & DTOs
│       ├── MedScope.Infrastructure/   → EF Core, Identity, Services
│       └── MedScope.WebApi/           → API Controllers & Swagger
├── frontend/
│   └── src/
│       ├── api/                       → Axios API services
│       ├── components/                → Reusable UI components
│       ├── pages/                     → Admin & Patient pages
│       ├── doctor/                    → Doctor portal pages
│       ├── Super-Admin/               → Super admin pages
│       └── i18n/                      → Arabic & English translations
└── database/                          → Database backup
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server)

### Backend Setup

```bash
# Navigate to backend
cd Backend/MedScope

# Restore packages
dotnet restore

# Update appsettings.json with your SQL Server connection string

# Apply database migrations
dotnet ef database update --project MedScope.Infrastructure --startup-project MedScope.WebApi

# Run the API
dotnet run --project MedScope.WebApi
```

API will be available at: `https://localhost:7003`  
Swagger UI: `https://localhost:7003/swagger`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📖 API Documentation

The API is fully documented via **Swagger UI**.  
After running the backend, visit: [`https://localhost:7003/swagger`](https://localhost:7003/swagger)

### Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Auth/login` | User login (all roles) |
| `POST` | `/api/Auth/register` | Patient registration |
| `GET` | `/api/SuperAdmin/admins` | List all admins |
| `PATCH` | `/api/SuperAdmin/admins/{id}/toggle-status` | Activate / Deactivate admin |
| `GET` | `/api/Admin/dashboard` | Admin dashboard stats |
| `GET` | `/api/Doctor/appointments` | Doctor appointments |
| `POST` | `/api/Booking` | Book an appointment |

---

## 👨‍💻 Team

> Graduation Project — Computer Science Department

### 🔧 Backend Development
| Name | Student ID |
|---|---|
| Fares Gamal Nady | 2202096 |
| Malak Mustafa Awais | 2202606 |
| Youssef Ahmed Eid | 2202052 |
| Tasneem Khaled Rostom | 2202006 |

### 🤖 AI Integration
| Name | Student ID |
|---|---|
| Ahmed Ali Ahmed | 2202123 |

### 🎨 Frontend Development
| Name | Student ID |
|---|---|
| Khaled Ahmed Sayed | 2202035 |
| Ziad Mahmoud Mohamed | 2202046 |
| Eslam Ali Mahrous | 2202099 |

### 🖌️ UI / UX Design
| Name | Student ID |
|---|---|
| Reham Abdel-Tawab Mohamed | 2202008 |



---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**MedScope** — *Transforming Healthcare Management*  
Made with ❤️ as a Graduation Project

</div>
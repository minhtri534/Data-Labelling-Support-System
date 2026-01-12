# Fullstack Project Context: C# .NET & React (Shadcn UI)

## 🛠 1. Tech Stack Summary
- **Backend:** C# (.NET 8/9+), ASP.NET Core Web API.
- **Frontend:** ReactJS (Vite), TypeScript, Tailwind CSS.
- **UI & UX:** Shadcn UI (Radix UI), Lucide React (Icons), Framer Motion (Animations).
- **Data Management:** EF Core (SQL Server), TanStack Query (React Query), Axios.
- **Architecture:** Clean Architecture, Layered Pattern (Controller-Service-Repository).

## 🤖 2. Model Roles & Instructions

### 🎨 Frontend Specialist (Preferred: Claude Sonnet 4.5)
- **UI Components:** Always use **Shadcn UI** components. Assume they are located in `@/components/ui`.
- **Modern UX:** Use **Framer Motion** for subtle entrance animations (e.g., `initial={{ opacity: 0, y: 10 }}`).
- **Icons:** Use **Lucide React** icons exclusively.
- **Data Fetching:** Use **TanStack Query** for caching, loading states, and error handling.
- **Styling:** Use **Tailwind CSS** following a mobile-first approach.
- **Types:** Strictly use **TypeScript Interfaces** that match Backend DTOs.
- **Canvas Interaction:** Use **react-konva** for drawing bounding boxes and polygons. Focus on coordinate scaling between the displayed image and the original image size.

## 📂 Frontend Structure (ReactJS / Vite)
Follow this folder structure for the Frontend:
- **components/**: Shared UI components (Atomic design).
- **pages/**: Main views (Dashboard, Editor, Project List).
- **hooks/**: Custom hooks for logic (Annotation tools, API fetching).
- **services/**: API calls using Axios.
- **stores/**: Global state management (Zustand/Redux).
- **types/**: TypeScript interfaces (match Backend DTOs).
- **utils/**: Helper functions (Coordinate scaling, Image formatting).
- **lib/**: Library configurations (Canvas engine, Axios instances).
- **schemas/**: Zod validation schemas for forms.
- **contexts/ & providers/**: Global React contexts (Auth, Theme).

### ⚙️ Backend Specialist (Preferred: GPT-5.2)
- **Modern C#:** Use **Primary Constructors**, **File-scoped namespaces**, and **Records** for DTOs.
- **Logic Flow:** Use **Result Pattern** (`Result<T>` or `ServiceResponse<T>`) instead of throwing exceptions for business logic.
- **Validation:** Use **FluentValidation** for all incoming request models.
- **Database:** Use **EF Core** with LINQ. Use `.AsNoTracking()` for read-only queries.
- **Mapping:** Use **AutoMapper** or **Mapster** to convert Entities to DTOs.
- **Security:** Ensure JWT-based authentication and Role-based authorization are implemented.
- **Large Data Handling:** Optimize API for handling large image datasets and JSON blobs for complex annotations.

## 📂 Backend Structure (C# / .NET)
Please follow this folder structure for the Backend:
- **Controllers/**: Handle HTTP requests and routing.
- **Services/**: Business logic (Labeling workflows, Export logic).
- **Models/**: Entity Framework entities and Database context.
- **DTOs/**: Data Transfer Objects (Request/Response models).
- **Middlewares/**: Custom error handling and Auth.
- **Configurations/**: DB connection, JWT settings, File storage paths.
- **Utils/**: Helper classes (Image processing, Coordinate conversion).
- **Validations/**: FluentValidation classes.

### 🏗 Project Architect (Preferred: Gemini 3 Pro)
- **Workspace:** Analyze the relationship between `Controllers` (C#) and `Services` (React) to ensure consistency.
- **Global Config:** Monitor `Program.cs` for middleware and `package.json` for dependencies.

## 📏 3. Coding Standards & Naming
- **C#:** PascalCase for Classes/Methods, camelCase for local variables. Use `async/await` everywhere.
- **React:** PascalCase for Components, camelCase for functions/variables. Use Functional Components with Hooks.
- **Database:** PascalCase for Table and Column names in SQL Server.
- **Standardized Response:** All API responses must follow the structure: `{ "isSuccess": bool, "data": T, "message": string, "errors": [] }`.

## 🚀 4. Performance & Quality
- Implement **Global Exception Handling** middleware in .NET.
- Use **Skeleton Loaders** (Shadcn) in React while TanStack Query is fetching.
- Prioritize **Clean Code** (DRY, SOLID) and self-documenting code.
## ⚙️ Core Framework & Language

- **React** – For building the user interface.
- **TypeScript** – For static type checking and safer code.

---

## 🎨 UI & Styling

- **Material-UI (MUI)** – Ready-made, accessible, and customizable UI components.
- **Emotion** – CSS-in-JS styling used internally by MUI.

---

## 🔀 Routing

- **React Router DOM** – For client-side navigation and route protection.

---

## 🔐 Authentication

- **JWT (via localStorage)** – Used to store and send authentication tokens with API requests.

---

## 📡 HTTP & API

- **Axios** – For making HTTP requests to the backend API.

---

## ✅ Form Management & Validation

- **React Hook Form** – Efficient and scalable form state management.
- **Yup** – Schema-based form validation with user-friendly error messages.
- **@hookform/resolvers** – Integrates Yup schemas into React Hook Form.

---

## 🧪 Testing

- **React Testing Library** – Testing React components with user-focused interactions.
- **Jest** – For running unit and integration tests.
- **@testing-library/user-event** – Simulates user actions in tests.
- **@testing-library/jest-dom** – Adds custom DOM matchers to Jest.

---

## 🛠 Build & Tooling

- **Create React App (CRA)** – For zero-config build, test, and development scripts.
- **Web Vitals** – For measuring and reporting web performance metrics.

---

## 📘 Type Definitions

- **@types/react**, **@types/react-dom**, **@types/node**, **@types/jest** – TypeScript support for major libraries.

---

## 🧹 Linting & Browser Support

- **ESLint** – For code linting and quality enforcement.
- **Browserslist** – To define supported browsers for builds.

---

## 🗂 Project Structure Highlights

- `src/pages/` – Pages like **Login**, **Register**, **Dashboard**, **CourseList**, **CreateCourse**.
- `src/components/` – Reusable UI components like **StudentDashboard**, **InstructorDashboard**.
- `src/routes/` – Routing utilities like **PrivateRoute**.
- `src/services/api.ts` – Centralized API logic.
- `src/types/` – Type definitions.
- `src/validators/` – Form validation schemas like `authValidators.ts`, `courseValidators.ts`.
- Forms use **React Hook Form** and **Yup** for robust validation.

---

## 📦 How to Start

```bash
npm install
npm start

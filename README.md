### Core Framework & Language
- **React**: For building the user interface.
- **TypeScript**: For static type checking and safer code.

### UI & Styling
- **Material-UI (MUI)**: For ready-made, accessible, and customizable UI components.
- **Emotion**: For CSS-in-JS styling, used by MUI.

### Routing
- **React Router DOM**: For client-side navigation and route protection.

### HTTP & API
- **Axios**: For making HTTP requests to the backend API.

### Authentication
- **JWT (via localStorage)**: For storing and sending authentication tokens with API requests.

### Form Management & Validation
- **React Hook Form**: For efficient and scalable form state management.
- **Yup**: For schema-based form validation, providing user-friendly error messages and enforcing input rules.
- **@hookform/resolvers**: To connect Yup validation schemas with React Hook Form.

### Testing
- **React Testing Library**: For testing React components in a user-centric way.
- **Jest**: For running unit and integration tests.
- **@testing-library/user-event**: For simulating user interactions in tests.
- **@testing-library/jest-dom**: For custom DOM matchers in tests.

### Build & Tooling
- **Create React App (react-scripts)**: For zero-config build, test, and development scripts.
- **Web Vitals**: For measuring and reporting web performance metrics.

### Type Definitions
- **@types/react, @types/react-dom, @types/node, @types/jest**: For TypeScript type support.

### Linting & Browser Support
- **ESLint**: For code linting and quality.
- **Browserslist**: For specifying supported browsers.

---

## 🗂 Project Structure Highlights

- Components are modularized in `src/components/`.
- API logic is centralized in `src/services/api.ts`.
- Type definitions are in `src/types/`.
- Forms use **React Hook Form** and **Yup** for robust validation.

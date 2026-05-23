# 🚀 Jira Clone — Full-Stack Agile Management Tool

A production-ready, highly responsive **Jira Clone** built using the **MERN stack**. This application mimics core functionalities of Atlassian Jira, enabling engineering teams to create workspaces, manage separate projects, and track task progress visually through an interactive Kanban board workflow.

---

## ✨ Key Features

* **🔒 Secure Authentication & Data Isolation:** Fully integrated JWT-based login/signup system with protected routing, ensuring users can only access their specific project workspaces.
* **📂 Dynamic Workspace Creation:** Users can create multiple project boards simultaneously. Each workspace generates a unique MongoDB Object ID handled via dynamic frontend routing (`/projects/:id`).
* **📊 Visual Kanban Board Workflow:** Fully operational agile interface categorized into **To Do**, **In Progress**, and **Done** stages, complete with automated real-time task counters.
* **🏷️ Rich Task Management:** Support for dynamic task creation featuring title, detailed descriptions, priority badges (High, Medium, Low), and automated user initials allocation for assignees.
* **⚙️ Multi-Port Dev Resilience (CORS Fix):** Configured a dynamic CORS middleware array on the Express backend to securely accept traffic from changing local development environments (`localhost:5173` & `5174`) seamlessly.

---

## 🛠️ Tech Stack Used

* **Frontend:** React.js, Tailwind CSS, Vite, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

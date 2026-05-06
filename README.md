# 📡 Content Broadcasting System (Frontend)

## 🚀 Overview

This project is a **Content Broadcasting System Frontend** built using **Next.js / React** for educational environments.

The system enables:

* 👩‍🏫 Teachers to upload subject-based content
* 🧑‍💼 Principals to approve or reject content
* 🎓 Students (public users) to view live broadcast content

The application focuses on **scalable architecture, clean code practices, and real-world frontend engineering**.

---

## ✨ Features

### 🔐 Authentication & Role-Based Access

* Login with email & password
* Role-based routing (Teacher / Principal)
* Protected routes for authorized access

---

### 👩‍🏫 Teacher Panel

* Dashboard (Total / Pending / Approved / Rejected)
* Upload content with validation
* File preview before upload
* Scheduling (Start time, End time, Rotation)
* View content status
* Rejection reason display

---

### 🧑‍💼 Principal Panel

* Dashboard with content statistics
* View all uploaded content
* Filter by status & search
* Approve content
* Reject content with reason (modal)

---

### 🎓 Public Live Page

**Route:** `/live/:teacherId`

* Displays currently active content
* Shows title, subject & preview
* No authentication required
* Includes:

  * Loading state
  * Empty state ("No content available")
  * Optional auto-refresh (polling)

---

## 🛠 Tech Stack

* **Frontend:** Next.js / React
* **Styling:** Tailwind CSS
* **Forms:** React Hook Form
* **Validation:** Zod / Yup
* **API Handling:** Axios / Fetch
* **State Management:** Context API / Hooks

---

## 📁 Project Structure

```bash
src/
 ├── components/     # Reusable UI components
 ├── pages/ / app/   # Routing
 ├── layouts/        # Layouts (Navbar, Sidebar)
 ├── services/       # API service layer
 ├── hooks/          # Custom hooks
 ├── context/        # Global state (auth, etc.)
 ├── utils/          # Helper functions
```

---

## 🔌 API Integration

* All API calls are handled through a **service layer**
* No direct API calls inside components ❌
* Easily replaceable backend design

```bash
services/
 ├── auth.service.js
 ├── content.service.js
 ├── approval.service.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PrinceGupta7151/content-broadcasting-system.git
cd content-broadcasting-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the project

```bash
npm run dev
```

---

## 🔑 Demo Credentials

**Teacher**

```
email: teacher@test.com
password: 123456
```

**Principal**

```
email: principal@test.com
password: 123456
```

---

## ⚡ Performance Optimizations

* Memoization to prevent unnecessary re-renders
* Efficient rendering for large lists (500–1000 items)
* Optimized image previews

---

## ⚠️ Edge Case Handling

* Invalid login
* API failures
* Empty data
* Slow responses
* Upload failure
* Invalid file type/size
* Broken API responses

---

## 🎨 UI/UX Features

* Responsive design
* Navbar / Sidebar layout
* Dashboard cards
* Tables / Lists
* Forms with validation
* Modal (reject reason)
* Toast notifications
* Skeleton loaders

---

## 📄 Documentation

Refer to **Frontend-notes.txt** for:

* Architecture decisions
* Authentication flow
* Role-based routing
* API integration approach
* State management
* Assumptions

---

## 🚀 Future Improvements

* React Query / TanStack Query
* Pagination
* Dark Mode
* Drag-and-drop upload
* Auto-refresh (polling)

---

## 👨‍💻 Author

**Prince Gupta**

---

## 📌 Final Note

This project demonstrates **clean frontend architecture, reusable component design, robust API integration, and real-world UI handling**, making it scalable and production-ready.

---

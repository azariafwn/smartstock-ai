<div align="center">

# SᴍᴀʀᴛSᴛᴏᴄᴋ AI 🚀
### Next-Gen Inventory Management System with Advanced Analytics & Security

<img src="screenshots/login.png" width="800" alt="SmartStock AI Login">

---

**SᴍᴀʀᴛSᴛᴏᴄᴋ AI** is a professional-grade warehouse and inventory management solution built for speed, security, and scalability. Featuring a sleek glassmorphism UI, role-based access control, and automated reporting systems.

[ [Demo Live (Coming Soon)](#) ]

</div>

---

## 💎 Features Highlight

* **Futuristic Dashboard**: Real-time analytics with interactive charts (Monthly/Weekly data).
* **Role-Based Access Control (RBAC)**: Distinct permissions for Superadmin, Admin, and Staff.
* **Automated Reporting**: Export professionally branded PDF & Excel reports.
* **Approval System**: Secure transaction flow requiring Admin/Superadmin verification.
* **Smart Inventory**: Full CRUD with categorized tracking and restock indicators.
* **Demo Mode Protection**: Secure trial environment with "Read-Only" middleware for portfolio visitors.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Laravel 11** | Robust Backend Framework & API Management |
| **React.js** | Interactive Frontend Library |
| **Inertia.js** | Single Page Application (SPA) Bridge |
| **Tailwind CSS** | Styling & Glassmorphism Design System |
| **MySQL** | Reliable Relational Database |
| **Vite** | Lightning-fast Frontend Build Tool |
| **SweetAlert2** | Interactive User Notifications & Alerts |

---

## 🛡️ Portfolio Demo Mode

To ensure system integrity while allowing recruiters to explore, this project includes a **Restricted Demo Mode**:

* **Demo Account**: `superadmin@demo.com` / `password123`
* **Protection**: Attempts to modify data (Create/Update/Delete) via the demo account are intercepted by a custom `PreventDemoModify` middleware.
* **Feedback**: Users receive a professional SweetAlert2 notification explaining the restriction.

---

## 📸 Screenshots Gallery

### 🖥️ Secure Login Interface
*Futuristic login with glassmorphism effects and scan animation.*
<img src="screenshots/login.png" width="900" alt="Login Page">

### 📊 Real-time Dashboard (System Intelligence)
*Overview of stock levels, recent transactions, and neural stock analysis.*
<img src="screenshots/dashboard.png" width="900" alt="Dashboard Page">

### 📦 Warehouse & Inventory Control
*Centralized management for digital assets with real-time stock monitoring.*
<img src="screenshots/inventory.png" width="900" alt="Inventory Page">

### ⚡ Movement Control & Approvals
*Logistics command center for asset movement and multi-level approval system.*
<img src="screenshots/transactions.png" width="445" alt="Transactions"> <img src="screenshots/approvals.png" width="445" alt="Approvals">

### 🛡️ Secure Demo Experience
*Custom middleware protection for portfolio trial accounts.*
<img src="screenshots/demo-restricted.png" width="600" alt="Demo Restricted Alert">

---

## 🚀 Installation

Follow these steps to set up the project locally:

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/yourusername/smartstock-ai.git](https://github.com/yourusername/smartstock-ai.git)
    cd smartstock-ai
    ```

2.  **Backend Setup**
    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate
    ```

3.  **Database Configuration**
    Set up your `.env` database details, then run:
    ```bash
    php artisan migrate --seed
    ```

4.  **Frontend Setup**
    ```bash
    npm install
    npm run dev
    ```

---
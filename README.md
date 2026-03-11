# 🍔 Food Ordering System

The **Food Ordering System** is a web-based application that allows users to browse restaurants, view food menus, and place food orders online.  

This project demonstrates the implementation of a basic **full-stack web application** using **Node.js, Express.js, HTML, CSS, JavaScript, and SQLite**.

The system is designed with a simple architecture that separates the **user interface, application logic, and database**, making the project organized and easy to understand.

---

## 📌 Project Overview

This project simulates the workflow of an **online food ordering platform**.

Users can perform the following actions:

- Register and create an account  
- Log in to the system  
- Browse available restaurants  
- View food menu items  
- Place food orders  

The backend server processes user requests and interacts with the database to store and retrieve information such as **user details, restaurant data, menu items, and orders**.

---

## 🏗️ System Architecture

The application follows a **three-layer architecture**.

### Client Layer

The client layer represents the web interface accessed through a browser.

- Built using **HTML, CSS, and JavaScript**
- Provides the user interface for interaction
- Sends HTTP requests to the backend server

### Application Layer

The application layer is implemented using **Node.js with Express.js**.

It contains the following modules:

**Authentication Module**
- User registration
- User login

**Restaurant Module**
- View available restaurants

**Menu Module**
- View food items

**Order Module**
- Place orders
- Manage orders

### Database Layer

The database layer stores all application data using **SQLite**.

It contains the following tables:

- Users
- Restaurants
- Menu
- Orders

The backend communicates with the database using **SQL queries**.

---

## ⚙️ Technologies Used

The system is built using the following technologies:

- **Node.js** – Backend runtime environment  
- **Express.js** – Web server framework  
- **SQLite** – Lightweight database  
- **HTML** – Structure of the web pages  
- **CSS** – Styling and layout  
- **JavaScript** – Client-side functionality  
- **GitHub** – Version control and project hosting  

---

## 📂 Project Structure

The project is organized into different folders to keep the system **modular and easy to maintain**.

- **public/**  
  Contains static files such as CSS, JavaScript, images ,HTML pages like login, registration, and menu pages.

- **database/**  
  Contains the SQLite database file.

- **server.js**  
  Main backend server file that runs the application.

- **package.json**  
  Contains project dependencies and configuration.

---

## 🚀 Installation and Setup

Follow these steps to run the project locally.

### 1️⃣ Clone the repository


git clone https://github.com/Anushapeddapalli/DBMS_MiniProject.git


### 2️⃣ Navigate to the project folder


cd food-ordering-system


### 3️⃣ Install dependencies


npm install


### 4️⃣ Start the server


node server.js


### 5️⃣ Open in browser


http://localhost:3000


---

## ✨ Features

The system provides several important features:

- User registration and login  
- Restaurant browsing  
- Viewing menu items  
- Placing food orders  
- Data storage using SQLite database  

---


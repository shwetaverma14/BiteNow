## 📦 Project: BiteNow &nbsp;&nbsp;&nbsp; [🌐 Live Website](https://bitnoww.netlify.app)

---

## 🚀 Inspiration

In a world where convenience meets necessity, **BiteNow** emerges as a seamless and efficient food delivery platform designed to bring delicious meals right to your doorstep.

Whether you're craving a quick bite or a lavish feast, BiteNow offers a hassle-free experience—from easy registration and login to exploring a diverse range of food categories, adding your favorite meals to **My Cart**, and tracking your orders in **My Orders**.

We live in a fast-paced world where time is of the essence. BiteNow ensures that your food cravings are met with just a few taps, saving you time and effort. With an intuitive interface and a smooth ordering process, it redefines food delivery—making it simpler, faster, and more reliable.

> *Join BiteNow today and experience food delivery like never before—because great food should always be just a click away!*

---

## 🧾 What It Does

BiteNow is a food delivery application where users can:

- Register and log in to access a personalized experience.
- Explore a variety of food categories and dishes.
- Add favorite meals to **My Cart** before placing an order.
- Track placed orders in the **My Orders** section for a smooth, transparent delivery process.

BiteNow is designed to make food ordering more **convenient**, **efficient**, and **enjoyable**—bringing delicious meals to your doorstep with just a few clicks.

---

## 🛠️ Tech Stack

### 🔹 Frontend:
- React.js  
- HTML5, CSS3  
- JavaScript  
- Axios  

### 🔹 Backend:
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### 🔐 Authentication & Security:
- JSON Web Tokens (JWT)  
- bcrypt.js  

### 🔧 Tools & Deployment:
- Git & GitHub  
- Postman  
- **Netlify** (Frontend)  
- **Render** (Backend)

---

## 🏗️ How We Built It

The **frontend** of BiteNow is built using **React.js** and **Bootstrap** for styling and responsive UI components. Authentication is implemented using **bcrypt** for password hashing and **JWT** for secure token-based authentication.

The **backend** is developed using **Node.js** and **Express.js**, with middleware like `jsonwebtoken` for authentication and **CORS** to enable secure cross-origin requests. User and order data are stored in a **MongoDB** database for scalable, NoSQL storage.

---

## 🏆 Accomplishments We're Proud Of

- ✅ Successfully built the entire BiteNow application (frontend + backend) as a solo developer.  
- ✅ Ensured smooth and responsive UX across all pages.  
- ✅ Solved challenges in authentication, data handling, and deployment.  
- ✅ Turned a vision into a fully functional, real-world project with confidence and dedication.

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](src/images/Landing%20Page.PNG)

### 🍽️ Items List
![Items List](src/images/Items%20List.PNG)

### 🔐 Login Page
![Login Page](src/images/Login%20Page.PNG)

### 🛒 My Cart
![My Cart](src/images/My%20Cart.PNG)

### 📦 My Orders
![My Orders](src/images/My%20Orders.PNG)

---

## ⚙️ Installation

Follow these steps to set up the project locally:

### 1. Clone Repository

```bash
git clone https://github.com/shwetaverma14/BiteNow.git
cd BiteNow
```

### 2. Open in VS Code

```bash
code .
```

### 3. Install dependencies for backend

```bash
npm install
```

### 4. Install dependencies for frontend

```bash
cd client
npm install
cd ..
```

### 5. Set up environment variables

- **Backend**:
  - Copy `.env.example` to `.env` inside the `/backend` folder.
  - Update the values (e.g., MongoDB URI, JWT secret).

- **Frontend**:
  - Configure environment variables if needed in `/client/src`.

### 6. Run the Application

```bash
# Run the backend
npm run dev
```

```bash
# In a new terminal, run the frontend
cd client
npm start
```

🙌 Thanks for checking out **BiteNow**!


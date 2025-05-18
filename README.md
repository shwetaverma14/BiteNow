# Project : BiteNow                                                 [🌐 Live Website](https://bitnoww.netlify.app)

# Inspiration : 
In a world where convenience meets necessity, BiteNow emerges as a seamless and efficient food delivery platform, designed to bring delicious meals right to your doorstep. Whether you're craving a quick bite or a lavish feast, BiteNow offers a hassle-free experience—from easy registration and login to exploring a diverse range of food categories, adding your favorite meals to My Cart, and tracking your orders in My Orders.<br>
We live in a fast-paced world where time is of the essence. BiteNow ensures that your food cravings are met with just a few taps, saving you time and effort. With an intuitive interface and a smooth ordering process, it redefines food delivery, making it simpler, faster, and more reliable.<br>
Join BiteNow today and experience food delivery like never before—because great food should always be just a click away!
# What it does :
We aim to provide a food delivery application where users can register and log in to access a seamless food ordering experience. Users can explore a variety of food categories, select their favorite dishes, and add them to My Cart before placing an order.<br>
Once an order is placed, users can track their purchases in the My Orders section, ensuring a smooth and transparent delivery process. BiteNow is designed to make food ordering more convenient, efficient, and enjoyable, bringing delicious meals to your doorstep with just a few clicks.
# How we built it
The frontend of Bitenow is built using React.js, with Bootstrap for styling and a responsive user interface. The authentication system is implemented using bcrypt for password hashing and JWT (JSON Web Token) for secure user authentication.<br>

The backend is developed using Node.js and Express.js, incorporating middleware like JWT for token generation and authentication, and CORS to enable seamless communication between the frontend and backend. All user and order-related data is stored in a NoSQL database, MongoDB, ensuring efficient and scalable data management.
# Accomplishments that we're proud of
* Successfully built the entire BiteNow application from scratch, implementing both the frontend and backend as a solo developer.<br>
* Completed the project on time while ensuring a smooth and responsive user experience.<br>
* Overcame challenges in authentication, database management, and seamless integration of features.<br>
* Brought my vision to life, proving that dedication and persistence can turn an idea into a fully functional application.<br>
# Screenshots of the project:
## Landing Page
![Landing Page](src/images/Landing%20Page.PNG)
## Items List
![Items List](src/images/Items%20List.PNG)
## Login Page
![Login Page](src/images/Login%20Page.PNG)
## My Cart
![My Cart](src/images/My%20Cart.PNG)
## My Orders
![My Orders](src/images/My%20Orders.PNG)

# Installation
1. Clone repository:
```bash
$ git clone https://github.com/shwetaverma14/BiteNow.git
```

2. Open in VS Code:
```bash
cd BiteNow && code .
```
3. Install dependencies:
```bash
$ npm install
```
4. Set up environment variables
Backend: Copy .env.example to .env in /backend and update values
Frontend: Configure if needed in /src

5. Run example:
```bash
npm start
```







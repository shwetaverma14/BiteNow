import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink instead of Link
import Badge from 'react-bootstrap/Badge';
import { useCart } from './CartContext'; // Import useCart
import './Navbar.css'; // Import custom CSS for hover effects

export default function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Access cart items from CartContext
  const [isShaking, setIsShaking] = useState(false); // State to control the shake effect

  // Calculate the total number of items in the cart
  const cartItemCount = cartItems ? cartItems.length : 0;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Function to handle the Home button click
  const handleHomeClick = () => {
    setIsShaking(true); // Trigger the shake effect
    setTimeout(() => {
      setIsShaking(false); // Reset the shake effect after the animation completes
    }, 500); // Match the duration of the shake animation
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className={isShaking ? 'website-shake' : ''}> {/* Apply shake-effect class conditionally */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <NavLink className="navbar-brand gs-1 fst-italic" to="/">
            BitNow
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item">
                <NavLink
                  className="nav-link fs-5 nav-hover"
                  to="/"
                  exact // Ensure exact match for the home route
                  onClick={handleHomeClick} // Trigger the shake effect on click
                >
                  Home
                </NavLink>
              </li>
              {localStorage.getItem("authToken") ? (
                <li className="nav-item">
                  <NavLink className="nav-link fs-5 nav-hover" to="/myorders">
                    My Orders
                  </NavLink>
                </li>
              ) : (
                ""
              )}
            </ul>
            <div className="d-flex">
              {/* Show "My Cart" button for all users */}
              <div className="btn bg-white text-success mx-2" onClick={() => navigate("/cart")}>
                My Cart{" "}
                <Badge pill bg="danger">
                  {cartItemCount} {/* Display the number of items in the cart */}
                </Badge>
              </div>

              {/* Show Login/SignUp or Logout based on authentication status */}
              {localStorage.getItem("authToken") ? (
                <div className="btn bg-white text-danger mx-2" onClick={handleLogout}>
                  Logout
                </div>
              ) : (
                <>
                  <NavLink className="btn bg-white text-success mx-1" to="/login">
                    Login
                  </NavLink>
                  <NavLink className="btn bg-white text-success mx-1" to="/createuser">
                    SignUp
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
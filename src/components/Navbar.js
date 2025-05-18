import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { useCart } from './CartContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isShaking, setIsShaking] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems ? cartItems.length : 0;
  const isAuthenticated = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={isShaking ? 'website-shake' : ''}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <NavLink 
            className="navbar-brand" 
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            BiteNow
          </NavLink>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                  exact
                  onClick={handleHomeClick}
                >
                  Home
                </NavLink>
              </li>
              
              {isAuthenticated && (
                <li className="nav-item">
                  <NavLink 
                    className="nav-link" 
                    to="/myorders"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </NavLink>
                </li>
              )}
            </ul>
            
            <div className="auth-section">
              <button 
                className="cart-btn"
                onClick={() => {
                  navigate("/cart");
                  setIsMobileMenuOpen(false);
                }}
              >
                My Cart
                {cartItemCount > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {cartItemCount}
                  </Badge>
                )}
              </button>
              
              {isAuthenticated ? (
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink 
                    className="login-btn"
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    className="signup-btn"
                    to="/createuser"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
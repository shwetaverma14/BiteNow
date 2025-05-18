import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart, useDispatchCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from '../screens/background.png';

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const cartItems = data.cartItems || [];
  const totalPrice = cartItems.reduce((total, food) => total + food.price * food.qty, 0);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentConfirmation = async (payment_id, order_id, email, order_data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id, order_id, email, order_data }),
      });
  
      const response = await res.json();
      
      if (response.success) {
        dispatch({ type: "CLEAR_CART" });
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Payment confirmation failed' };
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      return { success: false, message: 'Network error during payment confirmation' };
    }
  };

  const handleCheckOut = async () => {
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
  
    if (!authToken || !userEmail) {
      alert('Please log in to place an order.');
      return;
    }
  
    if (cartItems.length === 0) {
      setPaymentError('Your cart is empty.');
      return;
    }
    setLoading(true);
    setPaymentError(null);
    try {
      // Create Razorpay order using the Render backend
      const response = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount: totalPrice * 100 }),
      });
  
      if (!response.ok) throw new Error('Failed to create order');
  
      const order = await response.json();
      const { id: orderId, amount, currency } = order;
  
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isScriptLoaded) throw new Error('Failed to load Razorpay script');
  
      // Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency || 'INR',
        name: 'Your Company Name',
        description: 'Payment for your order',
        order_id: orderId,
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id } = response;
          const order_data = cartItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.qty,
            size: item.size,
            img: item.img || 'default_image_url',
          }));
          handlePaymentConfirmation(razorpay_payment_id, razorpay_order_id, userEmail, order_data);
        },
        prefill: {
          name: 'Customer Name',
          email: userEmail,
          contact: '9999999999',
        },
        theme: { color: '#F37254' },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between", 
      backgroundImage: `url(${backgroundImage})`, // Add background image
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat", 
      animation: "zoomBackground 10s infinite alternate ease-in-out" 
    }}>
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content */}
      {cartItems.length === 0 ? (
        <div style={{ 
          flexGrow: 1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center" 
        }}>
          <div className="m-5 w-100 text-center fs-3 text-white">The Cart is Empty!</div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
          <div
            className="shadow p-4 rounded"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)", 
              maxWidth: "800px", 
              width: "100%", 
              margin: "20px", 
              transform: "perspective(1000px) rotateY(10deg)", 
              transition: "transform 0.5s ease", 
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "perspective(1000px) rotateY(10deg)"}
          >
            {/* My Items Heading */}
            <h1 className="text-center mb-4" style={{ color: "#333" }}>My Items</h1>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" style={{ color: "#333" }}>SNo.</th>
                    <th scope="col" style={{ color: "#333" }}>Name</th>
                    <th scope="col" style={{ color: "#333" }}>Quantity</th>
                    <th scope="col" style={{ color: "#333" }}>Size</th>
                    <th scope="col" style={{ color: "#333" }}>Price</th>
                    <th scope="col" style={{ color: "#333" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((food, index) => (
                    <tr key={index}>
                      <th scope="row" style={{ color: "#555" }}>{index + 1}</th>
                      <td style={{ color: "#555" }}>{food.name}</td>
                      <td style={{ color: "#555" }}>{food.qty}</td>
                      <td style={{ color: "#555" }}>{food.size}</td>
                      <td style={{ color: "#555" }}>₹{food.price * food.qty}/-</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => dispatch({ type: "REMOVE", index })}
                        >
                          <DeleteIcon /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Price */}
            <div className="text-end mt-4">
              <h3 style={{ color: "#333" }}>Total Price: ₹{totalPrice}/-</h3>
            </div>

            {/* Checkout Button */}
            <div className="text-center mt-4">
              <button 
                className="btn btn-success btn-lg" 
                onClick={handleCheckOut} 
                disabled={loading} // Disable button during loading
              >
                {loading ? "Processing..." : "Check Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer at the bottom */}
      <Footer />

      {/* Add background animation keyframes */}
      <style>
        {`
          @keyframes zoomBackground {
            0% {
              background-size: 100% auto;
            }
            100% {
              background-size: 120% auto;
            }
          }
        `}
      </style>
    </div>
  );
}
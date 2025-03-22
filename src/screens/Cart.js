import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart, useDispatchCart } from "../components/CartContext";
import Navbar from "../components/Navbar"; // Import Navbar
import Footer from "../components/Footer"; // Import Footer
import backgroundImage from '../screens/background.png'; // Import background image

export default function Cart() {
  const data = useCart(); // data is an object with cartItems and dispatch
  const dispatch = useDispatchCart();
  const [loading, setLoading] = useState(false); // Add loading state

  // Use data.cartItems instead of data
  const cartItems = data.cartItems || [];

  // Calculate total price using cartItems
  const totalPrice = cartItems.reduce((total, food) => total + food.price * food.qty, 0);

  // Load Razorpay script dynamically
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Handle payment confirmation
  const handlePaymentConfirmation = async (payment_id, order_id, email, order_data) => {
    console.log('Payment confirmation data:', { payment_id, order_id, email, order_data }); // Debug log
  
    try {
      const res = await fetch('http://localhost:5000/api/payment-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_id, order_id, email, order_data }),
      });
  
      const response = await res.json();
      console.log('Payment confirmation response:', response); // Debug log
  
      if (response.success) {
        alert('Order placed successfully!');
        dispatch({ type: "CLEAR_CART" }); // Clear the cart
      } else {
        alert('Failed to confirm payment. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('An error occurred while confirming payment.');
    }
  };

  // Handle checkout
  const handleCheckOut = async () => {
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    console.log('Retrieved authToken from localStorage:', authToken); // Debug log
    console.log('Retrieved userEmail from localStorage:', userEmail); // Debug log
  
    // Check if the user is logged in
    if (!authToken || !userEmail) {
      alert('Please log in to place an order.');
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      // Step 1: Create a Razorpay order
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include auth token in the request
        },
        body: JSON.stringify({
          amount: totalPrice * 100, // Convert to paise
        }),
      });
  
      console.log('Create Order Response:', response); // Debug log
  
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
  
      const order = await response.json();
      console.log('Razorpay Order:', order); // Debug log
      const { id: orderId, amount, currency } = order;
  
      // Step 2: Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }
  
      // Step 3: Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use environment variable
        amount: amount, // Amount in paise
        currency: currency || 'INR',
        name: 'Your Company Name',
        description: 'Payment for your order',
        order_id: orderId, // Use the order ID from Razorpay
        handler: function (response) {
          // Handle payment success
          const { razorpay_payment_id, razorpay_order_id } = response;
          const order_data = cartItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.qty,
            size: item.size,
            img: item.img || 'default_image_url', // Ensure img is provided
          }));
  
          handlePaymentConfirmation(razorpay_payment_id, razorpay_order_id, userEmail, order_data);
        },
        prefill: {
          name: 'Customer Name',
          email: userEmail,
          contact: '9999999999',
        },
        notes: {
          address: 'Customer Address',
        },
        theme: {
          color: '#F37254',
        },
      };
  
      const rzp = new window.Razorpay(options); // Use window.Razorpay
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
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
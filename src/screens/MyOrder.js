import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import styles from './MyOrder.module.css'; // Import the CSS module

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      console.log('Fetching orders for email:', userEmail); // Debug log

      if (!userEmail) {
        alert('Please log in to view your orders.');
        return;
      }

      const res = await fetch('http://localhost:5000/api/auth/myOrderData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const response = await res.json();
      console.log('API Response:', JSON.stringify(response, null, 2)); // Debug log with full details

      if (response.success) {
        setOrderData(response.orders); // Assuming the backend returns { success: true, orders: [...] }
      } else {
        console.error('Failed to fetch orders:', response.message);
        alert('Failed to fetch orders. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('An error occurred while fetching orders.');
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div className={styles.container}>
      {/* Navbar at the top */}
      <div className={styles.navbar}>
      <Navbar />
      </div>

      {/* Main content */}
      <div className={styles.cartContainer}>
        <h2 className={styles.cartHeader}>My Orders</h2>
        {orderData.length > 0 ? (
          orderData.map((order, index) => (
            <div key={index} className={styles.cartItem}>
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>
                  <strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}
                </div>
                <div className={styles.cartItems}>
                  {order.order_data.map((item, subIndex) => (
                    <div key={subIndex} className={styles.cartItem}>
                      <div className={styles.itemDetails}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemPrice}>
                          <strong>Price:</strong> ₹{item.price}
                        </div>
                        <div className={styles.itemQuantity}>
                          <strong>Quantity:</strong> {item.qty}
                        </div>
                        <div className={styles.itemSize}>
                          <strong>Size:</strong> {item.size}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.textCenter}>No orders found.</p>
        )}
      </div>
<div className={styles.footer}>
      {/* Footer at the bottom */}
      <Footer />
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState(null);

    const fetchMyOrder = async () => {
        try {
            let res = await fetch("http://localhost:5000/api/auth/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: localStorage.getItem('userEmail') })
            });

            let response = await res.json();
            setOrderData(response);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <Navbar />

            <div className="container">
                <div className="row">
                    {orderData && orderData.orderData ? (
                        orderData.orderData.order_data.slice(0).reverse().map((item, index) => (
                            <div key={index}>
                                {item.map((arrayData, subIndex) => (
                                    <div key={subIndex}>
                                        {arrayData.Order_date ? (
                                            <div className="m-auto mt-5">
                                                <strong>{arrayData.Order_date}</strong>
                                                <hr />
                                            </div>
                                        ) : (
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                                    <img
                                                        src={arrayData.img}
                                                        className="card-img-top"
                                                        alt={arrayData.name}
                                                        style={{ height: "120px", objectFit: "fill" }}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{arrayData.name}</h5>
                                                        <div className="container w-100 p-0" style={{ height: "38px" }}>
                                                            <span className="m-1">{arrayData.qty}</span>
                                                            <span className="m-1">{arrayData.size}</span>
                                                            <div className="d-inline ms-2 h-100 w-20 fs-5">
                                                                ₹{arrayData.price}/-
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

import React, { useState, useRef } from "react";
import { useDispatchCart } from "./CartContext";

export default function CardComponent(props) {
  const dispatch = useDispatchCart();
  const priceRef = useRef();
  const options = props.options;
  const priceOptions = Object.keys(options);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(priceOptions[0] || "");
  const foodItem = props.foodItem;

  const finalPrice = qty * parseInt(options[size] || 0);

  const handleAddToCart = async () => {
    const cartItem = {
      id: foodItem._id,
      name: foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
    };

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      const result = await response.json();
      if (response.ok) {
        dispatch({
          type: "ADD",
          id: foodItem._id,
          name: foodItem.name,
          price: finalPrice,
          qty: qty,
          size: size,
        });

        console.log("Added to cart:", result);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  return (
    <div
      className="card"
      style={{
        width: "16rem", // Fixed width for all cards
        height: "400px", // Fixed height for all cards
        backgroundColor: "rgb(33 37 41)",
        border: "2px solid white",
        marginBottom: "20px",
        transition: "transform 0.3s ease",
        transform: "scale(1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Distribute space evenly
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)"; // Zoom in effect
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"; // Zoom out effect
      }}
    >
      <img
        className="card-img-top"
        src={props.foodItem.img}
        alt="Card"
        style={{ height: "150px", objectFit: "cover", width: "100%" }} // Fixed image height
      />
      <div
        className="card-body"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1, // Allow this section to grow and take available space
          padding: "10px",
        }}
      >
        <h5 className="card-title" style={{ fontSize: "1.2rem", marginBottom: "10px", textAlign: "center" }}>
          {props.foodItem.name}
        </h5>
        <div className="container w-100" style={{ textAlign: "center" }}>
          <select
            className="m-2 h-100 bg-success rounded"
            onChange={(e) => setQty(parseInt(e.target.value))}
          >
            {Array.from(Array(6), (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select
            className="m-2 h-100 bg-success rounded"
            ref={priceRef}
            onChange={(e) => setSize(e.target.value)}
          >
            {priceOptions.map((data) => (
              <option key={data} value={data}>
                {data}
              </option>
            ))}
          </select>

          <div className="d-inline h-100 fs-5">₹{finalPrice}/-</div>
        </div>
      </div>
      <div style={{ padding: "10px", textAlign: "center" }}>
        <button
          className="btn btn-success"
          onClick={handleAddToCart}
          style={{ width: "100%" }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
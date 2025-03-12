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
        // ✅ Removed the navigate("/cart") call
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  return (
    <div>
      <div
        className="card"
        style={{ width: "12rem", maxHeight: "400px", backgroundColor: "rgb(33 37 41)" }}
      >
        <img
          className="card-img-top"
          src={props.foodItem.img}
          alt="Card"
          style={{ height: "120px", objectFit: "fill" }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>
          <div className="container w-100">
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
          <hr />
          <button
            className={"btn btn-success justify-center ms-2"}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
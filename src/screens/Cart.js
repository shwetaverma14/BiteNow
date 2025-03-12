import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart, useDispatchCart } from "../components/CartContext";

export default function Cart() {
  const data = useCart(); // data is an object with cartItems and dispatch
  const dispatch = useDispatchCart();

  // Use data.cartItems instead of data
  const cartItems = data.cartItems || [];

  if (cartItems.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
      </div>
    );
  }

  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem("userEmail");
    try {
      const response = await fetch("http://localhost:5000/api/auth/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: cartItems, // Use cartItems here
          email: userEmail,
          order_date: new Date().toDateString(),
        }),
      });

      if (response.status === 200) {
        dispatch({ type: "DROP" });
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  // Calculate total price using cartItems
  const totalPrice = cartItems.reduce((total, food) => total + food.price * food.qty, 0);

  return (
    <div style ={{backgroundColor:'#000', minHeight:"100vh"}}>
      <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
        <table className="table table-hover">
          <thead className="text-success fs-4">
            <h1 className="text-center">My Items</h1>
            <tr>
              <th scope="col" className="text-white">SNo.</th>
              <th scope="col" className="text-white">Name</th>
              <th scope="col" className="text-white">Quantity</th>
              <th scope="col" className="text-white">Option</th>
              <th scope="col" className="text-white">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((food, index) => (
              <tr key={index}>
                <th scope="row" style={{color:"#C0C0C0"}}>{index + 1}</th>
                <td style={{color:"#C0C0C0"}}>{food.name}</td>
                <td style={{color:"#C0C0C0"}}>{food.qty}</td>
                <td style={{color:"#C0C0C0"}}>{food.size}</td>
                <td style={{color:"#C0C0C0"}}>₹{food.price * food.qty}/-</td>
                <td>
                  <button
                    type="button"
                    className="btn p-0 text-white"
                    onClick={() => dispatch({ type: "REMOVE", index })}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className="fs-2">Total Price: ₹{totalPrice}/-</h1>
        </div>
        <div>
          <button className="btn bg-success mt-4" onClick={handleCheckOut}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
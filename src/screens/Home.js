import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const loadData = async () => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/foodData`, {  // Using the environment variable
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      response = await response.json();
      console.log("API Response:", response);

      if (response.foodItems && response.foodCategory) {
        console.log("Setting state: Food Items:", response.foodItems, "Food Categories:", response.foodCategory);
        setFoodItem(response.foodItems);
        setFoodCat(response.foodCategory);
      } else {
        console.error("Unexpected API response format:", response);
        setFoodItem([]);
        setFoodCat([]);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter food items based on search keyword
  const filterFoodItems = (items, search) => {
    if (!search) return items; // Return all items if search is empty

    const lowerCaseSearch = search.toLowerCase();

    // Filter based on specific keywords
    if (lowerCaseSearch === "pizza") {
      return items.filter((item) => item.CategoryName === "Pizza");
    } else if (lowerCaseSearch === "starter") {
      return items.filter((item) => item.CategoryName === "Starter");
    } else if (lowerCaseSearch === "rice" || lowerCaseSearch === "biryani") {
      return items.filter((item) => item.CategoryName === "Biryani/Rice");
    } else {
      // Default search: Filter by item name
      return items.filter((item) => item.name.toLowerCase().includes(lowerCaseSearch));
    }
  };

  return (
  <div>
    {/* Navbar */}
    <div><Navbar /></div>

    {/* Carousel with Search Bar */}
    <div>
      <div
        id="carouselExampleControls"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
        style={{ height: "80vh", width: "100%" }}
      >
        <div className="carousel-inner" id='carousel'>
          <div className="carousel-item active" style={{ height: "80vh" }}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "20" }}>
              <div className="input-group" style={{ width: "100%" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary" type="button" id="search-addon" style={{ backgroundColor: "rgb(25 135 84)", color: "white" }}>
                  Search <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
              style={{ 
                objectFit: "cover", 
                height: "80vh", 
                width: "100%", 
                filter: "brightness(30%)",
                animation: "zoomIn 5s ease-in-out infinite alternate"
              }}
              className="d-block w-100"
              alt="Burger"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Food Categories and Items - MODIFIED SECTION */}
    <div className='container'>
      {foodCat.length > 0
        ? foodCat.map((data) => {
            const filteredItems = filterFoodItems(
              foodItem.filter((item) => item.CategoryName === data.CategoryName),
              search
            );

            return (
              <div key={data._id} style={{ marginBottom: "40px" }}>
                <h2 style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  position: "relative",
                  paddingBottom: "10px"
                }}>
                  {data.CategoryName}
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "3px",
                    backgroundColor: "#28a745"
                  }}></span>
                </h2>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "25px",
                  justifyContent: "center"
                }}>
                  {filteredItems.length > 0
                    ? filteredItems.map((filterItems) => (
                        <div key={filterItems._id} style={{ display: "flex", justifyContent: "center" }}>
                          <Card
                            foodItem={filterItems}
                            options={filterItems.options?.[0] || {}}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                      ))
                    : <div style={{ textAlign: "center", gridColumn: "1/-1" }}>No Such Data Found</div>}
                </div>
              </div>
            );
          })
        : <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "200px"
          }}>
            <div className="spinner-border text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>}
    </div>

    {/* Footer */}
    <div><Footer /></div>

    <style>
      {`
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}
    </style>
  </div>
);
}
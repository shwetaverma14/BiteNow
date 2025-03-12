import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const loadData = async () => {
    let response = await fetch("http://localhost:5000/api/foodData", {
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
  
}
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <div><Navbar /></div>
      <div><div id="carouselExampleControls" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner" id='carousel'>
          <div className="carousel-item active" style={{ zIndex: "10" }}>
            <div className="d-flex justify-content-center" >
            <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="search-addon" value={search} onChange={(e)=>{setSearch(e.target.value)}} />
            <button className="btn btn-outline-secondary" type="button" id="search-addon">
                    <i className="fas fa-search"></i>
                </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
              style={{objectFit: "cover", filter: "brightness(30%)" }}
              className="d-block w-100 h-25 "
              alt="Burger"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e"
              style={{ width: "80%", height: "35%", objectFit: "cover", filter: "brightness(30%)" }}
              className="d-block w-100"
              alt="Pastry"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
              style={{ width: "80%", height: "35%", objectFit: "cover", filter: "brightness(30%)" }}
              className="d-block w-100"
              alt="Grilled Meat"
            />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button></div></div>
      <div className='container'>
        {
          foodCat.length>0
            ? foodCat.map((data) => {
              return (<div className='row mb-3' key={data._id}>
                <div className="fs-3 m-3">
                  {data.CategoryName}
                </div>
                <hr />
                {foodItem.length>0  ?
                  foodItem.filter((item) => (item.CategoryName === data.CategoryName)&&(item.name.toLowerCase().includes(search.toLocaleLowerCase()))) 
                    .map(filterItems => {
                      return (
                        <div key={filterItems._id} className="col-12 col-md-6 col-lg-3">
                          <Card foodItem = {filterItems}
                            options={filterItems.options?.[0] || {}}
                          
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                      )
                    }) : <div>No Such Data Found</div>}
              </div>
              )
            })
            : ""
        }
    

      </div>

      <div><Footer /></div>
    </div>
  );
}

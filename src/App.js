import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import MyOrder from './screens/MyOrder';
import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import Signup from './screens/Signup';
import { CartProvider } from './components/CartContext';
import Cart from './screens/Cart'

function App() {
  return (
    <CartProvider>
       <Router> 
      <div className="bg-dark text-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/createuser' element={<Signup/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/myorders' element={<MyOrder/>}/>
        </Routes>
      </div>
    </Router> 
    </CartProvider>
   
  );
}

export default App;

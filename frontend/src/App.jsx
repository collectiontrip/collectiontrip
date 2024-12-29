import React, { useState } from 'react';
import './App.css';
import ProductList from './component/ProductList';
import ProductDetails from './component/ProductDetails'; 
import Cart from './component/Cart'; 
import NavBar from './component/NavBar'; 
import SignUp from './component/auth/SignUp'; // Import SignUp component
import SignIn from './component/auth/SignIn'; // Import SignIn component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div>
        <NavBar /> {/* Navbar component */}
        
        <Routes>
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/carts/:cartId" element={<Cart />} />
          <Route path="/user/signup" element={<SignUp />} /> {/* Route for SignUp */}
          <Route path="/user/signin" element={<SignIn />} /> {/* Route for SignIn */}
        </Routes>

        <h1>Hello</h1>
      </div>
    </Router>
  );
}

export default App;

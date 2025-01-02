import React, { useState } from 'react';
import './App.css';
import ProductList from './component/ProductList';
import ProductDetails from './component/ProductDetails'; 
import Cart from './component/Cart'; 
import Orders from './component/Orders';
import NavBar from './component/NavBar'; 
import SignUp from './component/auth/SignUp'; 
import SignIn from './component/auth/SignIn'; 
import AddressForm from './component/Address';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  return (
    <Router>
      <div>
        {/* Pass isAuthenticated and setIsAuthenticated to NavBar */}
        <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        <Routes>
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/carts/:cartId" element={<Cart />} />
          <Route 
            path="/user/signup" 
            element={<SignUp />} 
          />
          {/* Pass setIsAuthenticated to SignIn to update authentication state */}
          <Route 
            path="/user/signin" 
            element={<SignIn setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/user/address" 
            element={<AddressForm onSubmitSuccess={() => console.log("Address submitted!")} />} 
          />
          <Route 
            path="/user/orders" 
            element={<Orders />} 
          />
        </Routes>
        
        

        
      </div>
    </Router>
  );
}

export default App;
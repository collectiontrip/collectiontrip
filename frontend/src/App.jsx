
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
import CollectionList from './component/CollectionList';
import ChatroomList from './component/ChatRoom';
import ChatRoomDetail from './component/ChatRoomDetails';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  return (
    <Router>
      <div>
        <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route
            path="/carts/:cartId"
            element={<Cart isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/user/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/user/address" element={<AddressForm onSubmitSuccess={() => console.log("Address submitted!")} />} />
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/chatroom" element={<ChatroomList />} />
          <Route path="/chatroom/:chatroom_id" element={<ChatRoomDetail />} /> {/* Added route for ChatRoomDetail */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
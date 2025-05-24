import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import MechanicDashboard from './pages/MechanicDashboard';
import ErrorCodeSearch from './pages/ErrorCodeSearch';
import MechanicBooking from './pages/MechanicBooking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PartsShop from './pages/PartsShop';
import Checkout from './pages/Checkout';
import Success from './components/Success';
import CarCommunity from './pages/CarCommunity';
import ContactPage from './pages/ContactPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetail from './pages/ArticleDetail';
import Subscribe from './components/Subscribe';
function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/mechanic" element={<MechanicDashboard/>} />
        <Route path="/code" element={<ErrorCodeSearch/>} />
        <Route path="/booking" element={<MechanicBooking/>} />
        <Route path="/spare-parts" element={<PartsShop/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/success" element={<Success />} />
        <Route path="/community" element={<CarCommunity />} />
        <Route path="/community/:id" element={<CarCommunity />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetail/>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/subscribe" element={<Subscribe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { supabase } from './services/client';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NotFound from './components/pages/NotFound';
import Verification from './components/pages/Verification';
import Home from './components/pages/home/Home';
import PersonalProfile from './components/pages/home/PersonalProfile';
import BusinesNotFound from './components/adminPanel/BusinesNotFound';
import ProductPage from './components/pages/particularPages/ProductPage';
import './App.css'

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        console.log('no hay sesión');
        navigate('/login');
      } else {
        console.log('hay sesión');
        // navigate('/');
      }
    })
    // navigate('/pruebas');

  }, []);

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/profile" element={<PersonalProfile />} />
        <Route path="/profile/business" element={<BusinesNotFound />} />
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

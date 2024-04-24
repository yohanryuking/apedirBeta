// Importando las dependencias necesarias
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../services/client'; // Cliente de Supabase
import { useNavigate } from 'react-router-dom'; // Hook de navegación
import { Button, Typography, Paper, BottomNavigation, BottomNavigationAction, Box, Grid } from '@mui/material'; // Componentes de Material UI
import HomeIcon from '@mui/icons-material/Home'; // Icono de casa
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icono de calendario
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Icono de carrito de compras
import Avatar from '@mui/material/Avatar'; // Componente de Avatar
import Campaign from '@mui/icons-material/Campaign'; // Icono de campaña
import HomeComp from './HomeComp'; // Componente de inicio
import Cart from './Cart'; // Componente de carrito de compras
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NovedadesPage from './NovedadesPage';
import EventosPage from './EventsPage';

// Componentes para mostrar
const Calendar = () => <Box>Calendar</Box>;
const Announcements = () => <Box>Announcements</Box>;

// Componente Home
const Home = () => {
  const navigate = useNavigate(); // Hook de navegación
  const [user, setUser] = useState(null) // Estado para el usuario
  const [value, setValue] = useState(0); // Estado para el valor de la navegación
  const [currentComponent, setCurrentComponent] = useState(<HomeComp />); // Estado para el componente actual
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Hook de efecto para verificar la autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession(); // Obtener la sesión


      if (!session) {
        console.log('no hay sesión'); // Si no hay sesión, imprimir un mensaje
        navigate('/login');

      } else {
        // console.log(session.data.session); // Si hay sesión, imprimir el email del usuario
      }

      const user = await supabase.auth.getUser(); // Obtener el usuario
      console.log(user.data.user.id); // Imprimir el email del usuario
      setUser(user.data.user.id)
    };

    checkAuth(); // Llamar a la función de verificación de autenticación
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Renderizar el componente
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '75px' }}>
      <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: value === 0 ? 'block' : 'none' }}><HomeComp /></div>
        <div style={{ display: value === 1 ? 'block' : 'none' }}><EventosPage /></div>
        <div style={{ display: value === 2 ? 'block' : 'none' }}><Cart /></div>
        <div style={{ display: value === 3 ? 'block' : 'none' }}><NovedadesPage /></div>
        {value === 4 && navigate('/profile')}
      </Box>
      <BottomNavigation value={value} onChange={handleChange} sx={{ width: '90%', position: 'fixed', bottom: 15, borderRadius: '30px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
        <BottomNavigationAction sx={{ minWidth: 'auto', padding: isMobile ? '6px 0' : '6px 12px' }} icon={<HomeIcon style={{ fontSize: isMobile ? '2em' : '2.5em', color: value === 0 ? 'purple' : 'black' }} />} />
        <BottomNavigationAction sx={{ minWidth: 'auto', padding: isMobile ? '6px 0' : '6px 12px' }} icon={<CalendarTodayIcon style={{ fontSize: isMobile ? '2em' : '2.5em', color: value === 1 ? 'purple' : 'black' }} />} />
        <BottomNavigationAction sx={{ minWidth: 'auto', padding: isMobile ? '6px 0' : '6px 12px' }} icon={<ShoppingCartIcon style={{ fontSize: isMobile ? '2em' : '2.5em', color: value === 2 ? 'purple' : 'black' }} />} />
        <BottomNavigationAction sx={{ minWidth: 'auto', padding: isMobile ? '6px 0' : '6px 12px' }} icon={<Campaign style={{ fontSize: isMobile ? '2em' : '2.5em', color: value === 3 ? 'purple' : 'black' }} />} />
        <BottomNavigationAction sx={{ minWidth: 'auto', padding: isMobile ? '6px 0' : '6px 12px' }} icon={<Avatar src={'https://duerpqsxmxeokygbzexa.supabase.co/storage/v1/object/public/images/' + user + '/avatar.jpg'} style={{ fontSize: isMobile ? '1em' : '1.5em', border: '2px solid purple' }} />} />
      </BottomNavigation>
    </Box>
  );
}

export default Home; // Exportar el componente
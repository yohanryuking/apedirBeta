import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/client';
import { Box, Grid, Container, Typography, Avatar, BottomNavigation, BottomNavigationAction, Button } from '@mui/material';
import { styled } from '@mui/system';
import EventAdmin from './eventos/EventAdmin';
import logo from '../../assets/images/logoWL.png'
import Categories from './catalogo/CatalogoComp';
import NovedadesTab from './novedades/NovedadesTab';
import BusinessDataAdmin from './negocio/BusinessDataAdmin';
import LoadingAnimation from '../utils/LoadingAnimation';
import BusinessDetails from './dashboard/BusinessDetails';
import { useNavigate } from 'react-router-dom';


const StyledBottomNavigation = styled(BottomNavigation)({
  backgroundColor: '#555',
  height: '35px',
});

const StyledBottomNavigationAction = styled(BottomNavigationAction)({
  color: '#fff',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  padding: '6px 12px',
  minWidth: '0', // Sobrescribir el min-width
  '&.Mui-selected': {
    color: '#555',
    backgroundColor: '#fff',
  },
});

const BusinessProfile = () => {
  const [value, setValue] = React.useState(0);
  const [business, setBusiness] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .eq('owner', (await supabase.auth.getUser()).data.user.email);
      if (error) {
        console.error('Error fetching business:', error.message);
      } else {
        setBusiness(data[0]);
      }
    };
    fetchBusiness();
  }, []);

  const handleChange = (event, newValue) => {
    if (!business) {
      setValue(null);
      return;
    }

    setValue(newValue);
  };

  return (
    <Box sx={{ marginTop: 0 }}>
      <Box width="100%" sx={{ flexGrow: 1 }}>
        <Box sx={{ p: 2, pb: 1, backgroundColor: '#555', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <img src={logo} style={{ width: '150px' }} onClick={() => navigate('/')} />
          <Box sx={{ flexGrow: 1 }} />
          <Avatar sx={{ bgcolor: 'secondary.main' }} src={business ? business.photo_perfil : ''}></Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">{business?.name}</Typography>
            <Typography variant="body2">Plan Premium</Typography>
          </Box>
        </Box>
        <StyledBottomNavigation value={value} onChange={handleChange} showLabels>
          <StyledBottomNavigationAction label="Dashboard" />
          <StyledBottomNavigationAction label="Negocio" />
          <StyledBottomNavigationAction label="Catálogo" />
          <StyledBottomNavigationAction label="Eventos" />
          <StyledBottomNavigationAction label="Novedades" />
        </StyledBottomNavigation>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px' }}>
          {business ? (
            <>
              <div style={{ display: value === 0 ? 'block' : 'none' }}><BusinessDetails business={business} /></div>
              <div style={{ display: value === 1 ? 'block' : 'none' }}><BusinessDataAdmin business={business} /></div>
              <div style={{ display: value === 2 ? 'block' : 'none' }}><Categories business={business} /></div>
              <div style={{ display: value === 3 ? 'block' : 'none' }}><EventAdmin business={business} /></div>
              <div style={{ display: value === 4 ? 'block' : 'none' }}><NovedadesTab business={business} /></div>
            </>
          ) : (
            <LoadingAnimation />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessProfile;
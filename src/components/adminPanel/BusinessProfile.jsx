import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/client';
import { Box, Grid, Container, Typography, Avatar, Menu, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/system';
import EventAdmin from './eventos/EventAdmin';
import logo from '../../assets/images/logoWL.png';
import Categories from './catalogo/CatalogoComp';
import NovedadesTab from './novedades/NovedadesTab';
import BusinessDataAdmin from './negocio/BusinessDataAdmin';
import LoadingAnimation from '../utils/LoadingAnimation';
import BusinessDetails from './dashboard/BusinessDetails';
import { useNavigate } from 'react-router-dom';

const BusinessProfile = () => {
  const [value, setValue] = useState(0);
  const [business, setBusiness] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index) => {
    setValue(index);
    setAnchorEl(null);
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
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{ color: '#fff', mt: 1 }}
            >
              Menú
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleMenuItemClick(0)}>Dashboard</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(1)}>Negocio</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(2)}>Catálogo</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(3)}>Eventos</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(4)}>Novedades</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(5)}>Estadísticas</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(6)}>Publicidad</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px' }}>
          {business ? (
            <>
              <div style={{ display: value === 0 ? 'block' : 'none' }}><BusinessDetails business={business} /></div>
              <div style={{ display: value === 1 ? 'block' : 'none' }}><BusinessDataAdmin business={business} /></div>
              <div style={{ display: value === 2 ? 'block' : 'none' }}><Categories business={business} /></div>
              <div style={{ display: value === 3 ? 'block' : 'none' }}><EventAdmin business={business} /></div>
              <div style={{ display: value === 4 ? 'block' : 'none' }}><NovedadesTab business={business} /></div>
              <div style={{ display: value === 5 ? 'block' : 'none' }}><Typography variant="h6">Estadísticas</Typography></div>
              <div style={{ display: value === 6 ? 'block' : 'none' }}><Typography variant="h6">Publicidad</Typography></div>
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
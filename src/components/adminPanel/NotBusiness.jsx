import React from 'react';
import { Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import logo from '../../../src/assets/images/img107.jpg';

const NotBusiness = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ position: 'relative', margin: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, backgroundColor: 'rgba(128, 128, 128, 0.5)' }}>
        <ArrowBackIcon />
      </IconButton>
      <img src={logo} alt="apedir" style={{ width: '50%', height: 'auto' }} />
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            No tienes ningún negocio registrado.
          </Typography>
          <Button variant="contained" color="primary" onClick={()=>{navigate('/profile/business/create')}}>
            Crear nuevo negocio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotBusiness;
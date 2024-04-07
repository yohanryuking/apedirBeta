import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';

const NotFound = () => {
  return (
    <div>
      {/* Add your animated image or GIF here */}
      <Typography variant="h4">Sitio no encontrado</Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Volver al inicio
      </Button>
    </div>
  );
};

export default NotFound;

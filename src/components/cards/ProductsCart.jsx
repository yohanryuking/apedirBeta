import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Grid, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductsCart = ({ item, removeFromCart, increaseQuantity, decreaseQuantity }) => {

    const handleRemove = (item) => {
        removeFromCart(item)
    }

    const handleIncrease = () => {
        increaseQuantity(item.productId);
    }

    const handleDecrease = () => {
        decreaseQuantity(item.productId);
    }

    return (
        <Card sx={{ display: 'flex', width: '400px', height: '100px', alignItems: 'center' }}>
            <CardMedia
                component="img"
                alt={item.product.name}
                height="100px"
                width="100px" // Cambia el ancho de la imagen aquí
                image={item.product.image_url}
                sx={{ objectFit: 'cover', padding: '5px', width: '30%', borderRadius: '20px' }} // Asegura que la imagen mantenga su aspecto al cambiar de tamaño
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ml: 2, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6">{item.product.name}</Typography>
                        <Typography variant="caption">{item.product.owner}</Typography>
                    </Box>
                    <IconButton color="error" aria-label="delete" onClick={() => handleRemove(item.productId)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">{item.product.precio}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="primary" aria-label="add" onClick={handleIncrease}>
                            <AddIcon />
                        </IconButton>
                        <Typography variant="body1">{item.quantity}</Typography>
                        <IconButton color="primary" aria-label="remove" onClick={handleDecrease}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default ProductsCart;
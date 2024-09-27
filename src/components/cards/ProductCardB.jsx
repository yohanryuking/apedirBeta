import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';

const ProductCardB = ({ product }) => {
    const navigate = useNavigate();

    const handleAddToCart = () => {};

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <Card sx={{ maxWidth: 345, margin: '10px', borderRadius:'15px' }}>
            <CardMedia
                component="img"
                height="140"
                image={product.image_url}
                alt={product.name}
            />
            <IconButton
                sx={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleAddToCart}
            >
                <AddShoppingCartIcon />
            </IconButton>
            <CardContent onClick={handleProductClick} sx={{ cursor: 'pointer' }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">{product.precio} CUP</Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCardB;
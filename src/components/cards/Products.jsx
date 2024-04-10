import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, IconButton, Box } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';



const ProductCard = ({ product, addToCart }) => {
    const { id, name, image_url, rating, precio, hasDelivery } = product;

    const handleAddToCart = () => {
        addToCart(id);
    };

    const navigate = useNavigate();

    return (
        <Card style={{ position: 'relative', borderRadius: '20px', width: '250px' }} >
            <CardMedia component="img" image={image_url} alt={name} height="150" onClick={() => { navigate('/product') }} />
            <IconButton onClick={handleAddToCart} style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(260, 260, 260, 0.5)', borderRadius: '10px', }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'black' }} />
            </IconButton>
            <CardContent onClick={() => { navigate('/product/'+product.id) }} style={{ padding: '16px' }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' flexDirection={'row'}>
                    <Typography variant="body1" component="h2">
                        {name}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <StarIcon style={{ color: 'violet' }} />
                        <Typography variant="body2">
                            {rating}
                        </Typography>
                    </Box>
                </Box>
                {/* <Typography variant="body2">
                    {precio} CUP
                </Typography> */}
                <Typography variant="body2" textAlign={'left'}>
                    <IconButton color={hasDelivery ? 'primary' : 'disabled'}>
                        <LocalShippingIcon />
                    </IconButton>
                    {hasDelivery ? 'Delivery available' : 'No delivery'}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
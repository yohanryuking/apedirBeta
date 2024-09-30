import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Badge } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/client';
import { useSnackbar } from 'notistack';

const ProductCardB = ({ product, userId }) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [quantity, setQuantity] = useState(0);
    const [cartItemId, setCartItemId] = useState(null);

    useEffect(() => {
        const fetchCartItem = async () => {
            try {
                const { data: existingCartItem, error: fetchError } = await supabase
                    .from('cart')
                    .select('*')
                    .eq('productId', product.id)
                    .eq('userId', userId)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') {
                    console.error('Error al verificar el carrito:', fetchError);
                } else if (existingCartItem) {
                    setQuantity(parseInt(existingCartItem.quantity));
                    setCartItemId(existingCartItem.id);
                }
            } catch (error) {
                console.error('Error al verificar el carrito:', error);
            }
        };

        fetchCartItem();
    }, [product.id, userId]);

    const handleAddToCart = async () => {
        try {
            if (quantity > 0) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                const newQuantity = quantity + 1;
                const { error: updateError } = await supabase
                    .from('cart')
                    .update({ quantity: newQuantity.toString() })
                    .eq('id', cartItemId);

                if (updateError) {
                    console.error('Error al actualizar la cantidad en el carrito:', updateError);
                    enqueueSnackbar('Error al actualizar la cantidad en el carrito', { variant: 'error' });
                } else {
                    setQuantity(newQuantity);
                    enqueueSnackbar(`Cantidad de ${product.name} incrementada en el carrito`, { variant: 'success' });
                }
            } else {
                // Si el producto no está en el carrito, agregarlo
                const { data, error: insertError } = await supabase
                    .from('cart')
                    .insert([{ productId: product.id, userId, quantity: '1' }])
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error al agregar al carrito:', insertError);
                    enqueueSnackbar('Error al agregar al carrito', { variant: 'error' });
                } else {
                    setQuantity(1);
                    setCartItemId(data.id);
                    enqueueSnackbar(`${product.name} agregado al carrito`, { variant: 'success' });
                }
            }
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            enqueueSnackbar('Error al agregar al carrito', { variant: 'error' });
        }
    };

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <Card sx={{ maxWidth: 345, margin: '10px', borderRadius: '15px', position: 'relative' }}>
            <CardMedia
                component="img"
                height="140"
                image={product.image_url}
                alt={product.name}
            />
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(211, 211, 211, 0.4)', // Gris claro con transparencia
                    '&:hover': {
                        backgroundColor: 'rgba(211, 211, 211, 1)', // Gris claro sin transparencia al pasar el ratón
                    },
                    color: 'black', // Color del icono
                    borderRadius: '15px'
                }}
                onClick={handleAddToCart}
            >
                <Badge badgeContent={quantity} color="primary">
                    <AddShoppingCartIcon />
                </Badge>
            </IconButton>
            <CardContent onClick={handleProductClick} sx={{ cursor: 'pointer' }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">{product.precio} CUP</Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCardB;
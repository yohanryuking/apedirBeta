import { Box, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { supabase } from '../../../services/client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import ProductsCart from '../../cards/ProductsCart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        //funcion para obtener el id del usuario
        const fetchUser = async () => {
            const user = await supabase.auth.getUser();
            setUserId(user.data.user.id);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (userId) {
            getCartItems();
        }
    }, [userId]);

    const getCartItems = async () => {
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*')
            .eq('userId', userId);

        if (cartError) {
            console.error('Error fetching cart items:', cartError);
        } else {
            const cartItemsWithProductDetails = await Promise.all(
                cartData.map(async (item) => {
                    const { data: productData, error: productError } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', item.productId);

                    if (productError) {
                        console.error('Error fetching product details:', productError);
                    } else {
                        return { ...item, product: productData[0] };
                    }
                })
            );

            setCartItems(cartItemsWithProductDetails);
        }
    };


    const removeFromCart = async (productId) => {
        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('userId', userId)
            .eq('productId', productId);

        if (error) {
            console.error('Error removing from cart:', error);
        } else {
            getCartItems();
        }
    };

    const increaseQuantity = async (productId) => {
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('quantity')
            .eq('productId', productId);

        if (cartData && cartData.length > 0) {
            const newQuantity = Number(cartData[0].quantity) + 1;
            await supabase
                .from('cart')
                .update({ quantity: newQuantity })
                .eq('productId', productId);
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: Number(item.quantity) + 1 }
                    : item
            )
        );
    }

    const decreaseQuantity = async (productId) => {
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('quantity')
            .eq('productId', productId);

        if (cartData && cartData.length > 0 && cartData[0].quantity > 1) {
            const newQuantity = cartData[0].quantity - 1;
            await supabase
                .from('cart')
                .update({ quantity: newQuantity })
                .eq('productId', productId);
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId && item.quantity > 0
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    }

    const calculateOrderInfo = () => {
        let totalItems = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalItems += Number(item.quantity);
            totalPrice += Number(item.quantity) * Number(item.product.precio);
        });

        return { totalItems, totalPrice };
    }

    const getUniqueOwners = () => {
        const owners = new Set();
        cartItems.forEach(item => {
            owners.add(item.product.owner);
        });
        return Array.from(owners);
    }

    const openWhatsApp = (owner) => {
        const message = encodeURIComponent("Hola, me gustaría hacer un pedido...");
        window.open(`https://wa.me/${owner.phoneNumber}?text=${message}`, '_blank');
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', textAlign: 'center' }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Carrito
                </Typography>
            </Box>
            {cartItems.length === 0 ? (
                <Alert severity="info">
                    <AlertTitle>Tu carrito está vacío</AlertTitle>
                    ¡Vamos a pedir! Explora nuestros productos y agrega tus favoritos a tu carrito.
                </Alert>
            ) : (
                <>
                    <List>
                        {cartItems.map((item) => (
                            <ListItem key={item.id}>
                                <ProductsCart
                                    key={item.productId}
                                    item={item}
                                    removeFromCart={removeFromCart}
                                    increaseQuantity={increaseQuantity}
                                    decreaseQuantity={decreaseQuantity}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Box>
                        <Typography variant="h6">
                            Información de la orden
                        </Typography>
                        <Typography variant="body1">
                            {`Total de productos: ${calculateOrderInfo().totalItems}`}
                        </Typography>
                        <Typography variant="body1">
                            {`Precio total: ${calculateOrderInfo().totalPrice} cup`}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">
                            Contactar a los dueños de los negocios
                        </Typography>
                        {getUniqueOwners().map((owner, index) => (
                            <Button key={index} variant="contained" color="primary" onClick={() => openWhatsApp(owner)}>
                                Contactar a {owner}
                            </Button>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Cart;
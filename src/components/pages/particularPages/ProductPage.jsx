import { Box, Typography, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TopBar from '../../utils/TopBar';
import { useSnackbar } from 'notistack';
import { AppContext } from '../../../AppContext';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(1);
    const [total, setTotal] = useState(0);
    const [cartItem, setCartItem] = useState(null);
    const { userId } = useContext(AppContext);


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [category, setCategory] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (productError) {
                console.error('Error fetching product:', productError);
                return;
            }

            setProduct(productData);
            setTotal(count * productData.precio);

            const { data: categoryData, error: categoryError } = await supabase
                .from('cayegoryProducts')
                .select('*')
                .eq('id', productData.category)
                .single();

            if (categoryError) {
                console.error('Error fetching category:', categoryError);
                return;
            }

            setCategory(categoryData);

            const { data: cartData, error: cartError } = await supabase
                .from('cart')
                .select('*')
                .eq('productId', id)
                .eq('userId', userId)
                .single();

            if (cartError && cartError.code !== 'PGRST116') {
                console.error('Error fetching cart item:', cartError);
                return;
            }

            if (cartData) {
                setCartItem(cartData);
                setCount(parseInt(cartData.quantity));
                setTotal(parseInt(cartData.quantity) * productData.precio);
            }

            setLoading(false); // Indica que la solicitud ha terminado
        };

        fetchData();
    }, [id, userId]);

    const incrementCount = async () => {
        const newCount = count + 1;
        setCount(newCount);
        setTotal(newCount * product.precio);

        if (cartItem) {
            try {
                const { error } = await supabase
                    .from('cart')
                    .update({ quantity: newCount.toString() })
                    .eq('id', cartItem.id)
                    .eq('userId', userId);

                if (error) {
                    console.error('Error updating cart item:', error);
                    enqueueSnackbar('Error al actualizar la cantidad en el carrito', { variant: 'error' });
                } else {
                    enqueueSnackbar(`Cantidad de ${product.name} incrementada en el carrito`, { variant: 'success' });
                }
            } catch (error) {
                console.error('Error updating cart item:', error);
                enqueueSnackbar('Error al actualizar la cantidad en el carrito', { variant: 'error' });
            }
        }
    };

    const decrementCount = async () => {
        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            setTotal(newCount * product.precio);

            if (cartItem) {
                try {
                    const { error } = await supabase
                        .from('cart')
                        .update({ quantity: newCount.toString() })
                        .eq('id', cartItem.id)
                        .eq('userId', userId);

                    if (error) {
                        console.error('Error updating cart item:', error);
                        enqueueSnackbar('Error al actualizar la cantidad en el carrito', { variant: 'error' });
                    } else {
                        enqueueSnackbar(`Cantidad de ${product.name} decrementada en el carrito`, { variant: 'success' });
                    }
                } catch (error) {
                    console.error('Error updating cart item:', error);
                    enqueueSnackbar('Error al actualizar la cantidad en el carrito', { variant: 'error' });
                }
            }
        }
    };

    const handleAddToCart = async () => {
        try {
            const { data, error } = await supabase
                .from('cart')
                .insert([{ productId: product.id, userId, quantity: count.toString() }])
                .single();

            if (error) {
                console.error('Error adding to cart:', error);
                enqueueSnackbar('Error al agregar al carrito', { variant: 'error' });
            } else {
                setCartItem(data);
                enqueueSnackbar(`${product.name} agregado al carrito`, { variant: 'success' });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            enqueueSnackbar('Error al agregar al carrito', { variant: 'error' });
        }
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <>
            <Box sx={{ margin: isMobile ? '5px' : '20px' }}>
                <TopBar title={product.name} showFavorite={true} productId={product.id} userId={userId} />
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                    <Box sx={{ flex: '1 1', }}>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: isMobile ? '250px' : '300px',
                                backgroundColor: 'grey',
                                borderRadius: '20px',
                                objectFit: 'cover', // Asegura que la imagen cubra el contenedor sin distorsionarse
                                objectPosition: 'center' // Centra la imagen dentro del contenedor
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">{category.nameProduct}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StarIcon />
                                <Typography variant="body1">{product.calification}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ flex: '1 1', padding: isMobile ? '20px 10px' : '0 20px' }}>
                        <Typography variant="h3">{product.name}</Typography>
                        <Typography variant="body1" height={'100px'}>{product.description}</Typography>
                    </Box>
                    {cartItem ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 auto', gap: '30px' }}>
                            <IconButton onClick={decrementCount} sx={{ backgroundColor: '#e5e5e5', borderRadius: '10px' }}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography variant='h5'>{count}</Typography>
                            <IconButton onClick={incrementCount} sx={{ backgroundColor: '#e5e5e5', borderRadius: '10px' }}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 auto', gap: '30px' }}>
                            <IconButton onClick={decrementCount} sx={{ backgroundColor: '#e5e5e5', borderRadius: '10px' }}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography variant='h5'>{count}</Typography>
                            <IconButton onClick={incrementCount} sx={{ backgroundColor: '#e5e5e5', borderRadius: '10px' }}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#e5e5e5',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">{total} cup</Typography>
                </Box>
                {!cartItem && (
                    <IconButton onClick={handleAddToCart} sx={{ backgroundColor: 'purple', color: 'white', borderRadius: '10px' }}>
                        <ShoppingCartIcon />
                        <Typography>Añadir al carrito</Typography>
                    </IconButton>
                )}
            </Box>
        </>
    );
};

export default ProductPage;
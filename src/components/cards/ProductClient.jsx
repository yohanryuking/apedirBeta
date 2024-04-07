import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Button } from '@mui/material';
import { ArrowBack, Share } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import { useParams } from 'react-router-dom';
import { supabase } from '../../services/client';
import LoadingAnimation from '../utils/LoadingAnimation';

const ProductClient = ({ addToCart }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        addToCart(productId);
    };

    if (!product) {
        return <Box><LoadingAnimation></LoadingAnimation></Box>;
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <IconButton>
                    <ArrowBack />
                </IconButton>
                <IconButton>
                    <Share />
                </IconButton>
            </Box>
            <Card>
                <CardMedia image={product.image} /> {/* Muestra la imagen del producto */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{product.category}</Typography> {/* Muestra la categoría del producto */}
                    <Box display="flex" alignItems="center">
                        <Typography variant="body2">{product.rating}</Typography> {/* Muestra la puntuación del producto */}
                        <StarIcon />
                    </Box>
                </Box>
                <Typography variant="h6">{product.name}</Typography> {/* Muestra el nombre del producto */}
                <Typography variant="body1">{product.description}</Typography> {/* Muestra la descripción del producto */}
                <Box display="flex" alignItems="center">
                    <Button variant="outlined">-</Button>
                    <Typography variant="body2">{product.quantity}</Typography> {/* Muestra la cantidad del producto */}
                    <Button variant="outlined">+</Button>
                </Box>
            </Card>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{product.price}</Typography> {/* Muestra el precio del producto */}
                <Button variant="contained" onClick={handleAddToCart}>
                    Agregar al carrito
                </Button>
            </Box>
        </Box>
    );
};

export default ProductClient;
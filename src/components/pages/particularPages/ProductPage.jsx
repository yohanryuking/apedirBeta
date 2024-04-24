import { Box, Typography, Grid, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';




const ProductPage = () => {

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(1);
    const [total, setTotal] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [category, setCategory] = useState(null);
    const navigate = useNavigate();

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
            setTotal(count * productData.precio)
            // console.log(count * productData.precio)

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
            setLoading(false); // Indica que la solicitud ha terminado


        };

        fetchData();
    }, [id]);

    const incrementCount = () => {
        setCount(count + 1);
        setTotal(total + product.precio)
    };

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
            setTotal(total - product.precio)
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <>
            <Box sx={{ margin: isMobile ? '5px' : '20px' }}>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex' }}>
                        <IconButton sx={{ borderRadius: '50%', background: 'white' }}><ArrowBackIcon onClick={handleBackClick} /></IconButton>
                    </Box>
                    <Box sx={{ position: 'absolute', top: 20, right: 10, display: 'flex', gap: '5px' }}>
                        <IconButton sx={{ borderRadius: '50%', background: 'white' }}><FavoriteIcon /></IconButton>
                        <IconButton sx={{ borderRadius: '50%', background: 'white' }}><ShareIcon /></IconButton>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                    <Box sx={{ flex: '1 1', }}>
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: isMobile ? '250px' : '300px', backgroundColor: 'grey', borderRadius: '20px' }} />
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
                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 auto', gap: '30px' }}>
                        <IconButton onClick={decrementCount} sx={{ backgroundColor: '#e5e5e5', borderRadius: '10px' }}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography variant='h5'>{count}</Typography>
                        <IconButton onClick={incrementCount} sx={{ backgroundColor: '#e5e5e5', borderRadius: '10px' }}>
                            <AddIcon />
                        </IconButton>
                    </Box>
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
                <IconButton sx={{ backgroundColor: 'purple', color: 'white', borderRadius: '10px' }}>
                    <ShoppingCartIcon />
                    <Typography>Anadir al carrito</Typography>
                </IconButton>
            </Box>
        </>
    );
};

export default ProductPage;
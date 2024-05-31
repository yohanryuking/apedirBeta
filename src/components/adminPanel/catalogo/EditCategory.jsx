import { useEffect, useState, useContext } from 'react';
import { Grid, Typography, IconButton, Button, Modal } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import EditProducts from './EditProduct';
import CreateProduct from './CreateProducts';
import { Box, styled } from '@mui/system';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { TroubleshootRounded } from '@mui/icons-material';

import Slider from "react-slick";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppContext } from '../../../AppContext';


const Root = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    maxWidth: '100vw', // Limitar el ancho máximo al 100% del ancho de la ventana del navegador
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)', // Sombra definida directamente
    display: 'flex',
    flexDirection: 'column',
}));

const CategoryRow = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
}));

const CategoryName = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const AddButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'black',
    color: 'white',
    marginBottom: theme.spacing(1),
    width: 'fit-content',
}));

const EditCategory = ({ category, onDelete, business }) => {
    const [productsint, setProductsint] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false); // Nuevo estado para rastrear la carga
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentProduct, setCurrentProduct] = useState(null);

    const { products, setProducts } = useContext(AppContext);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddProduct = async (product) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .insert([{
                'name': product.name,
                'owner': business.name,
                'category': category.id,
                'provincia': business.provincia,
                'precio': product.price
            }]);

        if (error) {
            console.log('Error inserting product:', error);
            setLoading(false);
        } else {
            // console.log(product.image)
            setProducts([...products, data]);
            // handleCloseModal();
            // Si la creación del producto fue exitosa, sube la imagen al bucket
            if (product.image) {
                const filePath = `${business.name}/products/${product.name}.jpg`;

                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('feedImages')
                    .upload(filePath, product.image, { upsert: true });

                if (uploadError) {
                    console.error('Error uploading image:', uploadError.message);
                    toast.error('Error uploading image: ' + uploadError.message);
                    setLoading(false);
                } else {
                    console.log('Image uploaded successfully:', uploadData);
                    // toast.success('Image uploaded successfully');

                    // Obtén la URL de la imagen
                    const { data: urlData, error: urlError } = await supabase
                        .storage
                        .from('feedImages')
                        .getPublicUrl(filePath);

                    if (urlError) {
                        console.error('Error getting image URL:', urlError.message);
                        // toast.error('Error getting image URL: ' + urlError.message);
                        setLoading(false);
                    } else {
                        console.log(urlData)
                        // Actualiza el evento con la URL de la imagen

                        const { data, error: updateError } = await supabase
                            .from('products')
                            .update({ 'image_url': urlData.publicUrl })
                            .eq('name', product.name)
                            .select()
                        if (updateError) {
                            console.error('Error updating event:', updateError.message);
                            // toast.error('Error updating event: ' + updateError.message);
                            setLoading(false);
                        } else {
                            console.log('Event updated successfully with image URL');
                            // toast.success('Event updated successfully with image URL');
                            setLoading(false);
                        }
                    }
                }
            }
        }
    };

    const getSliderSettings = (slidesToShow, slidesToShow6, slidesToShow48) => ({
        dots: TroubleshootRounded,
        infinite: products.length > 1, // Desactivar el comportamiento infinito si solo hay un producto
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        centerMode: false,
        arrows: false, // Desactivar las flechas
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: slidesToShow6,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: slidesToShow48,
                    slidesToScroll: 1
                }
            }
        ]
    });

    useEffect(() => {

       setProductsint(products.filter(product => product.category === category.id))
    }, [category.id, products]); // Dependencia de useEffect

    return (
        <Root>
            {loading ? (<Box><p>Creando Producto Nuevo, Espere ..</p><LoadingAnimation /></Box>) : (
                <>
                    <CategoryRow>
                        <Box display={'flex'}>
                            <CategoryName variant="h6">
                                {category.nameProduct}
                            </CategoryName>
                            <IconButton>
                                <Edit />
                            </IconButton>
                        </Box>
                        <IconButton onClick={() => onDelete(category.id)}>
                            <Delete color="error" />
                        </IconButton>
                    </CategoryRow>
                    <AddButton variant="contained" onClick={handleOpenModal}>
                        Agregar productos
                    </AddButton>
                    <Box sx={{ }}>
                        <Slider {...getSliderSettings(2, 2, 1)}>
                            {productsint.map((product) => (
                                product && (
                                    <Box p={1} key={product.id}>
                                        <EditProducts product={product} openModal={handleOpenModal} setCurrentProduct={setCurrentProduct}/>
                                    </Box>
                                )
                            ))}
                        </Slider>
                    </Box>
                    <Modal open={openModal} onClose={handleCloseModal}>
                        <div> <CreateProduct closeModal={handleCloseModal} createProduct={handleAddProduct} product={currentProduct}/>{}</div>
                        {/* {console.log(product)} */}
                        
                    </Modal>
                </>
            )}
        </Root>
    );
};

export default EditCategory;
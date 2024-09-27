import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../AppContext';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { Card, CardContent, CardMedia, Typography, Box, Button, TextField, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
// bulto de iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info'; // Cambiado aquí
import CircleIcon from '@mui/icons-material/Circle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Slider from 'react-slick';
import ProductCard from '../../cards/ProductCardB';

import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { useSnackbar } from 'notistack';

const PerfilNegocio = () => {
    const { name: nombre } = useParams();
    const [categoriaB, setCategoriaB] = useState(null);
    const [secciones, setSecciones] = useState(null);
    const [productos, setProductos] = useState(null);

    const { businesses, categoryBusiness, cayegoryProducts, products } = useContext(AppContext);
    const [businessData, setBusinessData] = useState();
    const [anchorEl, setAnchorEl] = useState(null);

    // estados del negocio
    const [isOpen, setIsOpen] = useState(false); // Definir isOpen aquí
    const [isSubscribed, setIsSubscribed] = useState(false); // Estado para suscripción
    const [hasDelivery, setHasDelivery] = useState(false); // Estado para servicio de entrega


    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const shareButtonRef = useRef(); // Añade esta línea

    useEffect(() => {
        if (!businesses) {
            return;
        }

        const business = businesses.find(business => String(business.name) === String(nombre));
        if (business) {
            const categoria = categoryBusiness.find(cat => cat.id === business.category);
            setCategoriaB(categoria);
            setBusinessData(business);
        }
    }, [nombre, businesses, categoryBusiness]);

    useEffect(() => {
        if (businessData) {
            const seccion = cayegoryProducts.filter(cat => cat.owner === businessData.name);
            setSecciones(seccion);

            const produ = products.filter(pro => pro.owner === businessData.name);
            setProductos(produ);
        }
    }, [businessData, cayegoryProducts, products]);

    useEffect(() => {
        const currentHour = new Date().getHours();
        const openHour = 9;
        const closeHour = 21;
        setIsOpen(currentHour >= openHour && currentHour < closeHour);
    }, []);


    // funciones para compartir
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleShareClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Compartir Negocio',
                text: 'Mira la pagina de ' + businessData.name + ' en APEDIR!',
                url: window.location.href,
            })
                .then(() => console.log('Contenido compartido!'))
                .catch((error) => console.log('Hubo un error al compartir', error));
        } else {
            console.log('La API Web Share no está disponible en tu navegador');
            handleShareClick({ currentTarget: shareButtonRef.current }); // Añade esta línea
        }
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                enqueueSnackbar('Enlace copiado al portapapeles', { variant: 'success' });
                handleClose();
            })
            .catch((error) => console.error('Error al copiar el enlace', error));
    };

    const handleInfoClick = () => {
        // Implementar la función aquí
    };

    const handleSubscribeClick = () => {
        setIsSubscribed(!isSubscribed);
    };

    const sliderSettings = {
        // dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    // infinite: true,
                    // dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    // infinite: true,
                    // dots: true,
                    // centerMode: true,
                    centerPadding: '20px'
                }
            }
        ]
    };

    if (!businessData) {
        return <LoadingAnimation />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100vw', sm: '500px' }, minHeight: '100%', borderTopRightRadius: '15px', overflow: 'auto' }}>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex' }}>
                        <IconButton sx={{ borderRadius: '50%', background: 'white' }}><ArrowBackIcon onClick={handleBackClick} /></IconButton>
                    </Box>
                    <Box sx={{ position: 'absolute', top: 20, right: 10, display: 'flex', gap: '5px' }}>
                        <IconButton sx={{ borderRadius: '50%', background: 'white' }}><FavoriteIcon /></IconButton>
                        <IconButton ref={shareButtonRef} sx={{ borderRadius: '50%', background: 'white' }} onClick={handleShare}><ShareIcon /></IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <FacebookShareButton url={window.location.href} quote={'Mira la pagina de ' + businessData.name + ' en APEDIR!'} >
                                    Compartir en Facebook
                                </FacebookShareButton>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <TwitterShareButton url={window.location.href} title={'Mira la pagina de ' + businessData.name + ' en APEDIR!'} >
                                    Compartir en X
                                </TwitterShareButton>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <WhatsappShareButton url={window.location.href} title={'Mira la pagina de ' + businessData.name + ' en APEDIR!'} >
                                    Compartir en WhatsApp
                                </WhatsappShareButton>
                            </MenuItem>
                            <MenuItem onClick={handleCopyLink}>
                                Copiar enlace
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
                <CardMedia component="img" sx={{ flex: '0 1 auto', transition: 'height 0.2s ease', minHeight: '30%', borderRadius: '15px', boxShadow: '1px 1px 3px black' }} image={businessData.photo_portada} alt="Imagen del evento" />
                <Avatar src={businessData.photo_perfil} sx={{ width: 65, height: 65, transform: 'translateY(-50%)', margin: '0 auto', border: 'solid 3px white' }} />

                <Box sx={{ padding: '20px' }}>
                    {/* box con nombre e info del negocio */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            <Typography variant="body1" style={{ color: 'gray', display: 'flex', alignItems: 'center' }}>
                                {isOpen ? 'Abierto' : 'Cerrado'}
                                <CircleIcon sx={{ color: isOpen ? 'green' : 'red', marginLeft: '5px', width: '10px' }} />
                            </Typography>
                            <IconButton onClick={handleInfoClick} style={{ color: 'black' }}>
                                <InfoIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h3">{businessData.name}</Typography>
                        <Typography variant="h6" style={{ color: 'gray' }}>{categoriaB?.nameCategory}</Typography>
                    </Box>

                    {/* box con opcion de suscribirse y si tiene deliveri o no  */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubscribeClick}
                            endIcon={isSubscribed ? <CheckIcon /> : <NotificationsIcon />}
                            sx={{ backgroundColor: 'purple', borderRadius: '13px' }}
                        >
                            {isSubscribed ? 'Suscrito' : 'Suscríbete'}
                        </Button>
                        {hasDelivery && <LocalShippingIcon sx={{ color: 'black' }} />}
                    </Box>

                    {/* box con catalogo de productos y servicos del negocio */}
                    <Box sx={{ marginTop: '20px' }}>
                        {secciones?.map((seccion) => (
                            <div key={seccion.id}>
                                <Typography variant="h6">{seccion.nameProduct}</Typography>
                                <Slider {...sliderSettings}>
                                    {productos?.filter(producto => producto?.category === seccion.id).map((producto) => (
                                        <ProductCard key={producto?.id} product={producto} />
                                    ))}
                                </Slider>
                            </div>
                        ))}
                    </Box>
                </Box>
            </Card>
        </Box>

    );
};

export default PerfilNegocio;
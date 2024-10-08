import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../AppContext';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { Card, CardMedia, Typography, Box, Button, IconButton, Avatar, Modal, Paper, useMediaQuery } from '@mui/material';
// bulto de iconos
import InfoIcon from '@mui/icons-material/Info'; // Cambiado aquí
import CircleIcon from '@mui/icons-material/Circle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import Slider from 'react-slick';
import ProductCardB from '../../cards/ProductCardB';
import { supabase } from '../../../services/client';
import TopBar from '../../utils/TopBar';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


const PerfilNegocio = () => {
    const { name: nombre } = useParams();
    const [categoriaB, setCategoriaB] = useState(null);
    const [secciones, setSecciones] = useState(null);
    const [productos, setProductos] = useState(null);

    const { businesses, categoryBusiness, categoryProducts, suscripciones, products, userId } = useContext(AppContext);
    const [businessData, setBusinessData] = useState();
    // estados del negocio
    const [isOpen, setIsOpen] = useState(false); // Definir isOpen aquí
    const [isSubscribed, setIsSubscribed] = useState(false); // Estado para suscripción
    const [hasDelivery, setHasDelivery] = useState(false); // Estado para servicio de entrega
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showScheduleBox, setShowScheduleBox] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const { enqueueSnackbar } = useSnackbar();



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
            const seccion = categoryProducts.filter(cat => cat.owner === businessData.name);
            setSecciones(seccion);

            const produ = products.filter(pro => pro.owner === businessData.name);
            setProductos(produ);

            // Verificar si el usuario ya está suscrito
            const suscripcion = suscripciones.find(sub => sub.user_id === userId && sub.business_id === businessData.id);
            if (suscripcion) {
                setIsSubscribed(true);
            }

            // Verificar si el negocio está abierto
            setIsOpen(checkIfOpen(businessData.schedules));
        }
    }, [businessData, categoryProducts, products, suscripciones, userId]);

    const checkIfOpen = (schedule) => {
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const currentDay = daysOfWeek[new Date().getDay()];
        const currentTime = dayjs();

        if (schedule[currentDay]) {
            const openingTime = dayjs(schedule[currentDay].opening, 'HH:mm');
            const closingTime = dayjs(schedule[currentDay].closing, 'HH:mm');

            return currentTime.isAfter(openingTime) && currentTime.isBefore(closingTime);
        }

        return false;
    };

    const handleInfoClick = () => {
        setShowInfoModal(true);
    };

    const handleSubscribeClick = async () => {
        if (isSubscribed) {
            // Lógica para desuscribirse
            try {
                const { data, error } = await supabase
                    .from('suscripciones')
                    .delete()
                    .eq('user_id', userId)
                    .eq('business_id', businessData.id);
                if (error) {
                    console.error('Error al desuscribirse:', error);
                    enqueueSnackbar('Error al desuscribirse', { variant: 'error' });
                } else {
                    setIsSubscribed(false);
                    enqueueSnackbar('Desuscripción exitosa', { variant: 'success' });
                }
            } catch (error) {
                console.error('Error al desuscribirse:', error);
                enqueueSnackbar('Error al desuscribirse', { variant: 'error' });
            }
        } else {
            // Lógica para suscribirse
            try {
                const { data, error } = await supabase
                    .from('suscripciones')
                    .insert([{ user_id: userId, business_id: businessData.id }]);
                if (error) {
                    console.error('Error al suscribirse:', error);
                    enqueueSnackbar('Error al suscribirse', { variant: 'error' });
                } else {
                    setIsSubscribed(true);
                    enqueueSnackbar('Suscripción exitosa', { variant: 'success' });
                }
            } catch (error) {
                console.error('Error al suscribirse:', error);
                enqueueSnackbar('Error al suscribirse', { variant: 'error' });
            }
        }
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
                <TopBar title={businessData.name} showFavorite={false} />
                <CardMedia component="img" sx={{ flex: '0 1 auto', transition: 'height 0.2s ease', minHeight: '30%', borderRadius: '15px', boxShadow: '1px 1px 3px black' }} image={businessData.photo_portada} alt="Imagen del evento" />
                <Avatar src={businessData.photo_perfil} sx={{ width: 65, height: 65, transform: 'translateY(-50%)', margin: '0 auto', border: 'solid 3px white' }} />

                <Box sx={{ padding: '20px' }}>
                    {/* box con nombre e info del negocio */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            <Typography
                                variant="body1"
                                style={{ color: 'gray', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={() => !isMobile && setShowScheduleBox(true)}
                                onMouseLeave={() => !isMobile && setShowScheduleBox(false)}
                                onClick={() => isMobile && setShowScheduleBox(!showScheduleBox)}
                            >
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
                        {secciones?.map((seccion) => {
                            const productosFiltrados = productos?.filter(producto => producto?.category === seccion.id);
                            if (productosFiltrados.length === 0) {
                                return null;
                            }
                            return (
                                <div key={seccion.id}>
                                    <Typography variant="h6">{seccion.nameProduct}</Typography>
                                    <Slider {...sliderSettings}>
                                        {productosFiltrados.map((producto) => (
                                            <ProductCardB key={producto?.id} product={producto} userId={userId} />
                                        ))}
                                    </Slider>
                                </div>
                            );
                        })}
                    </Box>
                </Box>
            </Card>

            <Modal
                open={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {businessData.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {businessData.description}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Dirección: {businessData.address}
                    </Typography>
                </Box>
            </Modal>

            {showScheduleBox && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px',
                        zIndex: 10,
                        backgroundColor: 'white',
                        boxShadow: 3,
                    }}
                    onClick={() => isMobile && setShowScheduleBox(false)}
                >
                    <Typography variant="h6">Horarios</Typography>
                    {Object.entries(businessData.schedules).map(([day, schedule]) => (
                        <Typography key={day} variant="body2">
                            {day}: {schedule.opening} - {schedule.closing}
                        </Typography>
                    ))}
                </Paper>
            )}
        </Box>

    );
};

export default PerfilNegocio;
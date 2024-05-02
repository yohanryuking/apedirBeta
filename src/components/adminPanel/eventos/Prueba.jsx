import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Button, TextField, IconButton, Avatar } from '@mui/material';
import { AppContext } from '../../../AppContext';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';




const EventClient = () => {
    const [ticketCount, setTicketCount] = useState(0);
    const [textField1, setTextField1] = useState('');
    const [textField2, setTextField2] = useState('');
    const [textField3, setTextField3] = useState('');
    const [textField4, setTextField4] = useState('');
    const [textField5, setTextField5] = useState('');

    const [postContent, setPostContent] = useState('');

    const handlePostContentChange = (event) => {
        setPostContent(event.target.value);
    };

    const [eventData, setEventData] = useState(null);
    const { id: eventId } = useParams();
    const { userId, events, businesses } = useContext(AppContext);
    const navigate = useNavigate();

    const [perfilUrl, setPefilUrl] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [view, setView] = useState('initial'); // Añade esta línea

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                enqueueSnackbar('Enlace copiado al portapapeles', { variant: 'success' });
                handleClose();
            })
            .catch((error) => console.error('Error al copiar el enlace', error));
    };


    useEffect(() => {
        if (!events) {
            return <LoadingAnimation />;
        }

        const event = events.find(event => String(event.id) === String(eventId));

        setEventData(event);
    }, [eventId, events]);

    useEffect(() => {
        const getBusinessProfilePhoto = () => {
            if (!eventData) {
                return;
            }

            const business = businesses.find(b => b.name === eventData.owner);
            const photo = business ? business.photo_perfil : null;
            setPefilUrl(photo);
        };

        getBusinessProfilePhoto();
    }, [eventData]);


    const handleIncrement = () => {
        setTicketCount(prevCount => {
            if (prevCount >= 5) {
                enqueueSnackbar('El máximo de reservaciones que se pueden realizar por usuario es de 5', { variant: 'warning' });
                return prevCount;
            }
            return prevCount + 1;
        });
    };

    const handleDecrement = () => {
        if (ticketCount > 0) {
            setTicketCount(prevCount => prevCount - 1);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    // const handleTF1change = (event) => {
    //     setTextField1(event.target.value);
    // };

    const handleReservation = async () => {
        try {
            const ticketValues = [textField1, textField2, textField3, textField4, textField5].slice(0, ticketCount);
            console.log(ticketValues); // Aquí puedes hacer lo que necesites con los valores de los campos de texto
            // Crear la nueva reserva
            const { data: reservation, error } = await supabase
                .from('reservations')
                .insert([
                    {
                        user_id: userId,
                        event_id: eventId,
                        tickets: tickets // tickets es un array de objetos { ci: 'CI de la persona' }
                    }
                ]);

            if (error) throw error;

            // Crear la nueva venta
            // const { data: sale, error: saleError } = await supabase
            //     .from('sales')
            //     .insert([
            //         { event_id: eventId, reservation_id: reservation.id }
            //     ]);

            // if (saleError) throw saleError;
            enqueueSnackbar('Reserva realizada con éxito', { variant: 'success' }); // Añade esta línea

        } catch (error) {
            console.error('Error en la reserva: ', error);
            enqueueSnackbar('Error en la reserva', { variant: 'error' }); // Añade esta línea
        }
    };

    const handleShareClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getEventDateInWords = (eventDate) => {
        const date = parseISO(eventDate);
        const now = new Date();
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Compartir Evento',
                text: 'Mira este evento increíble!',
                url: window.location.href,
            })
                .then(() => console.log('Contenido compartido!'))
                .catch((error) => console.log('Hubo un error al compartir', error));
        } else {
            console.log('La API Web Share no está disponible en tu navegador');
            handleShareClick({ currentTarget: shareButtonRef.current }); // Añade esta línea
        }
    };

    const shareButtonRef = useRef(); // Añade esta línea

    if (!eventData) {
        return <LoadingAnimation />;
    }

    const CardContentInitial = () => (
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h3">{eventData.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <LocationOnIcon />
                <Typography>{eventData.place}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <EventIcon />
                <Typography>{new Date(eventData.fecha).toLocaleDateString()}</Typography>
                {/* {getEventDateInWords(eventData.fecha)} - {eventData.hora} */}
            </Box>
            <Button
                variant="contained"
                sx={{
                    mt: 3,
                    bgcolor: 'purple',
                    color: 'white',
                    alignSelf: 'center'
                }}
                onClick={() => setView('secondary')}
            >
                Reservar
            </Button>
        </CardContent>
    );

    const CardContentSecondary = () => (
        <CardContent sx={{ flexGrow: 1, bgcolor: 'transparent', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', p: 0 }}>
            <Box sx={{ flexGrow: 1, p: 2, bgcolor: 'white', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', transform: 'translateY(-15px)' }}>
                <Typography sx={{ textAlign: 'center' }} color="text.secondary" variant="h5" component="div">Detalles</Typography>
                <Typography sx={{ textAlign: 'center' }} variant="h4" >Entradas disponibles{eventData.availableTickets}</Typography>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Typography variant="body4" fontWeight='bold'>Entradas</Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" gap='10px'>
                        <IconButton
                            onClick={handleDecrement}
                            sx={{
                                padding: .3,
                                borderRadius: '50%',
                                // fontWeight: 'bold',
                                // backgroundColor: 'grey',
                                boxShadow: '1px 1px 3px black'
                            }}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <Typography variant="h6">{ticketCount}</Typography>
                        <IconButton
                            onClick={handleIncrement}
                            sx={{
                                padding: .3,
                                borderRadius: '50%',
                                // fontWeight: 'bold',
                                // backgroundColor: 'grey',
                                boxShadow: '1px 1px 3px black'
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>Total</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}> <Typography variant="h6" >{eventData.price * ticketCount} </Typography>
                    <Typography variant="body5" sx={{ color: "text.secondary" }}>CUP</Typography></Box>
                {/* {ticketCount > 0 && <TextField value={textField1} onChange={handleTF1change} label={`Número de carnet 1`} variant="outlined" fullWidth />}
                {ticketCount > 1 && <TextField value={textField2} onChange={(e) => { setTextField2(e.target.value) }} label={`Número de carnet 2`} />}
                {ticketCount > 2 && <TextField value={textField3} onChange={e => setTextField3(e.target.value)} label={`Número de carnet 3`} />}
                {ticketCount > 3 && <TextField value={textField4} onChange={e => setTextField4(e.target.value)} label={`Número de carnet 4`} />}
                {ticketCount > 4 && <TextField value={textField5} onChange={e => setTextField5(e.target.value)} label={`Número de carnet 5`} />}
               */}
                <TextField
                    value={textField1}
                    // onChange={handleTF1change()}
                    placeholder={`Número de carnet 1`}
                    variant="outlined"
                    fullWidth
                />

                <TextField
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                    placeholder="Que necesitas comunicar a tus clientes?"
                    value={postContent}
                    onChange={handlePostContentChange}
                />
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        bgcolor: 'purple',
                        color: 'white',
                        alignSelf: 'center'
                    }}
                    onClick={handleReservation}
                >
                    Reservar
                </Button>
            </Box>
        </CardContent>
    );

    const CardContentTertiary = () => (
        <CardContent sx={{ flexGrow: 1 }}>
            {/* Contenido para la vista terciaria */}
        </CardContent>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100vw', sm: '500px' }, height: '100%', borderTopRightRadius: '15px' }}>
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
                                <FacebookShareButton url={window.location.href} quote={'Mira este evento increíble!'} >
                                    Compartir en Facebook
                                </FacebookShareButton>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <TwitterShareButton url={window.location.href} title={'Mira este evento increíble!'} >
                                    Compartir en X
                                </TwitterShareButton>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <WhatsappShareButton url={window.location.href} title={'Mira este evento increíble!'} >
                                    Compartir en WhatsApp
                                </WhatsappShareButton>
                            </MenuItem>
                            <MenuItem onClick={handleCopyLink}>
                                Copiar enlace
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
                <CardMedia component="img" sx={{ flex: '0 1 auto', transition: 'height 0.2s ease' }} height={view === 'initial' ? "70%" : view === 'secondary' ? "30%" : "50%"} image={eventData.image_url} alt="Imagen del evento" />
                {view === 'initial' && (
                    <Avatar src={perfilUrl} sx={{ width: 65, height: 65, position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                )}
                {view === 'initial' && <CardContentInitial sx={{ transition: 'all 2s ease-in-out' }} />}
                {view === 'secondary' && <CardContentSecondary sx={{ transition: 'all 2s ease-in-out' }} />}
                {view === 'tertiary' && <CardContentTertiary sx={{ transition: 'all 2s ease-in-out' }} />}
            </Card>
        </Box>
    );
};

export default EventClient;
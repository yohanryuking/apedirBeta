import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../AppContext';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { Card, CardContent, CardMedia, Typography, Box, Button, TextField, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const shareButtonRef = useRef(); // Añade esta línea

    useEffect(() => {
        if (!businesses) {
            return <LoadingAnimation />;
        }

        const business = businesses.find(business => String(business.name) === String(nombre));
        const categoria = categoryBusiness.find(cat => cat.id === businessData.category);
        setCategoriaB(categoria)
        setBusinessData(business)

    }, [nombre, businesses, categoryBusiness]);

    useEffect(() => {
        if (businessData) {
            const seccion = cayegoryProducts.filter(cat => cat.owner === businessData.name);
            console.log(seccion)
            setSecciones(seccion)

            const produ = products.filter(pro => pro.owner === businessData.name);
            console.log(produ);
            setProductos(produ)
        }

    }, [cayegoryProducts, products]);


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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h3">{businessData.name}</Typography>
                    <Typography variant="h3">{categoriaB?.nameCategory}</Typography>
                </Box>
                <Box>
                    {secciones?.map((seccion) => (
                        <div key={seccion.id}>
                            <Typography variant="h6">{seccion.nameProduct}</Typography>
                            {productos?.filter(producto => producto?.category === seccion.id).map((producto) => (
                                <div key={producto?.id}>
                                    <Typography variant="body1">{producto?.name}</Typography>
                                    {/* Aquí puedes mostrar más detalles del producto si lo deseas */}
                                </div>
                            ))}
                        </div>
                    ))}
                </Box>
            </Card>
        </Box>

    );
};

export default PerfilNegocio;
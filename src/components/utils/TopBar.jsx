import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Menu, MenuItem, Modal, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { supabase } from '../../services/client';
import QRCode from 'react-qr-code';
import img1 from '../../assets/images/img107.jpg';

const TopBar = ({ title, showFavorite, productId, userId }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const shareButtonRef = useRef();
    const qrRef = useRef();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const { data: favorite, error } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('productId', productId)
                    .eq('userId', userId)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error al verificar favoritos:', error);
                } else if (favorite) {
                    setIsFavorite(true);
                }
            } catch (error) {
                console.error('Error al verificar favoritos:', error);
            }
        };

        fetchFavoriteStatus();
    }, [productId, userId]);

    const handleFavoriteToggle = async () => {
        if (isFavorite) {
            // Eliminar de favoritos
            try {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('productId', productId)
                    .eq('userId', userId);

                if (error) {
                    console.error('Error al eliminar de favoritos:', error);
                    enqueueSnackbar('Error al eliminar de favoritos', { variant: 'error' });
                } else {
                    setIsFavorite(false);
                    enqueueSnackbar('Eliminado de favoritos', { variant: 'success' });
                }
            } catch (error) {
                console.error('Error al eliminar de favoritos:', error);
                enqueueSnackbar('Error al eliminar de favoritos', { variant: 'error' });
            }
        } else {
            // Agregar a favoritos
            try {
                const { error } = await supabase
                    .from('favorites')
                    .insert([{ productId, userId }]);

                if (error) {
                    console.error('Error al agregar a favoritos:', error);
                    enqueueSnackbar('Error al agregar a favoritos', { variant: 'error' });
                } else {
                    setIsFavorite(true);
                    enqueueSnackbar('Agregado a favoritos', { variant: 'success' });
                }
            } catch (error) {
                console.error('Error al agregar a favoritos:', error);
                enqueueSnackbar('Error al agregar a favoritos', { variant: 'error' });
            }
        }
    };

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
                title: `Compartir ${title}`,
                text: `Mira ${title} en APEDIR!`,
                url: window.location.href,
            })
                .then(() => console.log('Contenido compartido!'))
                .catch((error) => console.log('Hubo un error al compartir', error));
        } else {
            console.log('La API Web Share no está disponible en tu navegador');
            handleShareClick({ currentTarget: shareButtonRef.current });
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

    const handleCreateQR = () => {
        setShowQRModal(true);
        handleClose();
    };

    const handleDownloadQR = () => {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

        img.onload = () => {
            const padding = 50; // Padding alrededor del QR
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding, padding);

            const centerImg = new Image();
            centerImg.src = img1; // Reemplaza con la ruta de tu imagen
            centerImg.onload = () => {
                const imgWidth = 70; // Ancho de la imagen en el centro
                const imgHeight = 60; // Alto de la imagen en el centro
                ctx.drawImage(centerImg, (canvas.width - imgWidth) / 2, (canvas.height - imgHeight) / 2, imgWidth, imgHeight);

                const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = 'qrcode.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            };
        };
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex' }}>
                <IconButton sx={{ borderRadius: '50%', background: 'white' }} onClick={handleBackClick}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>
            <Box sx={{ position: 'absolute', top: 20, right: 10, display: 'flex', gap: '5px' }}>
                {showFavorite && (
                    <IconButton sx={{ borderRadius: '50%', background: 'white' }} onClick={handleFavoriteToggle}>
                        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                )}
                <IconButton ref={shareButtonRef} sx={{ borderRadius: '50%', background: 'white' }} onClick={handleShare}>
                    <ShareIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>
                        <FacebookShareButton url={window.location.href} quote={`Mira ${title} en APEDIR!`} >
                            Compartir en Facebook
                        </FacebookShareButton>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <TwitterShareButton url={window.location.href} title={`Mira ${title} en APEDIR!`} >
                            Compartir en X
                        </TwitterShareButton>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <WhatsappShareButton url={window.location.href} title={`Mira ${title} en APEDIR!`} >
                            Compartir en WhatsApp
                        </WhatsappShareButton>
                    </MenuItem>
                    <MenuItem onClick={handleCopyLink}>
                        Copiar enlace
                    </MenuItem>
                    <MenuItem onClick={handleCreateQR}>
                        Crear QR
                    </MenuItem>
                </Menu>
            </Box>

            <Modal
                open={showQRModal}
                onClose={() => setShowQRModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    textAlign: 'center'
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Código QR
                    </Typography>
                    <Box ref={qrRef} sx={{ position: 'relative', display: 'inline-block' }}>
                        <QRCode
                            value={window.location.href}
                            size={256}
                            bgColor="white"
                            fgColor="black"
                            level="H"
                            style={{ borderRadius: '10%' }}
                        />
                        <img
                            src={img1}
                            alt="Centro del QR"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '70px',
                                height: '60px',
                            }}
                        />
                    </Box>
                    <Button onClick={handleDownloadQR} sx={{ mt: 2 }}>
                        Descargar QR
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default TopBar;
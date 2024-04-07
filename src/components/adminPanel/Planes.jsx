import { Box, Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import { FaUser } from 'react-icons/fa';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const Planes = () => {
    const navigate = useNavigate();
    const handleBuy = (plan) => {
        const message = `buenas quiero adquirir su plan ${plan}`;
        const whatsappLink = `https://wa.me/+5356060886?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink);
    };

    return (
        <Box sx={{ width: '100vw' }}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h4" align="center">PLANES</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ margin: '10px 50px', boxSizing: 'border-box' }}>

                    <CardContent>
                        <FaUser />
                        <Typography variant="h6">Básico</Typography>
                        <Typography variant="body1">Características y ventajas:</Typography>
                        <Typography variant="body2">- Característica 1</Typography>
                        <Typography variant="body2">- Característica 2</Typography>
                        <Typography variant="body2">- Característica 3</Typography>
                        <Typography variant="h6">Precio: $10</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleBuy('Básico')}>
                            Comprar
                        </Button>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '10px 50px', boxSizing: 'border-box' }}>

                    <CardContent>
                        <FaUser />
                        <Typography variant="h6">Plus</Typography>
                        <Typography variant="body1">Características y ventajas:</Typography>
                        <Typography variant="body2">- Característica 1</Typography>
                        <Typography variant="body2">- Característica 2</Typography>
                        <Typography variant="body2">- Característica 3</Typography>
                        <Typography variant="h6">Precio: $20</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleBuy('Plus')}>
                            Comprar
                        </Button>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '10px 50px', boxSizing: 'border-box' }}>
                    <CardContent>
                        <FaUser />
                        <Typography variant="h6">Ultra</Typography>
                        <Typography variant="body1">Características y ventajas:</Typography>
                        <Typography variant="body2">- Característica 1</Typography>
                        <Typography variant="body2">- Característica 2</Typography>
                        <Typography variant="body2">- Característica 3</Typography>
                        <Typography variant="h6">Precio: $30</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleBuy('Ultra')}>
                            Comprar
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Planes;

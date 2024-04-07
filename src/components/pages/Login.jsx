import { useState } from 'react';
import { supabase } from '../../services/client';
import { TextField, Button, Typography, Box, InputAdornment, IconButton, Grid, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Image from '../../assets/images/img107.jpg'; // Asegúrate de reemplazar esto con la ruta a tu imagen

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const openSnackbar = (message) => {
        setMessage(message);
        setOpen(true);
    };

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            console.log(error);
            openSnackbar(error.message);
        } else {
            openSnackbar("All Good! ");
            navigate('/');
        }
    };


    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={6} container direction="column" alignItems="center" justifyContent="center"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleLogin(); // Cambia esto por la función que quieras ejecutar
                    }
                }} gap={6} sx={{ width: '95vw' }}>
                <img src={Image} alt="" style={{ width: '90%', height: 'auto' }} />
                <Typography variant="h5">Inicia sesión</Typography>
                <Typography variant="body2">
                    ¿No tienes una cuenta? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/register')}>Regístrate</span>
                </Typography>
                <TextField
                    type="email"
                    label="usuario@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{backgroundColor: 'rgba(0, 0, 0, 0.1)',borderRadius: 5, width: '80%', }}
                    InputProps={{
                        sx: {
                            borderRadius: 5, // Bordes redondos
                        },
                    }}
                />
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    label="12345678"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                    }}
                    InputProps={{ // Esto agrega el botón para mostrar/ocultar la contraseña
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 5, // Bordes redondos
                        },
                    }}
                />
                <Box display="flex" alignItems="center">
                    <Typography variant="body1">O</Typography>
                </Box>
                <Button
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                        color: 'black', // Color del texto
                    }}
                    startIcon={<FcGoogle />}
                    onClick={async () => {
                        const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'google',
                          })
                          
                        if (error) console.error(error);
                        else navigate('/hjhjh');
                    }}
                >
                    Iniciar sesión con Google
                </Button>
                <Button
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                        color: 'black', // Color del texto
                    }}
                    startIcon={<FaApple color='black' />}
                    onClick={() => {
                        // Aquí va tu código para iniciar sesión con Apple
                    }}
                >
                    Iniciar sesión con Apple
                </Button>
                <Snackbar open={open} autoHideDuration={3000}>
                    <Typography variant="body1">
                        {message}
                    </Typography>
                </Snackbar>
            </Grid>
        </Grid>
    );
};

export default Login;


// Path: src/App.jsx

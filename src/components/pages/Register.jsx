import { useState } from 'react';
import { supabase } from '../../services/client';
import { TextField, Button, Typography, Box, InputAdornment, IconButton, Grid, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Image from '../../assets/images/img107.jpg'; // Asegúrate de reemplazar esto con la ruta a tu imagen

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const openSnackbar = (message) => {
        setMessage(message);
        setOpen(true);
    };

    const handleRegister = async () => {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Guardar el nombre y el número de teléfono en user_metadata
                data: { full_name: name, phone: phone }
            }
        });

        if (error) {
            openSnackbar('Registration error: ' + error.message);
        } else {
            openSnackbar('Registration successful');
            navigate('/verification');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={6} container direction="column" alignItems="center" justifyContent="center"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleRegister();
                    }
                }} gap={6} sx={{ width: '95vw' }}>
                <img src={Image} alt="" style={{ width: '90%', height: 'auto' }} />
                <Typography variant="h5">Regístrate</Typography>
                <Typography variant="body2">
                    ¿Ya tienes una cuenta? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>Inicia sesión</span>
                </Typography>
                <TextField
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                    }}
                    InputProps={{
                        sx: {
                            borderRadius: 5, // Bordes redondos
                        },
                    }}
                />
                <TextField
                    label="Número de teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                    }}
                    InputProps={{
                        sx: {
                            borderRadius: 5, // Bordes redondos
                        },
                    }}
                />
                <TextField
                    type="email"
                    label="usuario@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                    }}
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
                <Button
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de fondo opaco
                        borderRadius: 5, // Bordes redondos
                        width: '80%', // Ancho completo
                        color: 'black', // Color del texto
                    }}
                    onClick={handleRegister}
                >
                    Regístrate
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

export default Register;
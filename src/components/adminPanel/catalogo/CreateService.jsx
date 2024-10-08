import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, FormControlLabel, Switch, Checkbox, FormGroup } from '@mui/material';
import { useSnackbar } from 'notistack';
import WeeklySchedule from '../../utils/WeeklySchedule';

const CreateService = ({ addService, closeModal }) => {
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [serviceImage, setServiceImage] = useState(null);
    const [showMinutes, setShowMinutes] = useState(false);
    const [sessions, setSessions] = useState({
        morning: true,
        afternoon: true,
        night: false,
    });
    const [selectedTimes, setSelectedTimes] = useState({});
    const [selectedRanges, setSelectedRanges] = useState({});
    const [startTime, setStartTime] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const handleNameChange = (event) => {
        setServiceName(event.target.value);
    };

    const handlePriceChange = (event) => {
        setServicePrice(event.target.value);
    };

    const handleImageChange = (event) => {
        setServiceImage(event.target.files[0]);
    };

    const handleTimeSelect = (day, time) => {
        if (!startTime) {
            setStartTime({ day, time });
            enqueueSnackbar('Seleccione la hora de finalización', { variant: 'info' });
        } else {
            const { day: startDay, time: start } = startTime;
            if (day === startDay) {
                setSelectedRanges((prev) => {
                    const newRanges = {
                        ...prev,
                        [day]: [...(prev[day] || []), [start, time]],
                    };
                    console.log('Rangos seleccionados:', newRanges);
                    return newRanges;
                });
                setStartTime(null);
            } else {
                enqueueSnackbar('Seleccione la hora de finalización en el mismo día', { variant: 'warning' });
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!serviceName || !servicePrice || Object.keys(selectedRanges).length === 0) {
            enqueueSnackbar('Por favor, complete todos los campos', { variant: 'warning' });
            return;
        }

        const schedules = Object.entries(selectedRanges).flatMap(([day, ranges]) =>
            ranges.map(([start, end]) => ({
                day,
                start_time: start,
                end_time: end,
            }))
        );

        const newService = {
            name: serviceName,
            category: 1, // Ajusta esto según tu lógica de categorías
            owner: 'uuid-del-propietario', // Ajusta esto según tu lógica de propietarios
            price: servicePrice,
            schedules,
        };

        addService(newService);
    };

    const handleSessionChange = (event) => {
        setSessions({
            ...sessions,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <Modal open onClose={closeModal}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h6" component="h2">
                    Crear Nuevo Servicio
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre del Servicio"
                        value={serviceName}
                        onChange={handleNameChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Precio del Servicio"
                        value={servicePrice}
                        onChange={handlePriceChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Subir Imagen
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    <FormControlLabel
                        control={<Switch checked={showMinutes} onChange={() => setShowMinutes(!showMinutes)} />}
                        label="Mostrar minutos"
                        sx={{ mt: 2 }}
                    />
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox checked={sessions.morning} onChange={handleSessionChange} name="morning" />}
                            label="Mañana"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sessions.afternoon} onChange={handleSessionChange} name="afternoon" />}
                            label="Tarde"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sessions.night} onChange={handleSessionChange} name="night" />}
                            label="Noche"
                        />
                    </FormGroup>
                    <WeeklySchedule
                        showMinutes={showMinutes}
                        sessions={sessions}
                        onTimeSelect={handleTimeSelect}
                        selectedRanges={selectedRanges}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Crear Servicio
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw', // Aumentar el ancho del modal
    maxHeight: '80vh', // Aumentar la altura del modal
    overflowY: 'auto', // Habilitar el desplazamiento vertical si es necesario
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default CreateService;
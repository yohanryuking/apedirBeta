import React, { useState } from 'react';
import { Button, TextField, Typography, IconButton, Modal, Box, Avatar } from '@mui/material';
import { Edit } from '@mui/icons-material';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventsImagesUpload from '../../utils/ImagesUpload';
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from '../../../services/client';
import 'react-toastify/dist/ReactToastify.css';


const CreateEvent = ({ business }) => {


    const convertMilitaryToNormalTime = (time) => {
        return moment(time, 'HH:mm').format('h:mm A');
    };


    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const [eventTime, setEventTime] = useState('');
    const [eventDate, setEventDate] = useState('');

    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventImage, setEventImage] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [ticketCount, setTicketCount] = useState(100);
    const [tableReservations, setTableReservations] = useState(0);
    const [price, setPrice] = useState(100);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageUpload = (file) => {
        setEventImage(file);
        console.log(file);
    };

    const handleCreateEvent = async () => {
        const event = {
            name: eventName,
            fecha: eventDate,
            place: 'el bar',
            owner: business.name,
            capacity: ticketCount,
            tables: tableReservations,
            price: price,
            hora: eventTime,
            // Otros campos del evento
        };

        console.log(event)
        const { data: events, error } = await supabase
            .from('events')
            .insert([event]);

        if (error) {
            console.error('Error creating event:', error.message);
            toast.error('Error creating event: ' + error.message);
        } else {
            console.log('Event created successfully:', events);
            // toast.success('Event created successfully');


            // Si la creación del evento fue exitosa, sube la imagen al bucket
            if (eventImage) {
                const filePath = `${business.name}/events/${event.name}.jpg`;
                console.log(eventImage)
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('feedImages')
                    .upload(filePath, eventImage, { upsert: true });

                if (uploadError) {
                    console.error('Error uploading image:', uploadError.message);
                    // toast.error('Error uploading image: ' + uploadError.message);
                } else {
                    console.log(uploadData)
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
                    } else {
                        // Actualiza el evento con la URL de la imagen

                        const { data, error: updateError } = await supabase
                            .from('events')
                            .update({ 'image_url': urlData.publicUrl })
                            .eq('name', event.name)
                            .select()
                        if (updateError) {
                            console.error('Error updating event:', updateError.message);
                            // toast.error('Error updating event: ' + updateError.message);
                        } else {
                            console.log('Event updated successfully with image URL');
                            // toast.success('Event updated successfully with image URL');
                        }
                    }
                }
            }
        }
    };

    return (

        <Box sx={{ borderRadius: 3, m: 2, }}>
            <ToastContainer />
            <Box sx={{ width: '100%', height: '200px', bgcolor: 'grey.500', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 3, mb: 2 }}>
                {eventImage ? <img src={URL.createObjectURL(eventImage)} alt="Evento" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 3 }} /> : <IconButton onClick={() => setIsImageModalOpen(true)}><Edit /></IconButton>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {/* <Avatar src={img} alt="Business" /> */}
                <Typography sx={{ ml: 2 }}>Organizador del evento</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <TextField label="Nombre del evento" value={eventName} onChange={(e) => setEventName(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 5 }, }} fullWidth />
                <TextField label="Descripción" multiline rows={4} value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 5 }, }} fullWidth />
                <Typography variant="h6" sx={{ fontSize: '0.8rem', marginBottom: '35px' }}>
                    Este evento es público. Cualquier persona dentro o fuera de APEDIR podrá verlo una vez que lo publiques.
                </Typography>
                <TextField label="Fecha y hora del evento" value={`${convertMilitaryToNormalTime(eventTime)}/${eventDate}`} onChange={(e) => setEventDateTime(e.target.value)} sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 5 }, }} fullWidth />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button variant="contained" startIcon={<AccessTimeIcon />} onClick={() => setIsTimeModalOpen(true)} sx={{ borderRadius: 3, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }}>Establecer hora</Button>
                    <Button variant="contained" startIcon={<DateRangeIcon />} onClick={() => setIsDateModalOpen(true)} sx={{ borderRadius: 3, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }}>Establecer fecha</Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ flex: 1 }}>Cantidad de entradas:</Typography>
                <TextField value={ticketCount} onChange={(e) => setTicketCount(e.target.value)} InputProps={{ sx: { borderRadius: 5 }, }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ flex: 1 }}>Reservas (mesas):</Typography>
                <TextField value={tableReservations} onChange={(e) => setTableReservations(e.target.value)} InputProps={{ sx: { borderRadius: 5 }, }} />
            </Box>
            <Button variant="contained" color="primary" onClick={handleCreateEvent} sx={{ borderRadius: 3, mb: 2, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }} fullWidth>CREAR EVENTO</Button>
            <Modal open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <EventsImagesUpload handleImageUpload={handleImageUpload}></EventsImagesUpload>
            </Modal>
            <Modal open={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Box m={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: 'white', width: '300px', height: '300px' }}>
                    <TextField type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                </Box>
            </Modal>
            <Modal open={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Box m={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: 'white', width: '300px', height: '300px' }}>
                    <TextField type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </Box>
            </Modal>
        </Box>
    );
};

export default CreateEvent;
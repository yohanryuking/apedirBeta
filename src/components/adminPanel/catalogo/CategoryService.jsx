import { useEffect, useState, useContext } from 'react';
import { Grid, Typography, IconButton, Button, Modal } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ServiceCatalogo from './ServiceCatalogo';
import CreateService from './CreateService';
import { Box, styled } from '@mui/system';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { TroubleshootRounded } from '@mui/icons-material';

import Slider from "react-slick";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppContext } from '../../../AppContext';
import { useSnackbar } from 'notistack';

const Root = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    maxWidth: '100vw', // Limitar el ancho máximo al 100% del ancho de la ventana del navegador
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)', // Sombra definida directamente
    display: 'flex',
    flexDirection: 'column',
}));

const CategoryRow = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
}));

const CategoryName = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const AddButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'black',
    color: 'white',
    marginBottom: theme.spacing(1),
    width: 'fit-content',
}));

const CategoryService = ({ category, onDelete, business }) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false); // Nuevo estado para rastrear la carga
    const theme = useTheme();
    const [currentService, setCurrentService] = useState(null);

    const { services, setServices } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddService = async (service) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('services')
            .insert([{
                'name': service.name,
                'owner': business.id, // Usar el ID del negocio
                'category': category.id,
                'price': service.price
            }])
            .select();

        if (error) {
            console.log('Error inserting service:', error);
            enqueueSnackbar('Error al agregar el servicio', { variant: 'error' });
            setLoading(false);
        } else {
            const newService = data[0];
            const serviceId = newService.id;

            // Insertar horarios
            const schedulePromises = service.schedules.map(schedule => {
                return supabase
                    .from('service_schedules')
                    .insert([{
                        'service_id': serviceId,
                        'day': schedule.day,
                        'start_time': schedule.start_time,
                        'end_time': schedule.end_time
                    }]);
            });

            const scheduleResults = await Promise.all(schedulePromises);
            const scheduleErrors = scheduleResults.filter(result => result.error);

            if (scheduleErrors.length > 0) {
                console.log('Error inserting schedules:', scheduleErrors);
                enqueueSnackbar('Error al agregar los horarios del servicio', { variant: 'error' });
                setLoading(false);
                return;
            }

            setServices([...services, newService]);
            enqueueSnackbar('Servicio agregado exitosamente', { variant: 'success' });
            setLoading(false);
            setOpenModal(false);

            if (service.image) {
                const filePath = `${business.name}/services/${service.name}.jpg`;

                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('feedImages')
                    .upload(filePath, service.image, { upsert: true });

                if (uploadError) {
                    console.error('Error uploading image:', uploadError.message);
                    enqueueSnackbar('Error al subir la imagen: ' + uploadError.message, { variant: 'error' });
                } else {
                    const { data: urlData, error: urlError } = await supabase
                        .storage
                        .from('feedImages')
                        .getPublicUrl(filePath);

                    if (urlError) {
                        console.error('Error getting image URL:', urlError.message);
                        enqueueSnackbar('Error al obtener la URL de la imagen: ' + urlError.message, { variant: 'error' });
                    } else {
                        const { data, error: updateError } = await supabase
                            .from('services')
                            .update({ 'image_url': urlData.publicUrl })
                            .eq('id', serviceId)
                            .select();

                        if (updateError) {
                            console.error('Error updating service:', updateError.message);
                            enqueueSnackbar('Error al actualizar el servicio: ' + updateError.message, { variant: 'error' });
                        } else {
                            enqueueSnackbar('Servicio actualizado exitosamente con la URL de la imagen', { variant: 'success' });
                        }
                    }
                }
            }
        }
    };

    const handleDeleteService = async (id) => {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Error deleting service:', error);
            enqueueSnackbar('Error al eliminar el servicio', { variant: 'error' });
        } else {
            setServices(services.filter(service => service.id !== id));
            enqueueSnackbar('Servicio eliminado exitosamente', { variant: 'success' });
        }
    };

    const getSliderSettings = (slidesToShow, slidesToShow6, slidesToShow48) => ({
        dots: TroubleshootRounded,
        infinite: services.length > 1, // Desactivar el comportamiento infinito si solo hay un producto
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        centerMode: false,
        arrows: false, // Desactivar las flechas
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: slidesToShow6,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: slidesToShow48,
                    slidesToScroll: 1
                }
            }
        ]
    });

    const filteredServices = services.filter(service => service.category === category.id);

    return (
        <Root>
            <CategoryRow>
                <CategoryName variant="h6">{category.name}</CategoryName>
                <div>
                    <IconButton onClick={handleOpenModal}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(category.id)}>
                        <Delete />
                    </IconButton>
                </div>
            </CategoryRow>
            <AddButton onClick={handleOpenModal}>Añadir Servicio</AddButton>
            <Slider {...getSliderSettings(3, 2, 1)}>
                {filteredServices.map(service => (
                    <ServiceCatalogo
                        key={service.id}
                        service={service}
                        onDelete={() => handleDeleteService(service.id)}
                    />
                ))}
            </Slider>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box>
                    <CreateService addService={handleAddService} closeModal={handleCloseModal} />
                </Box>
            </Modal>
        </Root>
    );
};

export default CategoryService;
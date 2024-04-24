// src/components/adminPanel/negocio/BusinessDataAdmin.jsx
import { Box, MenuItem, Checkbox, IconButton, Button, Select, TextField, Divider, Avatar, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useState, useEffect } from 'react';
import { supabase } from '../../../services/client';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
import BusinessMap from './BusinessMap';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { styled } from '@mui/system';
import { FaExclamationCircle, FaMapMarkerAlt, FaRegListAlt, FaTruck, FaPhoneAlt, FaEdit, FaCheck, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';


const BusinessDataAdmin = ({ business }) => {
    const [position, setPosition] = useState([business?.lat, business?.lng]);
    const [address, setAddress] = useState(business?.address || '');
    const [hasChanges, setHasChanges] = useState(false);

    const [schedules, setSchedules] = useState({
        Lunes: { opening: '', closing: '' },
        Martes: { opening: '', closing: '' },
        Miércoles: { opening: '', closing: '' },
        Jueves: { opening: '', closing: '' },
        Viernes: { opening: '', closing: '' },
        Sábado: { opening: '', closing: '' },
        Domingo: { opening: '', closing: '' },
    });

    const [socialLinks, setSocialLinks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const socialOptions = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'];
    const [selectedSocial, setSelectedSocial] = useState('Facebook');
    const [username, setUsername] = useState('');
    const [link, setLink] = useState('');

    const [isEditable, setIsEditable] = useState(false);
    const [name, setName] = useState(business?.name || '');
    const [provincia, setProvincia] = useState(business?.provincia || 'Granma');
    const [category, setCategory] = useState(business?.category || '');
    const [delivery, setDelivery] = useState(business?.delivery || false);
    const [phone, setPhone] = useState(business?.phone || '');
    const [categories, setCategories] = useState([]);
    const provinces = ['Pinar del Río', 'La Habana', 'Matanzas', 'Villa Clara', 'Cienfuegos', 'Sancti Spíritus', 'Ciego de Ávila', 'Camagüey', 'Las Tunas', 'Holguìn', 'Granma', 'Santiago de Cuba', 'Guantánamo'];

    const [description, setDescription] = useState(business.description);
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);

    const [photo, setPhoto] = useState(business.photo_portada);
    const [profilePhoto, setProfilePhoto] = useState(business.photo_perfil)


    const BlackDivider = (props) => <Divider sx={{ backgroundColor: 'black', margin: '10px' }} {...props} />;
    const StyledButton = styled(Button)({
        color: 'white',
        backgroundColor: 'black',
        '&:hover': {
            backgroundColor: 'gray',
        },
    });

    useEffect(() => {
        const fetchSchedules = async () => {
            const { data, error } = await supabase
                .from('business') // reemplaza 'businesses' con el nombre de tu tabla
                .select('schedules')
                .eq('id', business.id); // asumiendo que 'id' es la clave primaria de tu tabla
            if (error) {
                console.error('Error obteniendo los horarios:', error);
            } else if (data && data.length > 0) {
                setSchedules(data[0].schedules);
                console.log(data[0].schedules)
            }
        };

        const fetchSocialLinks = async () => {
            const { data, error } = await supabase
                .from('social_links') // reemplaza 'social_links' con el nombre de tu tabla
                .select('*')
                .eq('business_id', business.id); // asumiendo que 'business_id' es la clave foránea de tu tabla
            if (error) {
                console.error('Error obteniendo los enlaces de las redes sociales:', error);
            } else {
                setSocialLinks(data);
            }
        };

        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categoryBusiness') // reemplaza 'categoryBusiness' con el nombre de tu tabla
                .select('*');
            if (error) {
                console.error('Error obteniendo las categorías:', error);
            } else {
                setCategories(data);
                console.log(data)
            }
        };

        fetchCategories();
        fetchSocialLinks();
        fetchSchedules();
    }, []);

    //parte de la foto de perfil

    //parte de la foto de portada
    const handleFileChange = async (event, isProfilePhoto) => {
        const file = event.target.files[0];

        if (file) {
            // Cargar el archivo en el bucket
            const filePath = `${business.name}/profile/${isProfilePhoto ? 'profile.jpg' : 'cover.jpg'}`;
            const { error: uploadError } = await supabase.storage.from('feedImages').upload(filePath, file, { upsert: true });

            if (uploadError) {
                console.error('Error al cargar el archivo:', uploadError);
                return;
            } else {
                // Obtener la URL del archivo cargado
                const publicURL = supabase.storage.from('feedImages').getPublicUrl(filePath);

                if (!publicURL) {
                    console.error('Error al obtener la URL del archivo');
                } else {
                    console.log('publicURL:', publicURL.data.publicUrl);
                    console.log('business.id:', business.id);

                    const { data, error } = await supabase
                        .from('business')
                        .update({ [isProfilePhoto ? 'photo_perfil' : 'photo_portada']: publicURL.data.publicUrl })
                        .eq('id', business.id);

                    if (error) {
                        console.log('Error al actualizar la foto:', error);
                    } else {
                        console.log('Foto actualizada:', data);
                        if (isProfilePhoto) {
                            setProfilePhoto(publicURL.data.publicUrl); // Actualizar el estado de la foto de perfil
                        } else {
                            setPhoto(publicURL.data.publicUrl); // Actualizar el estado de la foto de portada
                        }
                    }
                }
            }
        }
    };

    //parte de la descripcion
    const handleDescriptionAcceptClick = async () => {
        if (isDescriptionEditable) {
            try {
                const { data, error } = await supabase
                    .from('business')
                    .update({ description: description })
                    .eq('id', business.id);

                if (error) {
                    throw error;
                }

                console.log('Descripción actualizada:', data);
            } catch (error) {
                console.error('Error al actualizar la descripción:', error);
            }
        }

        setIsDescriptionEditable(!isDescriptionEditable);
    };

    // parte de los detalles
    const handleAcceptClick = async () => {
        console.log('hizo click')
        if (isEditable) {
            try {
                const { data, error } = await supabase
                    .from('business')
                    .update({
                        name: name,
                        provincia: provincia,
                        category: category,
                        delivery: delivery,
                        phone: phone
                    })
                    .eq('id', business.id);

                if (error) {
                    throw error;
                }

                console.log('Datos actualizados:', data);
            } catch (error) {
                console.error('Error al actualizar los datos:', error);
            }
        }

        setIsEditable(!isEditable);
    };

    //la parte de las redes sociales
    const handleAddSocialLink = async (socialName, username, profileLink) => {
        // Verificar si ya existe un enlace para la misma red social
        const existingLink = socialLinks.find(link => link.socialName === socialName);
        if (existingLink) {
            console.error(`Ya existe un enlace para la red social ${socialName}.`);
            return;
        }

        const newLink = { business_id: business.id, socialName, username, profileLink };
        const { error } = await supabase
            .from('social_links') // reemplaza 'social_links' con el nombre de tu tabla
            .insert(newLink);
        if (error) {
            console.error('Error añadiendo el enlace de la red social:', error);
        } else {
            setSocialLinks(prevLinks => [...prevLinks, newLink]);
        }
    };

    const handleChange = (event) => {
        setSelectedSocial(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleClick = () => {
        console.log('entro bien')
        handleAddSocialLink(selectedSocial, username, link);
    };

    const handleDeleteSocialLink = async (linkId) => {
        const { error } = await supabase
            .from('social_links') // reemplaza 'social_links' con el nombre de tu tabla
            .delete()
            .eq('id', linkId);
        if (error) {
            console.error('Error eliminando el enlace de la red social:', error);
        } else {
            setSocialLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
        }
    };


    //la parte del mapa
    const handleAddressChange = async (event) => {
        const newAddress = event.target.value;
        setAddress(newAddress);

        // Aquí actualizamos la dirección en la base de datos
        const { error } = await supabase
            .from('business') // reemplaza 'businesses' con el nombre de tu tabla
            .update({ 'address': newAddress })
            .eq('id', business.id); // asumiendo que 'id' es la clave primaria de tu tabla
        if (error) {
            console.error('Error actualizando la dirección:', error);
        }
    };

    const handleMarkerDragEnd = async (newPosition) => {
        // Aquí actualizamos la ubicación en la base de datos
        const { error } = await supabase
            .from('business') // reemplaza 'businesses' con el nombre de tu tabla
            .update({ 'lat': newPosition.lat, 'lng': newPosition.lng })
            .eq('id', business.id); // asumiendo que 'id' es la clave primaria de tu tabla
        if (error) {
            console.error('Error actualizando la ubicación:', error);
        } else {
            setPosition([newPosition.lat, newPosition.lng]);

            // Aquí obtenemos la dirección legible
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${newPosition.lat}+${newPosition.lng}&key=7f284513855f4180bb77123b958251cb`);
            if (response.data.results && response.data.results.length > 0) {
                const newAddress = response.data.results[0].formatted;
                setAddress(newAddress);
                console.log(newAddress);

                // Aquí actualizamos la dirección en la base de datos
                const { error } = await supabase
                    .from('business') // reemplaza 'businesses' con el nombre de tu tabla
                    .update({ 'address': newAddress })
                    .eq('id', business.id); // asumiendo que 'id' es la clave primaria de tu tabla
                if (error) {
                    console.error('Error actualizando la dirección:', error);
                }
            } else {
                console.log('No se encontró ninguna dirección para estas coordenadas.');
            }
        }
    };

    //la parte de lo horarios
    const handleOpeningTimeChange = (day, time) => {
        setSchedules(prevSchedules => ({
            ...prevSchedules,
            [day]: { ...prevSchedules[day], opening: time },
        }));
        setHasChanges(true);
    };

    const handleClosingTimeChange = (day, time) => {
        setSchedules(prevSchedules => ({
            ...prevSchedules,
            [day]: { ...prevSchedules[day], closing: time },
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        const { error } = await supabase
            .from('business') // reemplaza 'businesses' con el nombre de tu tabla
            .update({ 'schedules': schedules })
            .eq('id', business.id); // asumiendo que 'id' es la clave primaria de tu tabla
        if (error) {
            console.error('Error actualizando los horarios:', error);
        } else {
            console.log('Horarios actualizados con éxito');
        }
    };

    return (
        <Box sx={{ p: 2, width: { xs: '100vw', sm: '500px' }, }}>
            {/* la parte de la foto de perfil */}
            <>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Foto de perfil</Typography>
                <Box sx={{ display: 'grid', alignItems: 'center', justifyItems: 'center', mb: 2, position: 'relative' }}>
                    <Avatar
                        src={profilePhoto || ''}
                        sx={{ width: 100, height: 100, mr: 2, gridArea: '1 / 1 / 2 / 2' }}
                    />
                    <IconButton
                        component="label"
                        style={{
                            gridArea: '1 / 1 / 2 / 2',
                            justifySelf: 'center', // Alinea el icono a la derecha del Avatar
                            alignSelf: 'end', // Alinea el icono al final
                            padding: '5px',
                            margin: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // fondo gris transparente
                            transform: 'translate(60%, 40%)' // Mueve el icono un 20% hacia abajo y a la derecha
                        }}
                    >
                        <CameraAltIcon style={{ color: 'white' }} />
                        <input
                            type="file"
                            hidden
                            onChange={(event) => handleFileChange(event, true)}
                        />
                    </IconButton>
                </Box>
                <BlackDivider />
            </>

            {/* la parte de la foto de portada */}
            <>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Foto de portada</Typography>
                <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
                    <img
                        src={photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
                        alt="Foto de portada"
                        style={{ width: '100%', height: '250px', backgroundColor: 'grey', borderRadius: '20px' }}
                    />
                    <IconButton
                        component="label"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                            padding: '5px',
                            margin: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)' // fondo gris transparente
                        }}
                    >
                        <CameraAltIcon style={{ color: 'white' }} />
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </IconButton>
                </Box>
                <BlackDivider />
            </>
            {/* la parte de la presentacion */}
            <>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Presentación</Typography>
                    <IconButton onClick={handleDescriptionAcceptClick}>
                        {isDescriptionEditable ? 'Aceptar' : 'Editar'}
                    </IconButton>
                </Box>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <TextField
                        value={description}
                        disabled={!isDescriptionEditable}
                        multiline
                        fullWidth
                        variant="standard"
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { padding: '10px', border: 'none' } }}
                    />

                </Box>
                <BlackDivider />
            </>

            {/* la parte de los detalles */}
            <>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Detalles</Typography>
                    <Box>
                        <IconButton onClick={handleAcceptClick}>
                            {isEditable ? 'Aceptar' : 'Editar'}
                        </IconButton>

                    </Box>
                </Box>
                <Box sx={{ mt: 2, mb: 2 }}>

                    <Box display="flex" alignItems="center">
                        <FaExclamationCircle size={24} style={{ marginRight: '10px' }} />
                        <Typography variant="body1" mr={2}>Nombre:</Typography>
                        <TextField
                            value={name}
                            disabled={!isEditable}
                            variant="standard"
                            onChange={(e) => setName(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { padding: '10px' } }}
                        />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <FaMapMarkerAlt size={24} style={{ marginRight: '10px' }} />
                        <Typography variant="body1" mr={2}>Provincia:</Typography>
                        <Select
                            value={provincia}
                            disabled={!isEditable}
                            variant="standard"
                            sx={{ '& .MuiInputBase-input': { padding: '10px' } }}
                            onChange={(e) => setProvincia(e.target.value)}
                        >
                            {provinces.map((province) => (
                                <MenuItem key={province} value={province}>{province}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <FaRegListAlt size={24} style={{ marginRight: '10px' }} />
                        <Typography variant="body1" mr={2}>Categoría:</Typography>
                        <Select
                            labelId="category-label"
                            disabled={!isEditable}
                            id="category-select"
                            value={category}
                            variant="standard"
                            sx={{ '& .MuiInputBase-input': { padding: '10px' } }}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {/* {console.log(category)} */}
                                    {category.nameCategory}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <FaTruck size={24} style={{ marginRight: '10px' }} />
                        <Typography variant="body1" mr={2}>Delivery:</Typography>
                        <Checkbox
                            checked={delivery}
                            disabled={!isEditable}
                            onChange={(event) => setDelivery(event.target.checked)}
                        />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <FaPhoneAlt size={24} style={{ marginRight: '10px' }} />
                        <Typography variant="body1" mr={2}>Teléfono:</Typography>
                        <TextField
                            value={phone}
                            disabled={!isEditable}
                            variant="standard"
                            onChange={(e) => setPhone(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { padding: '10px' } }}
                        />
                    </Box>
                </Box>
                <BlackDivider />
            </>

            {/* la parte de las redes sociales */}
            <>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Redes sociales</Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <StyledButton onClick={() => setShowForm(true)}>Agregar un enlace social</StyledButton>
                    {showForm && (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
                            <Select value={selectedSocial} onChange={handleChange}>
                                {socialOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField placeholder='Nombre de usuario' onChange={handleUsernameChange} />
                            <TextField placeholder="Enlace al perfil" onChange={handleLinkChange} />
                            <StyledButton onClick={handleClick}>Guardar</StyledButton>
                        </Box>
                    )}
                </Box>
                {socialLinks.map((link, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        {link.socialName === 'Facebook' && <FaFacebook size={32} style={{ marginRight: '10px' }} />}
                        {link.socialName === 'Twitter' && <FaTwitter size={32} style={{ marginRight: '10px' }} />}
                        {link.socialName === 'Instagram' && <FaInstagram size={32} style={{ marginRight: '10px' }} />}
                        {link.socialName === 'YouTube' && <FaYoutube size={32} style={{ marginRight: '10px' }} />}
                        {link.socialName === 'LinkedIn' && <FaLinkedin size={32} style={{ marginRight: '10px' }} />}
                        <Typography variant="body1" sx={{ flex: 1 }}>{link.username}</Typography>
                        <StyledButton onClick={() => handleDeleteSocialLink(link.id)}>Eliminar</StyledButton>
                    </Box>
                ))}
                <BlackDivider />
            </>

            {/* la parte del mapa */}
            <>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ubicación</Typography>
                <TextField
                    label="Dirección"
                    value={address}
                    onChange={handleAddressChange}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                    {position[0] && position[1] ? (
                        <BusinessMap initialPosition={position} onPositionChange={handleMarkerDragEnd} />
                    ) : (
                        <div>Cargando mapa...</div>
                    )}
                </Box>
                <BlackDivider />
            </>

            {/* la parte de los horarios */}
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Horarios</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body1" sx={{ flex: 1, fontWeight: 'bold' }}>Día</Typography>
                    <Typography variant="body1" sx={{ flex: 1, fontWeight: 'bold', mr: 2, color: 'green' }}>Apertura</Typography>
                    <Typography variant="body1" sx={{ flex: 1, fontWeight: 'bold', color: 'red' }}>Cierre</Typography>
                </Box>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                    <Box key={day} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body1" sx={{ flex: 1 }}>{day}</Typography>
                        <TextField
                            type="time"
                            value={schedules[day].opening}
                            sx={{ mr: 10, '& .MuiInputBase-input': { padding: '10px' } }}
                            inputProps={{ style: { color: 'green' } }}
                            onChange={(event) => handleOpeningTimeChange(day, event.target.value)}
                        />
                        <TextField
                            type="time"
                            value={schedules[day].closing}
                            sx={{ mr: 10, '& .MuiInputBase-input': { padding: '10px' } }}
                            inputProps={{ style: { color: 'red' } }}
                            onChange={(event) => handleClosingTimeChange(day, event.target.value)}
                        />
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <StyledButton variant="contained" onClick={handleSave} disabled={!hasChanges}>Guardar</StyledButton>
                </Box>
            </Box>
        </Box>
    );
};

export default BusinessDataAdmin;
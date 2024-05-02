import React, { useState, useEffect } from 'react';
import { Button, Avatar, Box } from '@mui/material';
import { supabase } from '../../services/client'; // Assuming you have supabase configured

const ImagesController = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                console.log('dentro del use ffect')
                const userId = (await supabase.auth.getUser()).data.user.id;
                const { data, error } = await supabase
                    .from('users')
                    .select('photoUrl').eq('id', userId);
                if (error) {
                    console.error('Error fetching user profile:', error.message);
                } else {
                    console.log('cargo bien')
                    setAvatarUrl(data[0]?.photoUrl);
                    setIsLoading(false);
                }
            } catch (error) {
                // toast.error('Problemas para conectar con el servidor, revise su conexion a internet');
            }
        }

        fetchAvatar();
    }, []);


    const handleSelectImage = async (event) => {
        const file = event.target.files[0];
        console.log(file);
        // toast.success('Subiendo imagen, espere')
        if (file) {
            const userId = (await supabase.auth.getUser()).data.user.id; // Reemplaza esto con el ID del usuario
            const newName = 'avatar'; // Reemplaza esto con el nuevo nombre que quieras
            const newFileName = `${newName}.jpg`; // Combina el nuevo nombre con la extensión

            const { data, error } = await supabase.storage
                .from('images') // Reemplaza 'bucket_name' con el nombre de tu bucket
                .upload(`${userId}/${newFileName}`, file, { upsert: true }); // Incluye la opción upsert; // Incluye el ID del usuario en la ruta del archivo

            if (error) {
                console.error('Error uploading image:', error);
                // toast.error('Error al subir la imagen');
            } else {
                console.log('Image uploaded successfully:', data.fullPath);
                setSelectedImage(data.fullPath);
                console.log(data.fullPath)

                // Update the photoUrl field in the user table
                const { data: userUpdate, error: updateError } = await supabase
                    .from('users')
                    .update({ photoUrl: data.fullPath })
                    .eq('id', userId);
                if (updateError) {
                    console.error('Error updating user:', updateError);
                    // toast.error('Error al actualizar el usuario');
                } else {
                    // toast.success('Imagen subida correctamente, actualice la pagina para ver los cambios');
                }
            }
        }
    };

    const handleRemoveImage = async () => {
        const userId = (await supabase.auth.getUser()).data.user.id;
        console.log(avatarUrl)
            const { data, error } = await supabase.storage
                .from('images') // Replace 'bucket_name' with your actual bucket name
                .remove(userId+'/avatar.jpg');
            if (error) {
                console.error('Error removing image:', error);
                // toast.error('Error al eliminar la imagen');
            } else {
                console.log('Image removed successfully:', data);
                setSelectedImage(null);
                // toast.success('Imagen eliminada correctamente');
            }

    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
                margin: '0 auto',
                padding: '20px',
                maxWidth: '600px',
            }}
        >
            {/* <ToastContainer /> */}
            {isLoading ? (
                <p>Cargando...</p>
            ) : (
                <img src={'https://duerpqsxmxeokygbzexa.supabase.co/storage/v1/object/public/' + avatarUrl || 'https://duerpqsxmxeokygbzexa.supabase.co/storage/v1/object/public/' + selectedImage} alt="Avatar" />
            )}
            <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
                Seleccionar imagen
                <input type="file" hidden onChange={handleSelectImage} />
            </Button>
            <Button variant="contained" onClick={handleRemoveImage} sx={{ marginTop: '20px' }}>
                Quitar imagen actual
            </Button>
        </Box>
    );
};

export default ImagesController;

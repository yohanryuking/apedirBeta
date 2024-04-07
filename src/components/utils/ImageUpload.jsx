import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { supabase } from '../../services/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ImageUpload = () => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [profileImagen, setProfileImagen] = useState();
  const [coverImagen, setCoverImagen] = useState();

  useEffect(() => {
    toast.success('A continuacion seleccione una o ambas fotos a subir, tenga en cuenta que segun el tamano de la imagen y su conexion a internet, el proceso puede tardar unos segundos');
  }, []
  );

  const handleProfileButtonClick = (event) => {
    setProfileDialogOpen(true);
    setProfileImagen(event.target.files[0])
    toast.success('Imagen de perfil configurada correctamente, subala o agregue la de portada si no lo ha hecho');
  };

  const handleCoverButtonClick = (event) => {
    setCoverDialogOpen(true);
    setCoverImagen(event.target.files[0])
    toast.success('Imagen de portada configurada correctamente, subala o agregue la de portada si no lo ha hecho');
  };

  const handleSelectImage = async () => {
    toast.success('Subiendo imagen, espere')
    const user = (await supabase.auth.getUser()).data.user.email;
    console.log(user)

    if (coverDialogOpen) {
      const userId = (await supabase.auth.getUser()).data.user.id; // Reemplaza esto con el ID del usuario
      const newFileNameC = `coverBusines.jpg`;

      const { data, error } = await supabase.storage
        .from('images') // Reemplaza 'bucket_name' con el nombre de tu bucket
        .upload(`${userId}/${newFileNameC}`, coverImagen, { upsert: true }); // Incluye la opción upsert; // Incluye el ID del usuario en la ruta del archivo

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Error al subir la imagen');
      } else {
        console.log('Image uploaded successfully:', coverImagen);
        console.log(coverImagen)
        console.log(user)

        // Update the photo_portada field in the busines table
        const { data: userUpdate, error: updateError } = await supabase
          .from('business')
          .update({ photo_portada: coverImagen })
          .eq('owner', user);
        if (updateError) {
          console.error('Error updating userdata.fullPath:', updateError);
          toast.error('Error al actualizar su foto de portada del negocio');
        } else {
          toast.success('Imagen subida correctamente, actualice la pagina para ver los cambios');
        }
      }
    }

    if (profileDialogOpen) {
      const userId = (await supabase.auth.getUser()).data.user.id; // Reemplaza esto con el ID del usuario
      const newFileNameA = `avatarBusines.jpg`;

      const { data, error } = await supabase.storage
        .from('images') // Reemplaza 'bucket_name' con el nombre de tu bucket
        .upload(`${userId}/${newFileNameA}`, profileImagen, { upsert: true }); // Incluye la opción upsert; // Incluye el ID del usuario en la ruta del archivo

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Error al subir la imagen');
      } else {
        console.log('Image uploaded successfully:', profileImagen);
        console.log(profileImagen)
        console.log(user)

        // Update the photo_portada field in the user table
        const { data: userUpdate, error: updateError } = await supabase
          .from('business')
          .update({ photo_perfil: profileImagen })
          .eq('owner', user);
        if (updateError) {
          console.error('Error updating user:', updateError);
          toast.error('Error al actualizar su foto de perfil del negocio');
        } else {
          toast.success('Imagen subida correctamente, actualice la pagina para ver los cambios');
        }
      }
    }
  };

  return (
    <Box m={4} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
      <ToastContainer />
      <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
        Foto de Perfil
        <input type="file" hidden onChange={handleProfileButtonClick} />
      </Button>
      <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
        Foto de Portada
        <input type="file" hidden onChange={handleCoverButtonClick} />
      </Button>


      {(profileDialogOpen || coverDialogOpen) && (
        <Button variant="contained" color="primary" onClick={handleSelectImage}>
          Subir imágenes
        </Button>
      )}
    </Box>
  );
};

export default ImageUpload;
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Avatar, Box, Button, Grid, List, ListItem, ListItemText, TextField, Typography, IconButton, Modal } from '@mui/material';
import { styled } from '@mui/system';
import { supabase } from '../../../services/client';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LoadingAnimation from '../../utils/LoadingAnimation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ImagesController from './ImagesController';
const ImagesController = React.lazy(() => import('../../utils/ImagesController'));
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

const BlurredBackground = styled(Box)(({ theme }) => ({
  backgroundImage: `url('profilePicture.jpg')`,
  filter: 'blur(4px)',
  height: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ProfilePicture = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: '4px solid white',
}));

const PersonalProfile = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user.id;
        console.log(userId)
        setId(userId);
        const { data, error } = await supabase
          .from('users')
          .select('name,phone,plan,email,photoUrl').eq('id', userId);
        if (error) {
          console.error('Error fetching user profile:', error.message);
          enqueueSnackbar('Error fetching user profile: ' + error.message, { variant: 'error' });
        } else {
          setUser(data[0]);
          setName(data[0]?.name);
          setEmail(data[0]?.email);
          setPhone(data[0]?.phone);
          setAvatarUrl(data[0]?.photoUrl)
        }
      } catch (error) {
        enqueueSnackbar('Problemas para conectar con el servidor, revise su conexion a internet', { variant: 'error' });
      }
    }
    fetchUser();
  }, []);

  const handleCreateBusiness = () => {
    // Logic to create a new business
  };

  const handleUpdateProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .update({ name, phone })
      .eq('id', id);
    if (error) {
      console.error('Error updating user profile:', error.message);
      enqueueSnackbar('Error fetching user profile: ' + error.message, {variant:'error'});
    } else {
      console.log('User profile updated successfully:', data);
      enqueueSnackbar('User profile updated successfully', {variant:'success'});
    }
  };

  const planLevel = (plan) => {
    if (plan == 0) {
      return 'Gratis';
    } else if (plan == 1) {
      return 'Básico';
    } else if (plan == 2) {
      return 'Plus';
    } else if (plan == 3) {
      return 'Ultra';
    }
    return 'Sin Plan';
  };

  const handleLogout = () => {
    // Logic to handle logout
    supabase.auth.signOut();
  };

  return (
    <Box position="relative" sx={{
      width: { xs: '100%', md: '100vw' },
      height: '100vh',
      bgcolor: 'background.default'
    }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ProfilePicture src={avatarUrl ? 'https://duerpqsxmxeokygbzexa.supabase.co/storage/v1/object/public/' + avatarUrl : 'defaultAvatar.jpg'} />
        <Box >
          <IconButton
            onClick={handleOpen}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '&:hover': { backgroundColor: 'grey.200' },
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Suspense fallback={<LoadingAnimation />}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-avatar-modal"
            aria-describedby="modal-for-editing-avatar"
            sx={{ padding: 5 }}
          >
            <ImagesController />
          </Modal>
        </Suspense>
      </Box>
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center' }}>
          {user?.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleUpdateProfile} fullWidth>
              Editar perfil
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={() => { navigate('/profile/business') }} fullWidth>
              Gestionar Negocio
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Nombre" value={name === null ? "" : name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Correo electrónico" value={email === null ? "" : email} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Teléfono" value={phone === null ? "" : phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <ListItemText primary="Plan Actual" secondary={planLevel(user?.plan)} />
            <Grid item xs={12} md={6} >
              <Button variant="contained" color="primary" onClick={() => { navigate('/plans') }}>Cambiar Plan</Button>
            </Grid>
          </Grid>
        </Grid>
        <Button variant="contained" color="secondary" onClick={handleLogout} fullWidth>
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default PersonalProfile;
import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Typography, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { supabase } from '../../../services/client';
import CategoryProduct from './CategoryProduct';
import CategoryService from './CategoryService';
import CreateCategory from './CreateCategory';
import { AppContext } from '../../../AppContext';
import { useSnackbar } from 'notistack';

const Categories = ({ business }) => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('products'); // Nuevo estado para el botón de doble selección

    const { categoryServices, categoryProducts, setCategoryServices, setCategoryProducts, products } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // No necesitamos hacer una petición a la base de datos aquí, ya que los datos están en el contexto
    }, [categoryProducts, categoryServices]);

    const handleViewChange = (event, newView) => { // Nueva función para manejar el cambio de vista
        setView(newView);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddCategory = async (category, view) => {
        if (view === 'products') {
            const { data, error } = await supabase
                .from('categoryProducts')
                .insert([{ 'nameProduct': category, 'owner': business.name }]).select();

            if (error) {
                console.log('Error inserting category:', error);
                enqueueSnackbar('Error al agregar la categoría de producto', { variant: 'error' });
            } else {
                enqueueSnackbar('Categoría de producto agregada exitosamente', { variant: 'success' });
                setOpen(false);
                // Actualizar el contexto
                setCategoryProducts(prevCategories => [...prevCategories, data[0]]);
            }
        } else if (view === 'services') {
            const { data, error } = await supabase
                .from('categoryServices')
                .insert([{ 'name': category, 'owner': business.id }]).select();

            if (error) {
                console.log('Error inserting category:', error);
                enqueueSnackbar('Error al agregar la categoría de servicio', { variant: 'error' });
            } else {
                enqueueSnackbar('Categoría de servicio agregada exitosamente', { variant: 'success' });
                setOpen(false);
                // Actualizar el contexto
                setCategoryServices(prevCategories => [...prevCategories, data[0]]);
            }
        }
    };

    const handleDeleteCategory = async (id, view) => {
        let error;
        if (view === 'products') {
            ({ error } = await supabase
                .from('categoryProducts')
                .delete()
                .eq('id', id));
            if (!error) {
                enqueueSnackbar('Categoría de producto eliminada exitosamente', { variant: 'success' });
                // Actualizar el contexto
                setCategoryProducts(prevCategories => prevCategories.filter(category => category.id !== id));
            } else {
                enqueueSnackbar('Error al eliminar la categoría de producto', { variant: 'error' });
            }
        } else if (view === 'services') {
            ({ error } = await supabase
                .from('categoryServices')
                .delete()
                .eq('id', id));
            if (!error) {
                enqueueSnackbar('Categoría de servicio eliminada exitosamente', { variant: 'success' });
                // Actualizar el contexto
                setCategoryServices(prevCategories => prevCategories.filter(category => category.id !== id));
            } else {
                enqueueSnackbar('Error al eliminar la categoría de servicio', { variant: 'error' });
            }
        }
    };

    // Filtrar categorías por el negocio actual
    const filteredCategoryProducts = categoryProducts.filter(category => category.owner === business.name);
    const filteredCategoryServices = categoryServices.filter(category => category.owner === business.id);

    return (
        <Box sx={{ maxWidth: { xs: '100vw', sm: '500px' } }}>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Categorías</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view"
                >
                    <ToggleButton value="products" aria-label="products">
                        Productos
                    </ToggleButton>
                    <ToggleButton value="services" aria-label="services">
                        Servicios
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {view === 'products' ?
                filteredCategoryProducts.map((category) => (
                    <Box key={category.id} sx={{ mb: 5, m: 2 }}>
                        <CategoryProduct category={category} onDelete={() => handleDeleteCategory(category.id, 'products')} business={business} />
                    </Box>
                ))
                :
                filteredCategoryServices.map((category) => (
                    <Box key={category.id} sx={{ mb: 5, m: 2 }}>
                        <CategoryService category={category} onDelete={() => handleDeleteCategory(category.id, 'services')} business={business} />
                    </Box>
                ))
            }
            <Button variant="contained" sx={{ mt: 2, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }} onClick={() => setOpen(true)}>Añadir categoría</Button>
            <Modal open={open} onClose={handleClose}>
                <div>
                    <CreateCategory addCategory={handleAddCategory} closeModal={handleClose} view={view} />
                </div>
            </Modal>
        </Box>
    );
};

export default Categories;
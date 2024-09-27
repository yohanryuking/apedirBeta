import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Typography, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { supabase } from '../../../services/client';
import CategoryProduct from './CategoryProduct';
import CategoryService from './CategoryService';
import CreateCategory from './CreateCategory';
import { AppContext } from '../../../AppContext';

const Categories = ({ business }) => {
    // const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('products'); // Nuevo estado para el botón de doble selección

    const { categoryServices, cayegoryProducts, setCategoryServices, products } = useContext(AppContext);


    const handleViewChange = (event, newView) => { // Nueva función para manejar el cambio de vista
        setView(newView);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddCategory = async (category, view) => {
        if (view === 'products') {
            const { data, error } = await supabase
                .from('cayegoryProducts')
                .insert([{ 'nameProduct': category, 'owner': business.name }]);

            if (error) {
                console.log('Error inserting category:', error);
            } else {
                setOpen(false);
            }
        } else if (view === 'services') {
            console.log(business.id)
            const { data, error } = await supabase
                .from('categoryServices')
                .insert([{ 'name': category, 'owner': business.id }]).select();

            if (error) {
                console.log('Error inserting category:', error);
            } else {
                console.log(data[0])
                setCategoryServices(prevCategories => [...prevCategories, data[0]]); // Actualiza el estado en el contexto
                setOpen(false);
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        const { error } = await supabase
            .from('cayegoryProducts')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Error deleting category:', error);
        } else {
            // setCategories(categories.filter(category => category.id !== id));
        }
    };

    useEffect(() => {
        // const fetchCategories = async () => {
        //     const { data: categories, error } = await supabase
        //         .from('cayegoryProducts')
        //         .select('*')
        //         .eq('owner', business.name);

        //     if (error) {
        //         console.log('Error fetching categories:', error);
        //     } else {
        //         setCategories(categories);
        //     }
        // };

        // fetchCategories();
        console.log(categoryServices)
    }, [cayegoryProducts, categoryServices]); // Agrega categories como una dependencia del useEffect

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
                cayegoryProducts.map((category) => (
                    <Box key={category.id} sx={{ mb: 5, m: 2 }}>
                        <CategoryProduct category={category} onDelete={handleDeleteCategory} business={business} />
                    </Box>
                ))
                :
                categoryServices.map((category) => (
                    <Box key={category.id} sx={{ mb: 5, m: 2 }}>
                        {console.log(categoryServices)}
                        {/* <CategoryProduct category={category} onDelete={handleDeleteCategory} business={business} /> */}
                        <CategoryService/>
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
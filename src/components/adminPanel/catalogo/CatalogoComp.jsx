import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { supabase } from '../../../services/client';
import EditCategory from './EditCategory';
import CreateCategory from './CreateCategory';

const Categories = ({ business }) => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddCategory = async (category) => {
        const { data, error } = await supabase
            .from('cayegoryProducts')
            .insert([{ 'nameProduct': category, 'owner': business.name }]);

        if (error) {
            console.log('Error inserting category:', error);
        } else {
            setOpen(false);
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
            setCategories(categories.filter(category => category.id !== id));
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const { data: categories, error } = await supabase
                .from('cayegoryProducts')
                .select('*')
                .eq('owner', business.name);

            if (error) {
                console.log('Error fetching categories:', error);
            } else {
                setCategories(categories);
            }
        };

        fetchCategories();
    }, [categories]); // Agrega categories como una dependencia del useEffect

    return (
        <Box sx={{ maxWidth: { xs: '100vw', sm: '500px' } }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Categorías</Typography>
            {categories.map((category) => (
                <Box key={category.id} sx={{ mb: 5, m: 2 }}>
                    <EditCategory category={category} onDelete={handleDeleteCategory} business={business} />
                </Box>
            ))}
            <Button variant="contained" sx={{ mt: 2, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }} onClick={() => setOpen(true)}>Añadir categoría</Button>
            <Modal open={open} onClose={handleClose}>
                <div>
                    <CreateCategory addCategory={handleAddCategory} closeModal={handleClose} />
                </div>
            </Modal>
        </Box>
    );
};

export default Categories;
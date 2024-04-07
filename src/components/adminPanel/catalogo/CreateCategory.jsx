import { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

const CreateCategory = ({ addCategory, closeModal }) => { // Recibe las funciones como props

    const [category, setCategory] = useState(''); // Estado para el valor del campo de entrada

    const handleSubmit = (event) => {
        event.preventDefault();
        addCategory(category); // Llama a la función addCategory cuando se envía el formulario
        console.log(category)
        closeModal();
    };

    const handleChange = (event) => {
        setCategory(event.target.value); // Actualiza el estado cuando el valor del campo de entrada cambia
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.paper', // Fondo blanco
                margin: 'auto', // Centra el contenido
                width: '80%', // Ajusta el ancho al 80% del contenedor
                padding: 2, // Añade un padding
                borderRadius: 1, // Añade un borde redondeado
            }}
        >
            <Typography variant="h6" gutterBottom>
                Añadir Categoría
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nombre de la categoría"
                    variant="outlined"
                    fullWidth
                    value={category} // Establece el valor del campo de entrada
                    onChange={handleChange} // Actualiza el estado cuando el valor del campo de entrada cambia
                />
                <Button type="submit" variant="contained" color="primary">
                    Guardar
                </Button>
                <Button onClick={closeModal} variant="contained"> {/* Llama a la función closeModal cuando se hace clic en el botón */}
                    Cerrar
                </Button>
            </form>
        </Box>
    );
};

export default CreateCategory;
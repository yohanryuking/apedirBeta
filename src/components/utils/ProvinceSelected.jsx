import React from 'react';
import { styled } from '@mui/system';
import { Box, FormControl as MuiFormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const RootBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const StyledLocationOnIcon = styled(LocationOnIcon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const Select = styled(MuiSelect)({
    '& .MuiSelect-select': {
        border: 'none',
    },
    '&:before': {
        // this is to remove the underline below the select component
        content: 'none',
    },
});

const FormControl = styled(MuiFormControl)({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
});

const ProvinceSelected = ({ value, onChange }) => {
    const provinces = ['Todas las provincias', 'Pinar del Río', 'La Habana', 'Matanzas', 'Villa Clara', 'Cienfuegos', 'Sancti Spíritus', 'Ciego de Ávila', 'Camagüey', 'Las Tunas', 'Holguìn', 'Granma', 'Santiago de Cuba', 'Guantánamo'];

    return (
        <RootBox>
            <StyledLocationOnIcon />
            <FormControl>
                <Select value={value} onChange={onChange}>
                    {provinces.map((province) => (
                        <MenuItem key={province} value={province}>{province}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </RootBox>
    );
};

export default ProvinceSelected;
import React from 'react';
import { styled } from '@mui/system';
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: theme.palette.common.white,
    padding: theme.spacing(0.5),
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    flex: 1,
}));

const SearchIconButton = styled(IconButton)({
    padding: 10,
});

const SearchBar = ({ onSearch }) => {
    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        onSearch(searchTerm);
    };

    return (
        <SearchContainer>
            <SearchIconButton aria-label="search">
                <SearchIcon />
            </SearchIconButton>
            <SearchInput
                placeholder="Buscar..."
                onChange={handleSearch}
            />
        </SearchContainer>
    );
};

export default SearchBar;
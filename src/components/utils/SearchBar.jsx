import React from 'react';
import { styled } from '@mui/system';
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: '30px',
    border: `1px solid grey`,
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

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
        console.log(e.target.value);
    };

    return (
        <SearchContainer>
            <SearchIconButton aria-label="search">
                <SearchIcon />
            </SearchIconButton>
            <SearchInput
                placeholder="Buscar..."
                onChange={handleSearch}
                value={searchTerm}
            />
        </SearchContainer>
    );
};

export default SearchBar;
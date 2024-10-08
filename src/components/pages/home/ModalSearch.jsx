import React from "react";
import { Box } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../AppContext";
import SearchBar from "../../utils/SearchBar";
import { useState } from "react";
import { useEffect } from "react";


const ModalSearch = () => {

    const { products, businesses, categoryBusiness, categoryProducts, events, isAllDataLoaded } = useContext(AppContext)
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (isAllDataLoaded) {
            console.log(isAllDataLoaded)
        }

    }, [isAllDataLoaded]);

    const buscar = () => {
        if (searchTerm) {
            const productResults = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(product => ({ ...product, type: 'product' }));

            const businessResults = businesses.filter(business =>
                business.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(business => {
                const category = categoryBusiness.find(category => category.id === business.category);
                return { ...business, type: 'business', nameCategory: category ? category.nameCategory : 'Desconocido' };
            });

            const eventResults = events.filter(event =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(event => ({ ...event, type: 'event' }));

            const cayegoryProductResults = categoryProducts.filter(cayegoryProduct =>
                cayegoryProduct.nameProduct.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(cayegoryProduct => ({ ...cayegoryProduct, type: 'categoryProduct' }));

            setSearchResults([...productResults, ...businessResults, ...eventResults, ...cayegoryProductResults]);
        } else {
            setSearchResults([]);
        }
        console.log(searchResults)
    }

    return (
        <Box sx={{ width: '90vw', height: '90vh', background: 'white', borderRadius: '10px' }}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={buscar}></SearchBar>
            {searchResults.map((result, index) => (
                <ListItem key={index}>
                  {result.type === 'product' && <FastfoodIcon />}
                  {result.type === 'business' && <StoreIcon />}
                  {result.type === 'event' && <EventIcon />}
                  {result.type === 'categoryProduct' && <PostAddIcon />}
                  <ListItemText primary={result.type === 'categoryProduct' ? result.nameProduct : result.name} />
                  <Typography variant="body2" color="text.secondary">
                    {result.type === 'product' ? `Producto de ${result.owner}` :
                      result.type === 'business' ? `Negocio de ${result.nameCategory}` :
                        result.type === 'event' ? `Evento de ${result.owner}` :
                          result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </Typography>
                </ListItem>
              ))}
        </Box>
    )
}

export default ModalSearch;
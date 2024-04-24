import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '../../../AppContext'; // Asegúrate de que la ruta sea correcta
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, Button } from '@mui/material';
import SearchBar from '../../utils/SearchBar'; // Asegúrate de que la ruta sea correcta
// import ProvinceSelected from '../../utils/ProvinceSelected'; // Asegúrate de que la ruta sea correcta
import { supabase } from '../../../services/client';
import ProductCard from '../../cards/Products';
import BusinessCard from '../../cards/Business';
import Category from '../../adminPanel/catalogo/Category';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Slider from "react-slick";
import { TroubleshootRounded } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import PostAddIcon from '@mui/icons-material/PostAdd';
import StoreIcon from '@mui/icons-material/Store';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



const HomeComp = () => {
  const { userEmail, userId, products, businesses, cayegoryProducts, isAllDataLoaded, cart, users, categoryBusiness, events, posts } = useContext(AppContext);
  const [selectedProvince, setSelectedProvince] = useState('Todas las provincias');

  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSliderSettings = (slidesToShow, slidesToShow6, slidesToShow48) => ({
    dots: TroubleshootRounded,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: slidesToShow,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: slidesToShow6,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: slidesToShow48,
          slidesToScroll: 1
        }
      }
    ]
  });


  useEffect(() => {
    if (isAllDataLoaded) {
      console.log(userEmail)
      console.log(userId)
      console.log(products)
      console.log(businesses)
      console.log(cayegoryProducts)
    }

  }, [isAllDataLoaded]);

  const addToCart = async (productId) => {
    // Buscar el producto en el carrito de la base de datos
    let { data: cartItem, error } = await supabase
      .from('cart')
      .select('*')
      .eq('productId', productId)
      .maybeSingle();

    if (error) {
      console.log('Error buscando producto en el carrito:', error);
      return;
    }

    if (cartItem) {
      // Si el producto existe en el carrito, incrementar la cantidad
      const { data: updatedCartItem, error: updateError } = await supabase
        .from('cart')
        .update({ quantity: Number(cartItem.quantity) + 1 })
        .eq('id', cartItem.id);

      if (updateError) {
        console.log('Error actualizando producto en el carrito:', updateError);
      }
    } else {
      // Si el producto no existe en el carrito, crear una nueva entrada
      const { data: newCartItem, error: insertError } = await supabase
        .from('cart')
        .insert([{ productId: productId, userId: userId, quantity: 1 }]);

      if (insertError) {
        console.log('Error insertando producto en el carrito:', insertError);
      }
    }
  }


  // todo
  const handleSearch = (searchTerm) => {
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

      const cayegoryProductResults = cayegoryProducts.filter(cayegoryProduct =>
        cayegoryProduct.nameProduct.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(cayegoryProduct => ({ ...cayegoryProduct, type: 'categoryProduct' }));

      setSearchResults([...productResults, ...businessResults, ...eventResults, ...cayegoryProductResults]);
    } else {
      setSearchResults([]);
    }
  };

  // const handleProvinceChange = (event) => {
  //   setSelectedProvince(event.target.value);
  //   // Aquí puedes manejar la lógica cuando la provincia seleccionada cambia
  // };
  if (!isAllDataLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '15px', display: 'flex', gap: '15px', flexDirection: 'column', width: '100vw' }}>
      <Box display="flex" justifyContent="space-between" flexDirection={'column'}>
        {/* <ProvinceSelected value={selectedProvince} onChange={handleProvinceChange} /> */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
        {
          searchResults.length > 0 ? (
            <List
              sx={{
                position: 'absolute',
                top: '70px',
                width: '98%',
                maxHeight: '200px',
                overflowY: 'auto',
                bgcolor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                zIndex: 1000,
              }}
            >
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
            </List>
          ) : searchTerm !== '' && (
            <div style={{
              position: 'absolute',
              top: '70px',
              width: '98%',
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              boxSizing: 'border-box',
            }}>
              No hay ninguna coincidencia para {searchTerm} 😞
            </div>
          )
        }
      </Box>

      <Typography variant="h5">Categorias</Typography>
      <Slider {...getSliderSettings(6, 6, 4)}>
        {cayegoryProducts.map((category) => (
          <div key={category.id}>
            <Category categoryName={category.nameProduct} />
          </div>
        ))}
        <Button endIcon={<ArrowForwardIosIcon />} onClick={() => {/* Aquí puedes manejar el redireccionamiento */ }}>
          Ver más
        </Button>
      </Slider>

      <Typography variant="h5">Destacados</Typography>
      <Box sx={{ maxWidth: '100%' }}>
        <Slider {...getSliderSettings(5, 2.1, 1.3)}>
          {products.map((product) => (
            <Box m={2} key={product.id}>
              <ProductCard product={product} addToCart={addToCart} />
            </Box>
          ))}
          <Button endIcon={<ArrowForwardIosIcon />} onClick={() => { }}>
            Ver más
          </Button>
        </Slider>
      </Box>

      <Typography variant="h5">Bazar</Typography>
      <Box sx={{ maxWidth: '100%' }}>
        <Slider {...getSliderSettings(3, 1.3, 2.4)}>
          {businesses.map((business) => (
            <Box m={2} key={business.id}>
              <BusinessCard business={business} />
            </Box>
          ))}
          <Button endIcon={<ArrowForwardIosIcon />} onClick={() => {/* Aquí puedes manejar el redireccionamiento */ }}>
            Ver más
          </Button>
        </Slider>

      </Box>
    </Box>
  );
};

export default HomeComp;
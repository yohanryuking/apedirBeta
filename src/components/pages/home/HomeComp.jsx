import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '../../../AppContext'; // Asegúrate de que la ruta sea correcta
import { Box, Typography, CircularProgress } from '@mui/material';
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


const HomeComp = () => {
  const { userEmail, userId, products, businesses, cayegoryProducts, isAllDataLoaded,cart,users,categoryBusiness,events,posts } = useContext(AppContext);
  const [selectedProvince, setSelectedProvince] = useState('Todas las provincias');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSliderSettings = (slidesToShow,slidesToShow6,slidesToShow48) => ({
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


  const handleSearch = (searchTerm) => {
    // Aquí puedes manejar la lógica de búsqueda
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
        <SearchBar onSearch={handleSearch} />
      </Box>

      <Typography variant="h5" >Categorias</Typography>
      <Slider {...getSliderSettings(6,6,4)}>
        {cayegoryProducts.map((category) => (
          <div key={category.id}>
            <Category categoryName={category.nameProduct} />
          </div>
        ))}
      </Slider>

      <Typography variant="h5">Recomendados</Typography>
      <Box sx={{ maxWidth: '100%' }}>
        <Slider {...getSliderSettings(5,2.1,1.3)}>
          {products.map((product) => (
            <Box m={2} key={product.id}>
              <ProductCard product={product} addToCart={addToCart} />
            </Box>
          ))}
        </Slider>
      </Box>

      <Typography variant="h5">Negocios</Typography>
      <Box sx={{ maxWidth: '100%' }}>
        <Slider {...getSliderSettings(3,1.3,1)}>
          {businesses.map((business) => (
            <Box m={2} key={business.id}>
              <BusinessCard business={business} />
            </Box>
          ))}
        </Slider>

      </Box>
    </Box>
  );
};

export default HomeComp;
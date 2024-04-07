import { PieChart } from 'react-minimal-pie-chart';
import { Box, Typography, IconButton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos del carrusel


const StatBox = ({ title, value, icon, color, deno }) => (
  <Box sx={{ borderRadius: '20px', padding: '5px', margin: '10px', maxWidth: '300px', background:'#555', color:'white'}}>
    <Box>
      <Typography variant="h6">{value} {deno}</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <IconButton sx={{ color:color }}>{icon}</IconButton>
      <Typography variant="body1">{title}</Typography>
    </Box>
  </Box>
);

const BusinessDetails = ({ business }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const ventas = 1000;
  const visitas = 500;
  const suscriptores = 200;
  const categorias = [
    { title: 'Categoria 1', value: 10 },
    { title: 'Categoria 2', value: 15 },
    { title: 'Categoria 3', value: 50 },
    { title: 'Categoria 4', value: 10 },
    { title: 'Categoria 5', value: 20 },
    { title: 'Categoria 6', value: 20 },
    { title: 'Categoria 7', value: 20 },
    // Agrega más categorías según sea necesario
  ];

  // Función para generar un color en el modelo HSL
  const getColor = (index, total) => {
    const hue = (360 * index) / total;
    return `hsl(${hue}, 80%, 40%)`;
  };

  // Agrega un color a cada categoría
  const categoriasConColor = categorias.map((categoria, index) => ({
    ...categoria,
    color: getColor(index, categorias.length),
  }));

  return (
    <Box>
      <Typography variant="h5">Bienvenido {business ? business.name : ''}</Typography>
      <Typography variant="body1">Todo el tiempo</Typography>
      <Carousel showThumbs={false} centerMode centerSlidePercentage={isMobile ? 80 : 50} dynamicHeight={false} emulateTouch infiniteLoop showArrows={false} showStatus={false} showIndicators={false}>
        <div>
          <StatBox title="Ventas" value={ventas} icon={<AccountBalanceWalletIcon />} color={'purple'} deno={'cup'}/>
        </div>
        <div>
          <StatBox title="Visitas" value={visitas} icon={<VisibilityIcon />} color={'green'}/>
        </div>
        <div>
          <StatBox title="Suscriptores" value={suscriptores} icon={<PersonIcon />} color={'blue'}/>
        </div>
      </Carousel>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{background:'#555', margin:'20px', borderRadius:'30px', padding:'20px'}}>
        <Box style={{ height: '300px' }}>
          <PieChart
            data={categoriasConColor}
            radius={30}
            lineWidth={15}
            segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
            animate
            lengthAngle={-360} // Define el ángulo total del gráfico de pastel
            startAngle={0} // Define el ángulo de inicio del gráfico de pastel
            segmentsShift={1} // Separa los segmentos del gráfico de pastel
          />
        </Box>
        <Box>
          {categoriasConColor.map((categoria, index) => (
            <Typography key={index} style={{ color: categoria.color }}>
              {categoria.title + ': ' + categoria.value}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessDetails;
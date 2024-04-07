import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ResponsivePie } from '@nivo/pie';

const BusinessDetails = ({ business }) => {
  const ventas = 1000;
  const visitas = 500;
  const suscriptores = 200;
  const categorias = [
    { id: 'Categoria 1', value: 10, color: '#E38627' },
    { id: 'Categoria 2', value: 15, color: '#C13C37' },
    { id: 'Categoria 3', value: 50, color: '#6A2135' },
  ];

  return (
    <Box>
      <Typography variant="h1">{business ? business.name : 'jkgkjgkj'}</Typography>
      <Typography variant="body1">Ventas: {ventas}</Typography>
      <Typography variant="body1">Visitas: {visitas}</Typography>
      <Typography variant="body1">Suscriptores: {suscriptores}</Typography>
      <div style={{ height: '500px' }}>
        <ResponsivePie
          data={categorias}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        />
      </div>
    </Box>
  );
};

export default BusinessDetails;
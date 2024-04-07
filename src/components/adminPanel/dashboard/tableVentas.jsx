import { useState, useEffect } from 'react';
import { supabase } from '../../../services/client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import QRCode from 'qrcode.react';
import { Business } from '@mui/icons-material';

const TablaVentas = () => {
    const [userId, setUserId] = useState();
    const [business, setBusiness] = useState();
    const [name, setName] = useState();
    const [ventas, setVentas] = useState();
    const confirmed = true;

    const [id, setId] = useState();
    const [fecha, seFecha] = useState();
    const [cliente, setCliente] = useState();
    const [producto, setProducto] = useState();
    const [monto, setMonto] = useState();
    const [pagado, setPagado] = useState();
    const [esDelivery, setEsDelivery] = useState();
    const [otra, setOtra] = useState(0);

    useEffect(() => {
        const getSession = async () => {
            const user = await supabase.auth.getUser();
            if (user) {
                setUserId(user.data.user.id);
            }
        }
        getSession();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                const { data, error } = await supabase
                    .from('users')
                    .select('email').eq('id', userId)
                if (error) {
                    console.error(error);
                } else {
                    console.log(data[0].email);
                    setName(data[0].email);
                }
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchUser = async () => {
            console.log(name);
            if (name) {
                const { data, error } = await supabase
                    .from('business')
                    .select('name').eq('owner', name)
                if (error) {
                    console.error(error);
                } else {
                    console.log(data[0].name);
                    setBusiness(data[0].name);
                }
            }
        };
        fetchUser();
    }, [name]);

    useEffect(() => {
        const fetchUser = async () => {
            if (business) {
                const { data, error } = await supabase
                    .from('ventas')
                    .select('*').eq('owner', business)
                if (error) {
                    console.error(error);
                } else {
                    console.log(data[0]);
                    setVentas(data);
                }
            }
        };
        fetchUser();
    }, [business, otra]);

    //funcion para actualizar el delivery

    const setPayed = async (n) => {
        console.log(n);
        const { data, error } = await supabase.from('ventas').update({ confirmed }).eq('id', n);
        if (error) {
            console.error('Error updating user profile:', error.message);
        } else {
            console.log('User profile updated successfully:', data);
            // window.location.reload();
            setOtra(otra + 1);
            console.log(otra);

        }
    }

    function convertirFecha(fecha) {
        // Crear un objeto Date a partir de la cadena de fecha y hora
        const fechaObj = new Date(fecha);
        console.log(fecha)
      
        // Extraer el día, mes y año
        const dia = fechaObj.getDate().toString().padStart(2, '0');
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan en 0
        const ano = fechaObj.getFullYear();
      
        // Devolver la fecha en el formato deseado
        return `${dia}/${mes}/${ano}`;
      }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Orden</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Vendedor</TableCell>
                        <TableCell>Monto</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Confirmar Pago</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ventas ? ventas.map((venta, index) => (
                        <TableRow
                            key={venta.id}
                            sx={{ backgroundColor: '#252525' }}
                        >
                            <TableCell component="th" scope="row" sx={{ color: '#fff' }}>
                                {venta.id}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>{venta.client}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{convertirFecha(venta.timestamp)}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{venta.owner}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{venta.amount} cup</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{venta.confirmed ? 'pagada' : 'pendiente'}</TableCell>
                            <TableCell>
                                <Button onClick={() => { setPayed(venta.id) }}>confirmar pago</Button>
                            </TableCell>
                        </TableRow>
                    )) : <TableRow><TableCell colSpan={6}>No hay ventas</TableCell></TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default TablaVentas;
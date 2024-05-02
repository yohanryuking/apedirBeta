import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PerfilNegocio = () => {
  const { nombre } = useParams();
  const [negocio, setNegocio] = useState(null);

  useEffect(() => {
   
  }, [nombre]);

  return (
    <div>
      {/* Aquí puedes renderizar los detalles del negocio */}
      {/* Por ejemplo: */}
      {negocio && (
        <div>
          <h1>{negocio.nombre}</h1>
          <p>{negocio.descripcion}</p>
          {/* {/* Otros detalles del negocio */}
        </div>
      )}
    </div>
  );
};

export default PerfilNegocio;
// src/components/adminPanel/negocio/BusinessMap.jsx
import React, { useState } from 'react';
// import ReactMapGL from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

const BusinessMap = ({ initialPosition, onPositionChange }) => {
    const [viewport, setViewport] = useState({
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 14
    });

    return (
        // <ReactMapGL
        //     {...viewport}
        //     width="100%"
        //     height="100%"
        //     onViewportChange={(nextViewport) => setViewport(nextViewport)}
        //     mapStyle="mapbox://styles/mapbox/streets-v11"
        //     mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        // />
        <>
        </>
    );
}

export default BusinessMap;
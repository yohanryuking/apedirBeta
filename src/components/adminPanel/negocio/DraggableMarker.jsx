import { useMemo, useRef } from "react";
import { Marker } from 'react-leaflet';

const DraggableMarker = ({ initialPosition, onDragEnd }) => {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            moveend: () => {
                const marker = markerRef.current;
                if (marker != null) {
                    onDragEnd(marker.getLatLng());
                }
            },
        }),
        [onDragEnd]
    );

    return <Marker draggable={true} eventHandlers={eventHandlers} position={initialPosition} ref={markerRef} />;
};

export default DraggableMarker;
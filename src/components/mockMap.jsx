// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
// import { Box, Grid } from '@mui/material';
// import { GOOGLE_API_KEY } from '../../config';

// export const MyMapComponent = () => {
//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: GOOGLE_API_KEY,
//         libraries: ['places'],
//     });

//     const mapContainerStyle = { width: '100%', height: '100%' };
//     const mapOptions = {
//         disableDefaultUI: true,
//         zoomControl: true,
//         mapTypeControl: false,
//         scaleControl: false,
//         streetViewControl: false,
//         rotateControl: false,
//         fullscreenControl: false,
//     };

//     return (
//         <Grid item xs={12} md={8} sx={{ position: 'relative', padding: '16px' }}> {/* Adding padding */}
//             <Box
//                 sx={{
//                     height: '400px', // Fixed height, adjust as needed
//                     width: '100%',
//                     position: 'relative',
//                     borderRadius: '16px', // Adding border radius to the outer box
//                     overflow: 'hidden', // Ensures the map doesn't overflow the rounded corners
//                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Optional: adds a subtle shadow
//                 }}
//             >
//                 {isLoaded ?
//                     (

//                         <GoogleMap
//                             center={{ lat: 37.7749, lng: -122.4194 }}  // Use a fixed location for testing
//                             zoom={15}
//                             mapContainerStyle={mapContainerStyle}
//                             options={mapOptions}
//                         >
//                             <Marker
//                                 position={{
//                                     lat: 37.7749,
//                                     lng: -122.4194,
//                                 }}
//                                 draggable
//                                 onDragEnd={(e) => onMarkerDragEnd(e, "pickup")}
//                             />
//                         </GoogleMap>
//                     ) : (
//                         <div>Loading...</div>
//                     )}
//             </Box>
//         </Grid>)
// };
import React, { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '../../config';

export const MyMapComponent = () => {
    const mapContainerStyle = { width: '100%', height: '400px' };
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
    };

    // Reference for the map instance
    const mapRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries: ['places'],
    });

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            const map = mapRef.current; // Get the map instance

            // Create a marker
            const marker = new google.maps.Marker({
                position: { lat: 37.7749, lng: -122.4194 }, // Marker position
                map: map, // Add marker to the map// Custom icon
                draggable: true,
            });

            // You can also add event listeners to the marker
            marker.addListener('dragend', (e) => {
                console.log('Marker new position:', e.latLng.lat(), e.latLng.lng());
            });
        }
    }, [c]);

    return isLoaded ? (
        <GoogleMap
            center={{ lat: 37.7749, lng: -122.4194 }}  // Map center position
            zoom={15}
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
            onLoad={(map) => (mapRef.current = map)} // Capture the map instance
        />
    ) : (
        <div>Loading...</div>
    );
};


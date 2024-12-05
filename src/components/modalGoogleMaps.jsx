import { ArrowBackIosNew, Close, MyLocation, SearchOutlined } from '@mui/icons-material';
import { Button, FormControl, TextField, Typography, InputAdornment, IconButton, InputLabel, Divider, Snackbar, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';

import "../styles/modalSheetStyle.css";
import { auth, provider } from '../firebase';

import SimpleSnackbar from './snackBar';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { GOOGLE_API_KEY } from '../../config';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

Modal.setAppElement('#root'); // Necessary for accessibility

export default function ModalSheetGoogleLocation({ setOpenSnackbar, setSnackbarMsg, setSnackbarVariant, googleMapOpen, setGoogleMapOpen }) {

  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  })

  // Spring animation for the sheet
  const springProps = useSpring({
    opacity: googleMapOpen ? 1 : 0,
    transform: googleMapOpen ? 'translateY(0%)' : 'translateY(100%)',
    config: { tension: 300, friction: 30 },
  });

  // Toggle body overflow on modal open/close
  useEffect(() => {
    document.body.style.overflow = googleMapOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [googleMapOpen]);
  useEffect(() => {
    console.log("user map location", userLocation);

  }, [userLocation]);

  const handleClose = () => {
    setGoogleMapOpen(false);
  }



  // const { isLoaded } = useJsApiLoader({
  //     googleMapsApiKey: GOOGLE_API_KEY,
  //     libraries: ['places'],
  //   });

  //   const onMarkerDragEnd = useCallback(
  //     (e,location) => {
  //       const newCoordinates = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  //       handleSelectLocation(newCoordinates,location);
  //     },
  //     [handleSelectLocation]
  //   );
  //   const mapContainerStyle = { width: '100%', height: '100%' };


  //   // Define map options
  // const mapOptions = {
  //   disableDefaultUI: true, // This disables all default controls
  //   zoomControl: false,
  //   mapTypeControl: false,
  //   scaleControl: false,
  //   streetViewControl: false,
  //   rotateControl: false,
  //   fullscreenControl: false
  // };
  //   const renderActions = (
  //     <Grid item xs={12} md={8} sx={{ position: 'relative', padding: '16px' }}> {/* Adding padding */}
  //     <Box 
  //       sx={{ 
  //         height: '400px', // Fixed height, adjust as needed
  //         width: '100%', 
  //         position: 'relative',
  //         borderRadius: '16px', // Adding border radius to the outer box
  //         overflow: 'hidden', // Ensures the map doesn't overflow the rounded corners
  //         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Optional: adds a subtle shadow
  //       }}
  //     >
  //       {isLoaded ? (
  //         <GoogleMap
  //           center={{
  //             lat: coordinates.lat,
  //             lng: coordinates.lng,
  //           }}
  //           zoom={15}
  //           mapContainerStyle={mapContainerStyle}
  //           options={mapOptions}
  //         >
  //           <Marker
  //             position={{
  //               lat: coordinates.lat,
  //               lng: coordinates.lng,
  //             }}
  //             draggable
  //             onDragEnd={(e)=>onMarkerDragEnd(e,"pickup")}
  //           />
  //         </GoogleMap>
  //       ) : (
  //         <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
  //       )}
  //     </Box>
  //   </Grid>
  //   );


  return (
    <Modal
      isOpen={googleMapOpen}
      onRequestClose={() => setGoogleMapOpen(false)}
      shouldCloseOnOverlayClick={false}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: { padding: 0, border: 'none', borderRadius: '12px 12px 0px 0px', bottom: 0, top: 'auto', left: 0, right: 0 },
      }}
    >
      <animated.div style={springProps} className="modal-sheet">
        <div style={{ padding: '20px 10px', height: "600px" }}>
          <div className='itemDetail' style={{ flexDirection: "column", alignItems: "center" }}>
            <div className='itemDescription' style={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontSize: "18px" }}>
                Select a Delivery Address
              </Typography>
            </div>

            <ArrowBackIosNew style={{ position: "absolute", left: "10px" }} fontSize='small' color="disabled" onClick={handleClose} />
          </div>

          <GooglePlacesAutocomplete
            selectProps={{
              userLocation,
              onChange: setUserLocation,
            }}
            autocompletionRequest={{
              componentRestrictions: {
                country: ['in'],
              }
            }}
          />

        </div>
      </animated.div>

    </Modal>
  );
}

import { Close, MyLocation, SearchOutlined } from '@mui/icons-material';
import { Button, FormControl, TextField, Typography, InputAdornment, IconButton, InputLabel, Divider, Snackbar, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';

import "../styles/modalSheetStyle.css";
import "../styles/ModalSheetLocation.css";

import { GOOGLE_API_KEY } from '../../config';

import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { LoadingButton } from '@mui/lab';
import { useSnackBar } from '../context/snackBarContext';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { updateUserAddress } from '../api/user';

Modal.setAppElement('#root'); // Necessary for accessibility

export default function ModalSheetLocation({ setIslocationModalOpen }) {


    // Reference for the map instance
    const mapRef = useRef(null);

    const { setOpenSnackbar, setSnackbarMsg, setSnackbarVariant } = useSnackBar();
    const [loading, setLoading] = useState(false);
    const [isOpen, setOpen] = useState(true);

    const [currentCorrdinate, setCurrentCorrdinate] = useState({
        latitude: null,
        longitude: null,
    });
    const [userSearchLocation, setUserSearchLocation] = useState("");
    const [isGpsOpen, setIsGpsOpen] = useState(false);
    const [locationBtnDisabled, setLocationBtnDisabled] = useState(true);

    const { getLocation, setUser } = useUser();

    const authToken = localStorage.getItem('authToken');
    // Spring animation for the sheet
    const springProps = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
        config: { tension: 300, friction: 30 },
    });

    // Toggle body overflow on modal open/close
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        setOpen(false);
        if (setIslocationModalOpen)
            setIslocationModalOpen(false);
    }

    useEffect(() => {
        handleCurrentLatLng();
    }, []);

    // current Lat lng of the user

    const handleCurrentLatLng = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setCurrentCorrdinate({
                        latitude,
                        longitude
                    })
                    setLocationBtnDisabled(false);
                    setIsGpsOpen(true);
                    // Proceed with your logic here, such as updating the state or sending coordinates to your backend.
                },
                (error) => {
                    setIsGpsOpen(false);
                    console.error("Error fetching location:", error);
                    setOpenSnackbar(true);
                    setSnackbarMsg(error.message);
                    setSnackbarVariant("error");
                    // Optional: Show an error message or Snackbar
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };


    // Current Location of the user

    const handleUseCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async () => {
                    const { latitude, longitude } = currentCorrdinate;
                    console.log("Current location:", { latitude, longitude });
                    getLocation({ latitude, longitude });
                    localStorage.setItem("userLocation", JSON.stringify({ latitude, longitude }));

                    // Fetch place details using Google Maps Geocoding API
                    const apiKey = `${GOOGLE_API_KEY}`;
                    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                    try {
                        const response = await fetch(geocodeUrl);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.status === "OK") {
                                try {
                                    const placeName = data.results[0]?.formatted_address || "Unknown Location";
                                    const address = {
                                        place: placeName,
                                        coordinates: currentCorrdinate
                                    }
                                    const res = await updateUserAddress({ address }, authToken);
                                    if (!res.success) {
                                        throw Error(res.message);
                                    }
                                    setLoading(false);

                                    setUser((prev) => ({
                                        ...prev,
                                        userAddress: address,

                                    }))
                                    setOpen(false);
                                    if (setIslocationModalOpen) setIslocationModalOpen(false);
                                    setOpenSnackbar(true);
                                    setSnackbarMsg("Address Added");
                                    setSnackbarVariant("success");
                                } catch (error) {
                                    setOpenSnackbar(true);
                                    setSnackbarMsg(error.message);
                                    setSnackbarVariant("error");
                                }
                            } else {
                                console.error("Geocoding API error:", data.status);
                            }
                        } else {
                            console.error("Failed to fetch address from Geocoding API.");
                        }
                    } catch (error) {
                        console.error("Error fetching address:", error);
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    // Optional: Show an error message or Snackbar
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries: ['places'],
    });

    useEffect(() => {
        // Check if map is loaded and the mapRef is available
        if (isLoaded && mapRef.current) {
            const map = mapRef.current; // Get the map instance

            // Create a marker if it hasn't been created yet
            const marker = new google.maps.Marker({
                position: { lat: currentCorrdinate.latitude, lng: currentCorrdinate.longitude }, // Marker position
                map: map, // Add marker to the map
                draggable: true,
            });

            // Add event listener to the marker
            marker.addListener('dragend', (e) => {
                console.log('Marker new position:', e.latLng.lat(), e.latLng.lng());
                const newCoordinates = { latitude: e.latLng.lat(), longitude: e.latLng.lng() };
                setCurrentCorrdinate(newCoordinates);
            });

            // Clean up the marker if the effect is triggered again
            return () => {
                marker.setMap(null);
            };
        }
    }, [isLoaded, mapRef.current, currentCorrdinate]); // Add both dependencies to trigger when either changes


    const mapContainerStyle = { width: '80%', height: '80%' };

    // Define map options
    const mapOptions = {
        disableDefaultUI: true, // This disables all default controls
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    };

    const geocodeSelectedPlace = async (selectedPlace) => {
        try {
            console.log(selectedPlace)
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ placeId: selectedPlace.value.place_id }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results[0]);
                    } else {
                        reject(status);
                    }
                });
            });

            const { lat, lng } = result.geometry.location;
            setUserSearchLocation(selectedPlace);
            setLocationBtnDisabled(false);
            setCurrentCorrdinate({ latitude: lat(), longitude: lng() });

        } catch (error) {
            console.error('Error geocoding place:', error);
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setOpen(false)}
            shouldCloseOnOverlayClick={false}
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                content: { padding: 0, border: 'none', borderRadius: '12px 12px 0px 0px', bottom: 0, top: 'auto', left: 0, right: 0 },
            }}
        >
            <animated.div style={springProps} className="modal-sheet">
                <div style={{ padding: '20px 10px', height: "580px" }}>
                    <div className='itemDetail' style={{ flexDirection: "column", alignItems: "center" }}>
                        <div className='itemDescription' style={{ textAlign: "center" }}>
                            <Typography variant="h6" sx={{ fontSize: "18px" }}>
                                Select a Delivery Address
                            </Typography>
                        </div>
                        <Close style={{ position: "absolute", right: "10px" }} fontSize='small' color="disabled" onClick={handleClose} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", margin: "20px 0 10px 0" }}>
                        {/* <Button variant='outlined' onClick={handleOpenGoogleMap} sx={{ width: "100%", marginTop: "10px", p: 1.2, justifyContent: "space-around" }} startIcon={<SearchOutlined />}>
                            Search Area, Landmark or Location
                        </Button> */}
                        <GooglePlacesAutocomplete

                            selectProps={{
                                userSearchLocation,
                                onChange: (val) => geocodeSelectedPlace(val),
                                placeholder: 'Search Area, Landmark or Location',
                            }}
                            autocompletionRequest={{
                                componentRestrictions: {
                                    country: ['in'],
                                }
                            }}
                        />
                    </div>

                    <Divider>or</Divider>
                    <LoadingButton variant='outlined' onClick={handleCurrentLatLng} sx={{ width: "100%", marginTop: "10px", p: 1.2 }} startIcon={<MyLocation />}>
                        use current location
                    </LoadingButton>
                    <div className='mapContainer'>
                        {(isLoaded && isGpsOpen) ? (
                            <GoogleMap
                                center={{ lat: currentCorrdinate.latitude, lng: currentCorrdinate.longitude }}  // Map center position
                                zoom={15}
                                mapContainerStyle={mapContainerStyle}
                                options={mapOptions}
                                onLoad={(map) => (mapRef.current = map)} // Capture the map instance
                            />
                        ) : (
                            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
                        )}
                        {currentCorrdinate.latitude !== null && <LoadingButton loading={loading} variant='contained' disabled={locationBtnDisabled} onClick={handleUseCurrentLocation} >Confirm</LoadingButton>}

                    </div>

                </div>
            </animated.div>

        </Modal>
    );
}

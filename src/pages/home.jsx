import React, { useEffect, useState } from 'react';
import '../App.css';
import "../styles/home.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomeScreen from './homeScreen';
import CategoryScreen from './categoryScreen';
import ProductListScreen from './productListScreen';
import CartScreen from './cartScreen';
import UserProfileScreen from './userProfileScreen';
import NavBar from '../components/navBar';
import ModalSheetLogin from '../components/modalSheetLogin';
import { auth } from '../firebase';
import { useUser } from '../context/userContext';
import { getUser } from '../api/user';
import ModalSheetLocation from '../components/modalSheetLocation';
import { useSnackBar } from '../context/snackBarContext';
import SimpleSnackbar from '../components/snackBar';
import UserOrderScreen from './userOrderScreen';
import SearchScreen from './searchScreen';

function AppRoutes() {
    const location = useLocation();
    const hideNavBarOnCart = location.pathname === '/cart';
    const { user, login, logout, getLocation, userLocation, userLoggedIn } = useUser();
    const [userHasAddress, setUserHasAddress] = useState(() => {
        const hasAddress = localStorage.getItem("address added");
        if (hasAddress) {
            return JSON.parse(hasAddress);
        }
        return false;
    })
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const { openSnackbar, setOpenSnackbar, snackbarMsg, setSnackbarMsg, snackbarVariant, setSnackbarVariant } = useSnackBar();

    useEffect(() => {

        if (userLoggedIn) {
            const authToken = localStorage.getItem('authToken');

            if (authToken) {
                const getCurrUser = async () => {
                    try {

                        const res = await getUser(authToken);
                        if (!res.success) {

                            throw new Error(res.message || 'User session time out');

                        }
                        login({
                            userName: res?.data?.userName,
                            userPhoto: res?.data?.photoURL || "",
                            userUid: res?.data?._id,
                            userEmail: res?.data?.email || "",
                            userNumber: res?.data?.phoneNumber || "",
                            userAddress: {
                                place: res?.data?.address?.place || "",
                                coordinates: res?.data?.address?.coordinates || {
                                    lalatitude: null,
                                    longitude: null,
                                }
                            }
                        });



                    } catch (error) {

                        setOpenSnackbar(true);
                        setSnackbarMsg(error.message || "User session time out");
                        setSnackbarVariant("info");
                        logout();

                    }


                }

                getCurrUser();
            }
        } else {
            logout();
        }

        // if (authUser) {
        //     login({
        //         userName: authUser.displayName,
        //         userPhoto: authUser.photoURL,
        //         userUid: authUser.uid,
        //         userEmail: authUser.email || "",
        //         userNumber: authUser.phoneNumber
        //     });
        //     console.log("userLOGIN", authUser);

        // } else {
        //     logout();
        // }

    }, []);

    useEffect(() => {
        // Show login modal with a 2-second delay
        if (!userLoggedIn) {
            const loginTimeout = setTimeout(() => {
                setShowLoginModal(true);
            }, 6000);
            return () => clearTimeout(loginTimeout); // Cleanup the timeout on unmount
        }
        const hasAddress = localStorage.getItem("address added");
        if (hasAddress) {
            setUserHasAddress(JSON.parse(hasAddress));
        }

    }, [userLoggedIn]);

    useEffect(() => {
        // Show location modal with a 2-second delay after user login
        if (userLoggedIn && !userHasAddress) {
            const locationTimeout = setTimeout(() => {
                setShowLocationModal(true);
            }, 2000);
            return () => clearTimeout(locationTimeout); // Cleanup the timeout on unmount
        }
    }, [userLoggedIn, userHasAddress]);



    return (
        <>
            {!hideNavBarOnCart && <NavBar />}
            {showLoginModal && <ModalSheetLogin setOpenSnackbar={setOpenSnackbar} setSnackbarMsg={setSnackbarMsg} setSnackbarVariant={setSnackbarVariant} />}
            {showLocationModal && <ModalSheetLocation />}
            {
                <SimpleSnackbar
                    openSnackbar={openSnackbar}
                    setOpenSnackbar={setOpenSnackbar}
                    message={snackbarMsg}
                    variant={snackbarVariant}
                />
            }
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/category" element={<CategoryScreen />} />
                <Route path="/category/:categoryTitle" element={<ProductListScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/user" element={<UserProfileScreen />} />
                <Route path="/user/myOrder" element={<UserOrderScreen />} />
                <Route path="/s" element={<SearchScreen />} />
            </Routes>
        </>
    );
}

export default function Home() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

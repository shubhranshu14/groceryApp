import React, { useEffect } from 'react';
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

function AppRoutes() {
    const location = useLocation();
    const hideNavBarOnCart = location.pathname === '/cart';
    const { user, login, logout } = useUser();
    const userLoggedIn = JSON.parse(localStorage.getItem("userLogedIn"));

    console.log("user now", userLoggedIn);

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                login({
                    userName: authUser.displayName,
                    userPhoto: authUser.photoURL,
                    userUid: authUser.uid,
                    userEmail: authUser.email || "",
                    userNumber: authUser.phoneNumber
                });
                console.log("userLOGIN", authUser);

            } else {
                logout();
            }
        })
    }, []);

    return (
        <>
            {!hideNavBarOnCart && <NavBar />}
            {(!user && !userLoggedIn) && <ModalSheetLogin />}
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/category" element={<CategoryScreen />} />
                <Route path="/category/:categoryTitle" element={<ProductListScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/user" element={<UserProfileScreen />} />
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

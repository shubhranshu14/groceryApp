import React, { createContext, useContext, useState } from "react";
import { useCart } from "../context/cartContext";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(() => {
        const loginStatus = localStorage.getItem('userLogedIn');
        if (loginStatus) return JSON.parse(loginStatus);
        return false;
    });
    const { setCart } = useCart();
    const [user, setUser] = useState({
        userName: '',
        userPhoto: '',
        userUid: '',
        userEmail: '',
        userNumber: '',
        userAddress: {
            place: '',
            coordinates: {
                latitude: null,
                longitude: null
            }
        }

    });

    const [userLocation, setUserLocation] = useState(() => {
        const location = localStorage.getItem("userLocation");
        if (location) {
            return JSON.parse(location);
        }
        return null;
    });
    const [userAddress, setUserAddress] = useState(() => {
        const address = localStorage.getItem("userAddress");
        if (address) return address;
        return '';
    })

    const login = (userData) => {
        localStorage.setItem("userLogedIn", true);
        setUserLoggedIn(true);
        setUser((prev) => ({
            ...prev,
            ...userData
        }))
    };

    const logout = () => {
        localStorage.setItem("userLogedIn", false);
        setUserLoggedIn(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userAddress");
        localStorage.removeItem("userLocation");
        localStorage.setItem("cart", JSON.stringify([]));
        setCart([]);
        setUserAddress('');
        setUser({
            userName: '',
            userPhoto: '',
            userUid: '',
            userEmail: '',
            userNumber: '',
            userAddress: {
                place: '',
                coordinates: {
                    latitude: null,
                    longitude: null
                }
            }

        });
    };

    const getLocation = (userLocation) => {
        setUserLocation(userLocation);
    }

    const saveUserAddress = (address) => {
        setUserAddress(address);
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, userLocation, getLocation, userAddress, saveUserAddress, userLoggedIn }}>
            {children}
        </UserContext.Provider>
    )
}
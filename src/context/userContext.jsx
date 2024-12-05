import React, { createContext, useContext, useState } from "react";
import { useCart } from "../context/cartContext";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { setCart } = useCart();
    const [user, setUser] = useState(null);
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
        setUser(userData);
    };

    const logout = () => {
        localStorage.setItem("userLogedIn", false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userAddress");
        localStorage.removeItem("userLocation");
        localStorage.setItem("cart", JSON.stringify([]));
        setCart([]);
        setUserAddress('');
        setUser(null);
    };

    const getLocation = (userLocation) => {
        setUserLocation(userLocation);
    }

    const saveUserAddress = (address) => {
        setUserAddress(address);
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, userLocation, getLocation, userAddress, saveUserAddress }}>
            {children}
        </UserContext.Provider>
    )
}
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        console.log("afterlogin", userData);

        localStorage.setItem("userLogedIn", true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.setItem("userLogedIn", false);
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
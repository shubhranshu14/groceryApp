import React, { useState, createContext, useContext } from "react";

const SnackBarContext = createContext();

export const useSnackBar = () => useContext(SnackBarContext);

export const SnackbarProvider = ({ children }) => {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState("");

    return (
        <SnackBarContext.Provider value={{ openSnackbar, setOpenSnackbar, snackbarMsg, setSnackbarMsg, snackbarVariant, setSnackbarVariant }}>
            {children}
        </SnackBarContext.Provider>
    )
}
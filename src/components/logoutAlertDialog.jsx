import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useUser } from '../context/userContext';
import { useCart } from '../context/cartContext';

export default function LogoutAlertDialog({ open, setOpen, setOpenSnackbar, setSnackbarMsg, setSnackbarVariant }) {

    const { logout } = useUser();
    const { setCart } = useCart();
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogOut = () => {
        signOut(auth)
            .then(() => {
                setOpenSnackbar(true);
                setSnackbarMsg("You're now logged out. Take care!");
                setSnackbarVariant("info");
                localStorage.setItem("cart", JSON.stringify([]));
                setCart([]);
                setOpen(false);
                logout();
                console.log("user after logout", user);
            })
            .catch((error) => {
                console.error("error while logging Out", error);
            })
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Leaving So Soon?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your cart has items. Logging out will clear your cart. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancle</Button>
                    <Button onClick={handleLogOut} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
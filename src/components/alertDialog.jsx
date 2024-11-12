import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ open, setOpen, itemName, decreaseQuantity }) {


    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveItem = () => {
        decreaseQuantity();
        setOpen(false);
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
                    {"Remove item from Cart"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove <span style={{ color: "#525252", fontWeight: 600 }}>{itemName}</span> from your cart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancle</Button>
                    <Button onClick={handleRemoveItem} autoFocus>
                        Remove Item
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
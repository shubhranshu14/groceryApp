import { Close, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, TextField, Typography, InputAdornment, IconButton, InputLabel, Divider, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';

import "../styles/modalSheetStyle.css";
import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { updateUserPhoneNumber, userLogin, userSignUp } from '../api/user';
import { useUser } from '../context/userContext';
import { useSnackBar } from '../context/snackBarContext';
import { LoadingButton } from '@mui/lab';

Modal.setAppElement('#root'); // Necessary for accessibility

export default function ModalSheetPhoneNo({ isPhoneModalOpen, setIsPhoneModalOpen }) {
    const authToken = localStorage.getItem('authToken');

    const { user, setUser } = useUser();

    const [loading, setLoading] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState(() => {
        if (user.userNumber) {
            return user.userNumber
        }
        return '';
    });
    const [error, setError] = useState(false);
    const { setOpenSnackbar, setSnackbarMsg, setSnackbarVariant } = useSnackBar();

    const isValidPhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

    // Spring animation for the sheet
    const springProps = useSpring({
        opacity: isPhoneModalOpen ? 1 : 0,
        transform: isPhoneModalOpen ? 'translateY(0%)' : 'translateY(100%)',
        config: { tension: 300, friction: 30 },
    });

    // Toggle body overflow on modal open/close
    useEffect(() => {
        document.body.style.overflow = isPhoneModalOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isPhoneModalOpen]);

    const handleClose = () => {

        setIsPhoneModalOpen(false);

    }


    const handleSubmitPhoneNumber = async () => {

        if (!phoneNumber) {
            setOpenSnackbar(true);
            setSnackbarMsg("Feilds should not be Empty!")
            setSnackbarVariant("error");
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setOpenSnackbar(true);
            setSnackbarMsg("Invalid phone number!");
            setSnackbarVariant("error");
            setError(true);
            return;
        }

        try {
            setLoading(true);
            const res = await updateUserPhoneNumber({ phoneNumber }, authToken);

            if (!res.success) {
                throw new Error(res.message || "failed to update number");
            }

            setUser((prev) => ({
                ...prev,
                userNumber: res.data.phoneNumber,

            }))
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMsg("Phone number updated")
            setSnackbarVariant("success");
            setIsPhoneModalOpen(false);

        } catch (error) {
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMsg(error.message)
            setSnackbarVariant("error");
            console.error(error);
        }
    };

    return (
        <Modal
            isOpen={isPhoneModalOpen}
            onRequestClose={() => setIsPhoneModalOpen(false)}
            shouldCloseOnOverlayClick={false}
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                content: { padding: 0, border: 'none', borderRadius: '12px 12px 0px 0px', bottom: 0, top: 'auto', left: 0, right: 0 },
            }}
        >
            <animated.div style={springProps} className="modal-sheet">
                <div style={{ padding: '20px 10px', height: "300px" }}>
                    <div className='itemDetail' style={{ flexDirection: "column", alignItems: "center" }}>
                        <div className='itemDescription' style={{ textAlign: "center" }}>


                            <Typography sx={{ fontSize: "18px" }} color="text.primary">
                                Update your mobile number
                            </Typography>
                        </div>
                        <Close style={{ position: "absolute", right: "10px" }} fontSize='small' color="disabled" onClick={handleClose} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", margin: "20px 0 10px 0" }}>

                        <FormControl sx={{ marginTop: "10px" }} variant="outlined">
                            <TextField
                                label={"User's name"}
                                id="outlined-email"
                                value={user.userName}
                                disabled
                            />
                        </FormControl>

                        <FormControl sx={{ marginTop: "10px" }} variant="outlined">
                            <TextField
                                label={error ? "Invalid number" : "User's mobile number"}
                                id="outlined-start-adornment"
                                type='number'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                    },
                                }}
                                error={error}
                            />
                        </FormControl>


                        <LoadingButton loading={loading} variant='contained' sx={{ height: "56px", marginTop: "10px" }} onClick={handleSubmitPhoneNumber}>Submit</LoadingButton>
                    </div>
                </div>
            </animated.div>

        </Modal>
    );
}

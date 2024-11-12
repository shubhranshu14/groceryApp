import { Close, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, TextField, Typography, InputAdornment, IconButton, InputLabel, Divider, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';

import "../styles/modalSheetStyle.css";
import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

import SimpleSnackbar from './snackBar';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Necessary for accessibility

export default function ModalSheetLogin({ setOpenSnackbar, setSnackbarMsg, setSnackbarVariant, closedFromProfile }) {

    const navigate = useNavigate();

    const [isOpen, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [userWantsLogIn, setUserWantsLogIn] = useState(true);
    const [userValue, setUserValue] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [error, setError] = useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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
        if (closedFromProfile) {
            navigate("/");
            localStorage.setItem("tabName", "home");
            localStorage.setItem("backToTab", "home");
        }
        setOpen(false);

    }


    const handleSubmitSignUp = () => {

        if (!userValue.name || !userValue.email || !userValue.password) {
            setOpenSnackbar(true);
            setSnackbarMsg("Feilds should not be Empty!")
            setSnackbarVariant("error");
            return;
        }


        createUserWithEmailAndPassword(auth, userValue.email, userValue.password)
            .then(async (res) => {
                setOpenSnackbar(true);
                setSnackbarMsg("Welcome! Your signup was successful.")
                setSnackbarVariant("success");
                const user = res.user;
                await updateProfile(user, { displayName: userValue.name });
                console.log("new one user", user);
            })
            .catch((err) => {
                setOpenSnackbar(true);
                setSnackbarMsg(err.message)
                setSnackbarVariant("error");
                console.error(err);

            });
    };

    const handleSubmtLogin = () => {

        if (!userValue.email || !userValue.password) {
            setOpenSnackbar(true);
            setSnackbarMsg("Feilds should not be Empty!")
            setSnackbarVariant("error");
            return;
        }


        signInWithEmailAndPassword(auth, userValue.email, userValue.password)
            .then(async (res) => {
                setOpenSnackbar(true);
                setSnackbarMsg("Welcome back! You're logged in.")
                setSnackbarVariant("success");
            })
            .catch((err) => {
                setOpenSnackbar(true);
                setSnackbarMsg(err.message)
                setSnackbarVariant("error");
                console.error(err);

            });
    };





    // signIn with Google
    const handleGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {



            })
            .catch((error) => {
                console.log("ERROR", error);
            });
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
                <div style={{ padding: '20px 10px', height: "460px" }}>
                    <div className='itemDetail' style={{ flexDirection: "column", alignItems: "center" }}>
                        <div className='itemDescription' style={{ textAlign: "center" }}>
                            <Typography variant="h6" sx={{ fontSize: "18px" }}>
                                <span onClick={() => setUserWantsLogIn(true)} style={{ fontWeight: userWantsLogIn ? "bold" : "normal", fontSize: userWantsLogIn ? "24px" : "16px" }}>LogIn</span> / <span onClick={() => setUserWantsLogIn(false)} style={{ fontWeight: !userWantsLogIn ? "bold" : "normal", fontSize: !userWantsLogIn ? "24px" : "14px" }}>SignUp</span>
                            </Typography>
                            <Typography sx={{ fontSize: "12px" }} color="text.secondary">
                                Get Started & grab best offers!
                            </Typography>
                        </div>
                        <Close style={{ position: "absolute", right: "10px" }} fontSize='small' color="disabled" onClick={handleClose} />
                    </div>
                    {
                        userWantsLogIn ? (
                            <div style={{ display: "flex", flexDirection: "column", margin: "20px 0 10px 0" }}>

                                <FormControl sx={{ marginTop: "10px" }} variant="outlined">
                                    <TextField
                                        label={error ? "Invalid email address" : "Email"}
                                        type='email'
                                        id="outlined-email"
                                        value={userValue.email}
                                        onChange={(e) => setUserValue((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))}
                                        error={error}
                                    />
                                </FormControl>

                                <FormControl sx={{ marginTop: "10px" }} variant="outlined">
                                    <TextField
                                        label="Password"
                                        id="outlined-adornment-password"
                                        value={userValue.password}
                                        onChange={(e) => setUserValue((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))}
                                        error={error}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        onMouseUp={handleMouseUpPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </FormControl>


                                <Button variant='contained' sx={{ height: "56px", marginTop: "10px" }} onClick={handleSubmtLogin}>LogIn</Button>
                            </div>

                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", margin: "20px 0 10px 0" }}>

                                <FormControl sx={{}} variant="outlined">
                                    <TextField
                                        label="Name"
                                        id="outlined-email"
                                        value={userValue.name}
                                        onChange={(e) => setUserValue((prev) => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        error={error}

                                    />
                                </FormControl>

                                <FormControl sx={{ marginTop: "10px" }} variant="outlined">
                                    <TextField
                                        label={error ? "Invalid email address" : "Email"}
                                        type='email'
                                        id="outlined-email"
                                        value={userValue.email}
                                        onChange={(e) => setUserValue((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))}
                                        error={error}
                                    />
                                </FormControl>

                                <FormControl sx={{ marginTop: "10px" }} variant="outlined">
                                    <TextField
                                        label="Password"
                                        id="outlined-adornment-password"
                                        value={userValue.password}
                                        onChange={(e) => setUserValue((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))}
                                        error={error}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        onMouseUp={handleMouseUpPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </FormControl>


                                <Button variant='contained' sx={{ height: "56px", marginTop: "10px" }} onClick={handleSubmitSignUp}>SignUp</Button>
                            </div>

                        )
                    }

                    <Divider>or</Divider>
                    <Button variant='outlined' sx={{ width: "100%", marginTop: "10px", p: 1.2, justifyContent: "space-around" }} onClick={handleGoogle} endIcon={<Google />}>
                        Continue With Google
                    </Button>
                </div>
            </animated.div>

        </Modal>
    );
}

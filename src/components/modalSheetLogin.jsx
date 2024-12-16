import { Close, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, TextField, Typography, InputAdornment, IconButton, InputLabel, Divider, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';

import "../styles/modalSheetStyle.css";
import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { userLogin, userSignUp } from '../api/user';
import { useUser } from '../context/userContext';
import { useSnackBar } from '../context/snackBarContext';
import { LoadingButton } from '@mui/lab';

Modal.setAppElement('#root'); // Necessary for accessibility

export default function ModalSheetLogin({ setIsLoginModalOpen, closedFromProfile }) {

    const navigate = useNavigate();
    const { login } = useUser();

    const [isOpen, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [userWantsLogIn, setUserWantsLogIn] = useState(true);
    const [userValue, setUserValue] = useState({
        userName: '',
        email: '',
        password: '',
    })
    const [error, setError] = useState(false);
    const { setOpenSnackbar, setSnackbarMsg, setSnackbarVariant } = useSnackBar();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);



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
        if (setIsLoginModalOpen) {
            setIsLoginModalOpen(false);
        }
        setOpen(false);

    }


    const handleSubmitSignUp = async () => {

        if (!userValue.userName || !userValue.email || !userValue.password) {
            setOpenSnackbar(true);
            setSnackbarMsg("Feilds should not be Empty!")
            setSnackbarVariant("error");
            return;
        }

        if (!isValidEmail(userValue.email)) {
            setOpenSnackbar(true);
            setSnackbarMsg("Invalid email format!");
            setSnackbarVariant("error");
            return;
        }

        if (!isValidPassword(userValue.password)) {
            setOpenSnackbar(true);
            setSnackbarMsg(
                "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
            );
            setSnackbarVariant("error");
            return;
        }

        try {
            setLoading(true);
            const res = await userSignUp(userValue);

            if (!res.success) {
                throw new Error(res.message || "Signup failed");
            }
            localStorage.setItem("authToken", res?.data?.token);
            login({
                userName: res?.data?.userName,
                userUid: res?.data?._id,
                userEmail: res?.data?.email,
                userAddress: res?.data?.address || {
                    place: '',
                    coordinates: {
                        latitude: null,
                        longitude: null
                    }
                }
            });
            setOpen(false);

        } catch (error) {
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMsg(error.message)
            setSnackbarVariant("error");
            console.error(error);
        }



    };

    const handleSubmtLogin = async () => {

        if (!userValue.email || !userValue.password) {
            setOpenSnackbar(true);
            setSnackbarMsg("Feilds should not be Empty!")
            setSnackbarVariant("error");
            return;
        }

        if (!isValidEmail(userValue.email)) {
            setOpenSnackbar(true);
            setSnackbarMsg("Invalid email format!");
            setSnackbarVariant("error");
            return;
        }

        const userData = {
            email: userValue.email,
            password: userValue.password
        }
        try {
            setLoading(true);
            const res = await userLogin(userData);
            if (!res.success) {
                throw new Error(res.message || "Login failed");
            }

            localStorage.setItem("authToken", res?.data?.token);
            login({
                userName: res?.data?.userName,
                userPhoto: res?.data?.photoURL || "",
                userUid: res?.data?._id,
                userEmail: res?.data?.email || "",
                userNumber: res?.data?.phoneNumber || "",
                userAddress: res?.data?.address || {
                    place: '',
                    coordinates: {
                        latitude: null,
                        longitude: null
                    }
                }
            });
            if (res?.data?.address) {
                localStorage.setItem("address added", true);
                console.log("123");

            }
            setOpenSnackbar(true);
            setSnackbarMsg("Welcome back! You're logged in.")
            setSnackbarVariant("success");
            setOpen(false);

        } catch (err) {
            setLoading(false);
            setOpenSnackbar(true);
            setSnackbarMsg(err.message)
            setSnackbarVariant("error");
            console.error(err);
        }
    };

    // const handleSubmitSignUp = () => {

    //     if (!userValue.userName || !userValue.email || !userValue.password) {
    //         setOpenSnackbar(true);
    //         setSnackbarMsg("Feilds should not be Empty!")
    //         setSnackbarVariant("error");
    //         return;
    //     }

    //     createUserWithEmailAndPassword(auth, userValue.email, userValue.password)
    //         .then(async (res) => {
    //             setOpenSnackbar(true);
    //             setSnackbarMsg("Welcome! Your signup was successful.")
    //             setSnackbarVariant("success");
    //             const user = res.user;
    //             await updateProfile(user, { displayName: userValue.userName });
    //             console.log("new one user", user);
    //         })
    //         .catch((err) => {
    //             setOpenSnackbar(true);
    //             setSnackbarMsg(err.message)
    //             setSnackbarVariant("error");
    //             console.error(err);

    //         });
    // };

    // const handleSubmtLogin = () => {

    //     if (!userValue.email || !userValue.password) {
    //         setOpenSnackbar(true);
    //         setSnackbarMsg("Feilds should not be Empty!")
    //         setSnackbarVariant("error");
    //         return;
    //     }


    //     signInWithEmailAndPassword(auth, userValue.email, userValue.password)
    //         .then(async (res) => {
    //             setOpenSnackbar(true);
    //             setSnackbarMsg("Welcome back! You're logged in.")
    //             setSnackbarVariant("success");
    //         })
    //         .catch((err) => {
    //             setOpenSnackbar(true);
    //             setSnackbarMsg(err.message)
    //             setSnackbarVariant("error");
    //             console.error(err);

    //         });
    // };






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
                <div style={{ padding: '20px 10px', height: "380px" }}>
                    <div className='itemDetail' style={{ flexDirection: "column", alignItems: "center" }}>
                        <div className='itemDescription' style={{ textAlign: "center" }}>
                            <Typography variant="h6" sx={{ fontSize: "18px" }}>
                                <span onClick={() => {
                                    setUserValue({
                                        userName: '',
                                        email: '',
                                        password: '',
                                    });
                                    setUserWantsLogIn(true)

                                }} style={{ fontWeight: userWantsLogIn ? "bold" : "normal", fontSize: userWantsLogIn ? "24px" : "16px" }}>LogIn</span> / <span onClick={() => {
                                    setUserValue({
                                        userName: '',
                                        email: '',
                                        password: '',
                                    });
                                    setUserWantsLogIn(false)

                                }} style={{ fontWeight: !userWantsLogIn ? "bold" : "normal", fontSize: !userWantsLogIn ? "24px" : "14px" }}>SignUp</span>
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


                                <LoadingButton loading={loading} variant='contained' sx={{ height: "56px", marginTop: "10px" }} onClick={handleSubmtLogin}>LogIn</LoadingButton>
                            </div>

                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", margin: "20px 0 10px 0" }}>

                                <FormControl sx={{}} variant="outlined">
                                    <TextField
                                        label="Name"
                                        id="outlined-email"
                                        value={userValue.userName}
                                        onChange={(e) => setUserValue((prev) => ({
                                            ...prev,
                                            userName: e.target.value
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


                                <LoadingButton loading={loading} variant='contained' sx={{ height: "56px", marginTop: "10px" }} onClick={handleSubmitSignUp}>SignUp</LoadingButton>
                            </div>

                        )
                    }

                    {/* <Divider>or</Divider>
                    <Button variant='outlined' sx={{ width: "100%", marginTop: "10px", p: 1.2, justifyContent: "space-around" }} onClick={handleGoogle} endIcon={<Google />}>
                        Continue With Google
                    </Button> */}
                </div>
            </animated.div>

        </Modal>
    );
}

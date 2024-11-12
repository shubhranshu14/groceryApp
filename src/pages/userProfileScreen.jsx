import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/cartStyle.css";
import "../styles/productListStyle.css";
import "../styles/profileStyle.css";

import ModalSheetLogin from "../components/modalSheetLogin";
import LogoutAlertDialog from "../components/logoutAlertDialog";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useCart } from "../context/cartContext";

import TopBar from "../components/topBar";
import { Avatar, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { History, LocationOnOutlined, LogoutOutlined } from "@mui/icons-material";
import SimpleSnackbar from "../components/snackBar";



function UserProfileScreen() {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { cart } = useCart();
    const userLoggIn = JSON.parse(localStorage.getItem("userLogedIn"));
    const [openLogoutAlert, setOpenLogoutAlert] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState("");

    const handleLogOut = () => {
        if (cart.length > 0) {
            setOpenLogoutAlert(true);
        } else {

            signOut(auth)
                .then(() => {
                    setOpenSnackbar(true);
                    setSnackbarMsg("You're now logged out. Take care!");
                    setSnackbarVariant("info");
                    logout();
                })
                .catch((error) => {
                    console.error("error while logging Out", error);
                })
        }

    }

    return (
        <div className="home" style={{ backgroundColor: userLoggIn ? "" : "red" }}>
            {
                userLoggIn ? (
                    <>
                        {/* Back button and cart items */}
                        <TopBar backNavigateTo="home" screenName="My Profile" />
                        <div className="userInfoContainer">
                            <Avatar src="/images/avatar.png" />
                            <div className="userInfo">
                                <h4>{user?.userName || "User"}</h4>
                                <h5>{user?.userEmail || "not provided"}</h5>

                            </div>
                        </div>
                        <div className="userOptions">
                            <div className="option">
                                <Button size="large" sx={{ color: "#464646" }} className="userOptionBtn" startIcon={<History />}>My Orders</Button>
                            </div>
                            <div className="option">
                                <Button size="large" sx={{ color: "#464646" }} startIcon={<LocationOnOutlined />}>My Address</Button>
                            </div>
                            <div className="option">
                                <Button size="large" sx={{ color: "#464646" }} onClick={handleLogOut} startIcon={<LogoutOutlined />}>Log out</Button>
                            </div>
                        </div>
                        <LogoutAlertDialog
                            open={openLogoutAlert}
                            setOpen={setOpenLogoutAlert}
                            setOpenSnackbar={setOpenSnackbar}
                            setSnackbarMsg={setSnackbarMsg}
                            setSnackbarVariant={setSnackbarVariant}
                        />

                    </>
                ) :
                    (
                        <>
                            {/* <div style={{ height: "50vh", backgroundColor: "red" }}> */}

                            {/* </div> */}
                            <ModalSheetLogin setOpenSnackbar={setOpenSnackbar} setSnackbarMsg={setSnackbarMsg} setSnackbarVariant={setSnackbarVariant} closedFromProfile={true} />
                        </>
                    )
            }

            <SimpleSnackbar
                openSnackbar={openSnackbar}
                setOpenSnackbar={setOpenSnackbar}
                message={snackbarMsg}
                variant={snackbarVariant}
            />

        </div >
    );
}

export default UserProfileScreen;

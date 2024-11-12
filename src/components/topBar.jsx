import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/cartStyle.css";
import "../styles/productListStyle.css";
import { LocalMall } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";

function TopBar({ screenName, backNavigateTo }) {
    const navigate = useNavigate();
    const { cart } = useCart();
    const backToTab = localStorage.getItem("backToTab");

    const [cartSize, setCartSize] = useState(() => cart.length);

    useEffect(() => {
        setCartSize(cart.length);
    }, [cart]);

    return (
        <div className="backAndCartContainer">
            <div id="back" onClick={() => {
                navigate(`/${backToTab === 'home' ? "" : backToTab}`)
                // localStorage.setItem("tabName", backNavigateTo);
            }}>
                <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontWeight: "bold" }}>BACK</h2>
            </div>
            <div id="item">
                <h4 style={{ fontWeight: "bold", fontSize: "20px" }}>{screenName}</h4>
            </div>
            <div id="listCart" onClick={() => navigate("/cart")}>
                <LocalMall sx={{ color: "#37AA25" }} />
                <h2 style={{ color: "#37AA25", fontFamily: "Bebas Neue, sans-serif", fontWeight: "bold" }}>{cartSize !== 0 && cartSize < 10 ? 0 : null}{cartSize}</h2>
            </div>
        </div>


    );
}

export default TopBar;

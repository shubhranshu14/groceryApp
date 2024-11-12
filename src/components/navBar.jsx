import { useEffect, useState } from "react";
import "../styles/home.css";
import { HomeOutlined, LocalMallOutlined, PersonOutline, WidgetsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();
    const [currTab, setCurrTab] = useState(() => {
        console.log("this is called");

        const tabSeleted = localStorage.getItem("tabName");
        if (tabSeleted)
            return tabSeleted;
        return "home"
    });



    const handleTabClick = (tabName) => {
        setCurrTab(tabName);

        if (tabName !== "cart") {
            localStorage.setItem("backToTab", tabName);
            localStorage.setItem("tabName", tabName);
        }


        if (tabName === "home")
            return navigate("/");
        navigate(`/${tabName}`);
    };
    console.log("curr tab from navbar", currTab);


    return (
        <div className="navBar flex js_bw al_ctr">
            <div onClick={() => handleTabClick("home")} className={`navItem ${currTab === "home" ? "navItemActive" : ""}`}>
                {currTab === "home" ? <h2 style={{ fontFamily: "Bebas Neue, sans-serif" }}>HOME</h2> : <HomeOutlined />}
            </div>
            <div onClick={() => handleTabClick("category")} className={`navItem ${currTab === "category" ? "navItemActive" : ""}`}>
                {currTab === "category" ? <h2 style={{ fontFamily: "Bebas Neue, sans-serif" }}>CATEGORIES</h2> : <WidgetsOutlined />}
            </div>
            <div onClick={() => handleTabClick("cart")} className={`navItem ${currTab === "cart" ? "navItemActive" : ""}`}>
                {currTab === "cart" ? <h2 style={{ fontFamily: "Bebas Neue, sans-serif" }}>CART</h2> : <LocalMallOutlined />}
            </div>
            <div onClick={() => handleTabClick("user")} className={`navItem ${currTab === "user" ? "navItemActive" : ""}`}>
                {currTab === "user" ? <h2 style={{ fontFamily: "Bebas Neue, sans-serif" }}>USER</h2> : <PersonOutline />}
            </div>
        </div>
    );
}

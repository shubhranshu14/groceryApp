import React, { useEffect, useState } from "react";
import "../styles/home.css";
import { Search, LocalMall, Home } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import CarouselComponent from "../components/carousel";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";

function HomeScreen() {

    const navigate = useNavigate();

    const { cart } = useCart();
    const [cartSize, setCartSize] = useState(() => cart.length);

    useEffect(() => {
        setCartSize(cart.length);
    }, [cart]);

    const images = [
        '/images/coffeeThumb.webp',
        '/images/morningStarterThumb.webp',
        '/images/cleanerThumb.webp',
        '/images/freshenerThumb.webp',
        '/images/stationeryThumb.webp',
    ];

    const category = [
        {
            img: "/images/categoryDrinks.png",
            link: "drinks",
        },
        {
            img: "/images/categoryDairy.png",
            link: "dairy&Bakery",
        },
        {
            img: "/images/categoryPulses.png",
            link: "lentils&Pulses",
        },
        {
            img: "/images/categoryEdibleOil.png",
            link: "edibleOils&Ghee",
        },
        {
            img: "/images/categoryHousehold.png",
            link: "houseHoldEssentials",
        },
        {
            img: "/images/categoryPersonalCare.png",
            link: "personalCare",
        },
    ]


    const handleButtonClick = (index) => {
        console.log(`Button on Slide ${index + 1} clicked!`);
        // Add logic for the button click
    };

    return (
        <div className="home">
            <div className="homeContainer1">
                <div id="location">
                    <h4>121 nai basti</h4>
                    <p>Your Location</p>
                </div>
                <div id="cart" onClick={() => navigate("/cart")}>
                    <LocalMall sx={{ color: "#37AA25" }} />
                    <h2 style={{ color: "#37AA25", fontFamily: "Bebas Neue, sans-serif", fontWeight: "bold" }}>{cartSize !== 0 && cartSize < 10 ? 0 : null}{cartSize}</h2>
                </div>
            </div>
            <div className="searchBar" style={{ width: "100%", margin: "10px 0" }}>
                <TextField
                    id="outlined-start-adornment"
                    placeholder="Search"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: 'white'
                        },
                        width: '100%',
                    }}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end"><Search /></InputAdornment>,
                        },
                    }}
                />
            </div>
            <div className="imageTab1">
                <img style={{ height: "100%", width: "100%", borderRadius: "6px" }} src="/images/freeDelivery.png" alt="Free Delivery" />
            </div>
            <div className="category margin-top20">
                <div className="flex js_bw">
                    <h4>Category</h4>
                </div>
                <div className="flex itemContainer">
                    {category.map((item, idx) =>
                        <div key={idx} className="categoryItem" onClick={() => navigate(`/category/${item.link}`)}>
                            <img style={{ height: "100%", width: "100%", borderRadius: "8px" }} src={item.img} alt="Free Delivery" />
                        </div>

                    )}
                </div>
            </div>
            <div className="banner margin-top20">
                <img style={{ position: "absolute", width: "110px", right: 0, borderTopRightRadius: "6px" }} src="/images/havmorIceCreamLogo.png" />
                <img className="bannerImg" src="/images/havmoreIceCreamBanner.png" />
            </div>

            <div className="quickBites margin-top20">
                <h4 style={{ marginBottom: "10px" }}>What you need today</h4>
                <CarouselComponent>
                    {images.map((src, index) => (
                        <div key={index} className="slideDiv">
                            <img src={src} alt={`Slide ${index + 1}`} />
                            <button className="slideBtn" onClick={() => handleButtonClick(index)}>
                                View Item
                            </button>
                        </div>
                    ))}
                </CarouselComponent>

            </div>

        </div>
    )
}

export default HomeScreen;
import React from "react";
import "../styles/home.css";
import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";


function CategoryScreen() {

    const navigate = useNavigate();
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


    const handleCategory = (link) => {
        navigate(`/category/${link}`);
    };



    return (
        <div className="home">

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

            <div className="category margin-top20">
                <div className="flex itemContainer">
                    {category.map((item, idx) =>
                        <div key={idx} className="categoryItem2" onClick={() => handleCategory(item.link)}>
                            <img style={{ height: "100%", width: "100%", borderRadius: "8px" }} src={item.img} alt="Free Delivery" />
                        </div>

                    )}
                </div>
            </div>

        </div>
    )
}

export default CategoryScreen;
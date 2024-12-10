import React, { useEffect, useState, useMemo } from "react";
import "../styles/home.css";
import { Search, LocalMall, LocationOnOutlined } from "@mui/icons-material";
import { InputAdornment, Skeleton, TextField } from "@mui/material";
import CarouselComponent from "../components/carousel";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import ModalSheetLocation from "../components/modalSheetLocation";
import { useUser } from "../context/userContext";
import ModalSheetLogin from "../components/modalSheetLogin";
import { useSnackBar } from "../context/snackBarContext";
import { getProductCategory } from "../api/product";

// Component for displaying location
const LocationSection = ({ user, handleGetLocation }) => (
    <div id="location" className="flex" onClick={handleGetLocation}>
        {user?.userAddress?.place ? (
            <div>
                <h4>{user.userAddress.place}</h4>
                <p>Your Location</p>
            </div>
        ) : (
            <h4>Add Your Location</h4>
        )}
        <LocationOnOutlined />
    </div>
);

// Component for displaying the cart icon and size
const CartIcon = ({ cartSize, navigate }) => (
    <div id="cart" onClick={() => navigate("/cart")}>
        <LocalMall sx={{ color: "#37AA25" }} />
        {cartSize > 0 && <h2 className="cartSize">{cartSize < 10 ? `0${cartSize}` : cartSize}</h2>}
    </div>
);

function HomeScreen() {
    const navigate = useNavigate();
    const { cart } = useCart();
    const { setOpenSnackbar, setSnackbarMsg, setSnackbarVariant } = useSnackBar();
    const { user } = useUser();

    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [category, setCategory] = useState([]);
    const [loadingCategory, setLoadingCategory] = useState(true);

    const cartSize = useMemo(() => cart.length, [cart]);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategory(true);
            try {
                const res = await getProductCategory();
                if (!res.success) throw new Error(res.message);
                setCategory(res.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err.message);
            }
            finally {
                setLoadingCategory(false);
            }
        };
        fetchCategories();
    }, []);

    const handleGetLocation = () => {
        if (!user) {
            setIsLoginModalOpen(true);
            setOpenSnackbar(true);
            setSnackbarMsg("Need to login first");
            setSnackbarVariant("info");
            return;
        }
        setIsLocationModalOpen(true);
    };

    const images = [
        "/images/coffeeThumb.webp",
        "/images/morningStarterThumb.webp",
        "/images/cleanerThumb.webp",
        "/images/freshenerThumb.webp",
        "/images/stationeryThumb.webp",
    ];

    return (
        <div className="home">
            <div className="homeContainer1">
                <LocationSection user={user} handleGetLocation={handleGetLocation} />
                <CartIcon cartSize={cartSize} navigate={navigate} />
            </div>

            {isLocationModalOpen && <ModalSheetLocation setIslocationModalOpen={setIsLocationModalOpen} />}
            {isLoginModalOpen && <ModalSheetLogin setIsLoginModalOpen={setIsLoginModalOpen} />}

            <div className="searchBar">
                <TextField
                    id="outlined-start-adornment"
                    placeholder="Search"
                    sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "white" },
                        width: "100%",
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="imageTab1">
                <img className="fullWidthImage" src="/images/freeDelivery.png" alt="Free Delivery" />
            </div>


            <div className="category margin-top20">
                <h4>Category</h4>
                {loadingCategory ? (
                    <div className="flex itemContainer">
                        {
                            Array(6).fill().map((_, idx) =>
                                <div key={idx} className="categoryItem">
                                    <Skeleton variant="rectangle" sx={{ height: "100%" }} />
                                </div>
                            )
                        }
                    </div>
                ) :
                    (<div className="flex itemContainer">
                        {category.map((item, idx) => (
                            <div key={idx} className="categoryItem" onClick={() => navigate(`/category/${item.categoryName}`)}>
                                <img className="categoryImage" src={item.categoryImage} alt={item.categoryName} />
                            </div>
                        ))}
                    </div>)}
            </div>

            <div className="banner margin-top20">
                <img className="bannerLogo" src="/images/havmorIceCreamLogo.png" alt="Havmor Logo" />
                <img className="bannerImg" src="/images/havmoreIceCreamBanner.png" alt="Havmor Banner" />
            </div>

            <div className="quickBites margin-top20">
                <h4>What you need today</h4>
                <CarouselComponent>
                    {images.map((src, index) => (
                        <div key={index} className="slideDiv">
                            <img src={src} alt={`Slide ${index + 1}`} />
                            <button className="slideBtn" onClick={() => console.log(`Button on Slide ${index + 1} clicked!`)}>
                                View Item
                            </button>
                        </div>
                    ))}
                </CarouselComponent>
            </div>
        </div>
    );
}

export default HomeScreen;

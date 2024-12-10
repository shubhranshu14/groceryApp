import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/productListStyle.css";
import { AddCircle, LocalMall, Search } from "@mui/icons-material";
import { InputAdornment, TextField, Grid, Card, CardContent, CardMedia, Typography, IconButton, Box, Rating, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DrinksData, DairyAndBakeryData, LentilsAndPulsesData } from "../assets/mockData/items";
import TopBar from "../components/topBar";
import ModalSheetBottom from "../components/modalSheet";
import ModalSheetLooseItem from "../components/modalSheetLooseItem";
import { getProducts } from "../api/product";

function ProductListScreen() {
    const navigate = useNavigate();
    const { categoryTitle } = useParams();
    const [loading, setLoading] = useState(false);

    const [itemsList, setItemsList] = useState([]);


    const fetchProducts = async () => {
        setLoading(true);
        try {

            const res = await getProducts(categoryTitle);
            if (!res.success) {
                throw new Error(res.message);
            }
            setItemsList(res.data);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 3000);

        } catch (error) {
            console.error(error.message || "faild to fetch product list");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="home">
            {/* Back button and cart items */}
            <TopBar backNavigateTo="category" screenName="Items" />

            {/* Search bar */}
            <div className="searchBar" style={{ width: "100%", margin: "10px 0" }}>
                <TextField
                    id="outlined-start-adornment"
                    placeholder="Search"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: 'white',
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

            {/* Product cards */}
            {
                loading ? (
                    <Grid container spacing={2} justifyContent="center">
                        {Array(4).fill().map((_, idx) => {

                            return (

                                <Grid item key={idx} xs={6} sm={6} md={4}>
                                    <Card sx={{ height: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>

                                        <Skeleton variant="rectangular" height={140} />

                                        <CardContent sx={{ padding: '8px' }}>
                                            <Typography gutterBottom variant="caption" component="div" noWrap>
                                                <Skeleton />
                                            </Typography>
                                            <Typography gutterBottom variant="p" noWrap>
                                                <Skeleton />
                                            </Typography>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        {itemsList.map((product) => {
                            const selectedSize = product.itemSizes[0].size;

                            return (

                                <Grid item key={product._id} xs={6} sm={6} md={4}>
                                    <Card sx={{ height: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={product.itemImageURL}
                                            alt={product.itemName}
                                            sx={{ objectFit: 'contain', padding: '8px' }}
                                        />
                                        <CardContent sx={{ padding: '8px' }}>
                                            <Typography gutterBottom variant="p" component="div" noWrap>
                                                {product.itemName}
                                            </Typography>
                                            {
                                                product.itemBasePricePerKg ?
                                                    <ModalSheetLooseItem
                                                        currItemSize={selectedSize}
                                                        item={product}
                                                    />
                                                    :
                                                    <ModalSheetBottom
                                                        currItemSize={selectedSize}
                                                        item={product}
                                                    />
                                            }
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )
            }

        </div>
    );
}

export default ProductListScreen;

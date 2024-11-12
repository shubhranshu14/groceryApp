import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/productListStyle.css";
import { AddCircle, LocalMall, Search } from "@mui/icons-material";
import { InputAdornment, TextField, Grid, Card, CardContent, CardMedia, Typography, IconButton, Box, Rating } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DrinksData, DairyAndBakeryData, LentilsAndPulsesData } from "../assets/mockData/items";
import TopBar from "../components/topBar";
import ModalSheetBottom from "../components/modalSheet";
import ModalSheetLooseItem from "../components/modalSheetLooseItem";

function ProductListScreen() {
    const navigate = useNavigate();
    const { categoryTitle } = useParams();

    const [itemsList, setItemsList] = useState([]);




    useEffect(() => {
        switch (categoryTitle) {
            case 'drinks':
                setItemsList(DrinksData);
                return;
            case 'dairy&Bakery':
                setItemsList(DairyAndBakeryData);
                return;
            case 'lentils&Pulses':
                setItemsList(LentilsAndPulsesData);
                return;
            default:
                setItemsList([]);
                return;
        }
    }, [categoryTitle]);

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
            <Grid container spacing={2} justifyContent="center">
                {itemsList.map((product) => {
                    const selectedSize = product.itemSizes[0].size;

                    return (

                        <Grid item key={product.itemId} xs={6} sm={6} md={4}>
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


                                    {/* Price and Add button on the same line */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center">

                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

export default ProductListScreen;

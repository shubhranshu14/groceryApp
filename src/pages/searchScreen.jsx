import React, { useEffect, useState } from "react";
import "../styles/home.css";
import { ArrowBack, History, LocationOnOutlined, LogoutOutlined, Search } from "@mui/icons-material";
import { Button, Card, CardContent, CardMedia, Grid, InputAdornment, Skeleton, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProductBySearch } from "../api/product";
import NotFound from "./notFound";
import ModalSheetBottom from "../components/modalSheet";
import ModalSheetLooseItem from "../components/modalSheetLooseItem";


function SearchScreen() {
    const backToTab = localStorage.getItem("backToTab");
    const [itemsList, setItemsList] = useState([]);
    const [searchKeyWord, setSearchKeyWord] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const getProduct = async (keyword) => {
        setLoading(true);
        try {
            const res = await getProductBySearch(keyword);
            if (!res.success) {
                throw new Error(res.message);
            }
            setItemsList(res.data);
        } catch (error) {
            setItemsList([]);
            console.error("Error fetching product:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchKeyWord.length > 1) {
            const timeoutId = setTimeout(() => {
                getProduct(searchKeyWord);
            }, 300); // debounce for 300ms

            // Cleanup function to clear timeout if searchKeyWord changes
            return () => clearTimeout(timeoutId);
        } else {
            setItemsList([]);
        }
    }, [searchKeyWord]);



    return (
        <div className="home">

            <div className="searchBar" style={{ width: "100%", margin: "10px 0" }}>
                <TextField
                    id="outlined-start-adornment"
                    placeholder="Search"
                    value={searchKeyWord}
                    onChange={(e) => {
                        setSearchKeyWord(e.target.value)
                        if (e.target.value.length > 1) { setLoading(true) }
                        else {
                            setLoading(false)
                        }
                    }}
                    autoFocus
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: 'white'
                        },
                        width: '100%',
                    }}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start"><ArrowBack onClick={() => navigate(`/${backToTab == 'home' ? "" : backToTab}`)
                            } /></InputAdornment>,
                        },
                    }}

                />
            </div>

            <div className="category margin-top20">
                {
                    loading ? <Grid container spacing={2} justifyContent="center">

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
                    </Grid> : (
                        <>
                            {itemsList.length === 0 && searchKeyWord.length < 2 ?
                                <>
                                    <Typography gutterBottom variant="body1" component="div" noWrap>
                                        Popular searches
                                    </Typography>
                                    <div>
                                        <div className="option">
                                            <Button size="small" sx={{ color: "#464646" }} onClick={() => setSearchKeyWord("dal")} startIcon={<Search />}>Dal</Button>
                                        </div>
                                        <div className="option">
                                            <Button size="small" sx={{ color: "#464646" }} onClick={() => setSearchKeyWord("soft drink")} startIcon={<Search />}>Soft Drink</Button>
                                        </div>
                                        <div className="option">
                                            <Button size="small" sx={{ color: "#464646" }} onClick={() => setSearchKeyWord("bread")} startIcon={<Search />}>Bread</Button>
                                        </div>
                                    </div>
                                </>
                                : itemsList.length === 0 ? (
                                    <NotFound itemSearchedFor={searchKeyWord} />
                                ) : (
                                    <>
                                        <Typography gutterBottom variant="body1" component="div" noWrap>
                                            Showing results for {`"${searchKeyWord}"`}
                                        </Typography>
                                        <Grid container spacing={2}>

                                            {itemsList.map((product) => {
                                                const selectedSize = product.itemSizes[0].size;

                                                return (
                                                    <Grid item key={product._id} xs={6} sm={6} md={4}>
                                                        <Card
                                                            sx={{
                                                                height: "100%",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                flex: 1,
                                                            }}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={product.itemImageURL}
                                                                alt={product.itemName}
                                                                sx={{ objectFit: "contain", padding: "8px" }}
                                                            />
                                                            <CardContent sx={{ padding: "8px" }}>
                                                                <Typography
                                                                    gutterBottom
                                                                    variant="body1" // Changed to body1, as "p" is not a valid MUI variant
                                                                    component="div"
                                                                    noWrap
                                                                >
                                                                    {product.itemName}
                                                                </Typography>
                                                                {product.itemBasePricePerKg ? (
                                                                    <ModalSheetLooseItem
                                                                        currItemSize={selectedSize}
                                                                        item={product}
                                                                    />
                                                                ) : (
                                                                    <ModalSheetBottom
                                                                        currItemSize={selectedSize}
                                                                        item={product}
                                                                    />
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </>
                                )}
                        </>

                    )
                }
            </div>

        </div>
    )
}

export default SearchScreen;
import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/cartStyle.css";
import "../styles/productListStyle.css";
import { AddCircle, CloseOutlined, DeleteOutline, LocalMall, Search } from "@mui/icons-material";
import { InputAdornment, TextField, Grid, Card, CardContent, CardMedia, Typography, IconButton, Box, Rating, colors } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DrinksData, DairyAndBakeryData } from "../assets/mockData/items";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalSheetBottom from "../components/modalSheet";
import TopBar from "../components/topBar";
import { useCart } from "../context/cartContext";
import AlertDialog from "../components/alertDialog";

function CartScreen() {
    const navigate = useNavigate();

    const { cart, addToCart, increaseQuantity, decreaseQuantity, getQuantity } = useCart();
    const [cartSize, setCartSize] = useState(() => cart.length);
    const [totalPrice, setTotalPrice] = useState(0);
    const [itemToRemove, setItemToRemove] = useState({});
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setCartSize(cart.length);
    }, [cart]);

    useEffect(() => {
        const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(total);
    }, [cart]);

    const decrease = (quantity, item, selectedSize) => {
        if (quantity === 1) {
            setItemToRemove(item);
            setOpenDialog(true);
        } else {
            decreaseQuantity(item, selectedSize);
        }
    }

    const handleContinueShopping = () => {
        navigate("/");
        localStorage.setItem("tabName", "home");
        localStorage.setItem("backToTab", "home");

    }

    return (
        <div className="divContainer">
            <TopBar backNavigateTo="home" screenName="Review Cart" />
            {cartSize === 0 ? (
                <div style={{ marginTop: "40px", textAlign: "center" }}>
                    <img id="cartSvg" src={"/images/emptyCart.svg"} alt="Empty Cart" />
                    <h2>Your cart is Empty</h2>
                    <button className="startShoppingBtn" onClick={handleContinueShopping}>Start Shopping</button>
                </div>
            ) : (
                <>
                    <div className="cartItems">
                        {cart.map((item, index) => (
                            <div className="itemSizeOption" key={index} style={{ backgroundColor: "#fff", borderRadius: "6px", gap: "4px" }}>
                                <img style={{ width: "60px", padding: "2px" }} src={item.itemImg} alt={item.itemName} />
                                <div style={{ flex: 1, marginLeft: "2px" }}>
                                    <h4>{item.itemName}</h4>
                                    <h5 style={{ color: "gray" }}>{item.selectedSize}</h5>
                                    <h4>₹{item.pricePerUnit.toFixed(2)}</h4>
                                </div>
                                {item.looseItem ? (
                                    <div className="deleteCartItemBtn" onClick={() => decrease(item.quantity, item, item.selectedSize)}>
                                        <div className="innerDivBtn">
                                            <DeleteOutline sx={{ color: "#fff" }} fontSize="small" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="quantityControl">
                                        <button className="quantityBtn" onClick={() => decrease(item.quantity, item, item.selectedSize)}>-</button>
                                        <div style={{ backgroundColor: "#37aa25", width: "30px", color: "#fff", textAlign: "center" }}>{item.quantity}</div>
                                        <button className="quantityBtn" onClick={() => increaseQuantity(item, item.selectedSize)}>+</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button onClick={handleContinueShopping} className="continueBtn">Continue Shopping</button>
                    </div>

                    <div className="cheackout">
                        <div className="flex js_bw">
                            <h4>SubTotal:</h4>
                            <h4>₹{totalPrice}</h4>
                        </div>
                        <div className="flex js_bw">
                            <h4>Delivery Charges:</h4>
                            <div style={{ fontSize: "12px", textAlign: "end" }}>
                                <h4>₹0</h4>
                                <p style={{ fontSize: "10px", color: "red" }}>*free delivery</p>
                            </div>
                        </div>
                        <div className="flex js_bw">
                            <h4>Total:</h4>
                            <h4>₹{totalPrice}</h4>
                        </div>
                        <button className="orderBtn">Place Order</button>
                    </div>
                </>
            )}

            <AlertDialog open={openDialog} setOpen={setOpenDialog} itemName={itemToRemove.itemName} decreaseQuantity={() => decreaseQuantity(itemToRemove, itemToRemove.selectedSize)} />
        </div>
    );
}

export default CartScreen;


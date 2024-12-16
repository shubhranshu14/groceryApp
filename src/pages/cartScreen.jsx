import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/cartStyle.css";
import "../styles/productListStyle.css";
import { AddCircle, CloseOutlined, DeleteOutline, DeliveryDiningOutlined, HomeOutlined, LocalMall, NavigateNextOutlined, PhoneInTalkOutlined, Search } from "@mui/icons-material";
import { InputAdornment, TextField, Grid, Card, CardContent, CardMedia, Typography, IconButton, Box, Rating, colors, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DrinksData, DairyAndBakeryData } from "../assets/mockData/items";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalSheetBottom from "../components/modalSheet";
import TopBar from "../components/topBar";
import { useCart } from "../context/cartContext";
import AlertDialog from "../components/alertDialog";
import { useSnackBar } from "../context/snackBarContext";
import { createOrder } from "../api/product";
import { LoadingButton } from "@mui/lab";
import { useUser } from "../context/userContext";
import ModalSheetPhoneNo from "../components/modalSheetPhoneNo";

function CartScreen() {
    const navigate = useNavigate();

    const { cart, setCart, addToCart, increaseQuantity, decreaseQuantity, getQuantity } = useCart();
    const { setOpenSnackbar, setSnackbarMsg, setSnackbarVariant } = useSnackBar();
    const { user } = useUser();
    const [cartSize, setCartSize] = useState(() => cart.length);
    const [totalPrice, setTotalPrice] = useState(0);
    const [itemToRemove, setItemToRemove] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const authToken = localStorage.getItem("authToken");

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

    const handlePlaceOrder = async () => {
        if (!user.userNumber) {
            setOpenSnackbar(true);
            setSnackbarMsg("Add phone number");
            setSnackbarVariant("info");
            setIsPhoneModalOpen(true);
            return
        }
        setLoading(true);
        const cart = localStorage.getItem('cart');
        console.log("cart", cart);

        if (cart) {
            const orderData = JSON.parse(cart);

            try {
                const res = await createOrder({ orderData, totalPrice }, authToken);
                if (!res.success) {
                    throw new Error(res.message);
                }
                setOpenSnackbar(true);
                setSnackbarMsg("Order placed");
                setSnackbarVariant("success");
                setCart([]);
                navigate("/user/myOrder");
                localStorage.setItem('cart', JSON.stringify([]));

            } catch (error) {
                setOpenSnackbar(true);
                setSnackbarMsg(error.message);
                setSnackbarVariant("error");
            } finally {
                setLoading(false);
            }
        } else {
            setOpenSnackbar(true);
            setSnackbarMsg("No product found");
            setSnackbarVariant("error");
        }
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
                        <div className="deliveryInfo">
                            <div className="deliveryAddress flex">
                                <HomeOutlined fontSize="small" />
                                <div>
                                    <h4>Delivery at</h4>
                                    <h5>{user.userAddress.place}</h5>
                                </div>
                            </div>
                            <Divider sx={{ mb: '10px', mt: '10px' }} />
                            <div className="deliveryPhoneNo flex" onClick={() => setIsPhoneModalOpen(true)}>
                                <PhoneInTalkOutlined fontSize="small" />
                                <div>
                                    <h4>{user.userName}, {user.userNumber ? `+91-${user.userNumber}` : 'Add number'}</h4>
                                </div>
                                <NavigateNextOutlined />
                            </div>
                            <Divider sx={{ mb: '10px', mt: '10px' }} />
                            <div className="deliveryCharge flex">
                                <DeliveryDiningOutlined fontSize="small" />
                                <div>
                                    <h4>Get Free Delivery on this order</h4>
                                </div>
                            </div>
                        </div>
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
                        <LoadingButton loading={loading} variant="contained" onClick={handlePlaceOrder} className="orderBtn">Place Order</LoadingButton>
                        <ModalSheetPhoneNo isPhoneModalOpen={isPhoneModalOpen} setIsPhoneModalOpen={setIsPhoneModalOpen} />
                    </div>
                </>
            )}

            <AlertDialog open={openDialog} setOpen={setOpenDialog} itemName={itemToRemove.itemName} decreaseQuantity={() => decreaseQuantity(itemToRemove, itemToRemove.selectedSize)} />
        </div>
    );
}

export default CartScreen;


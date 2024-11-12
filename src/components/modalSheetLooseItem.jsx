import { Close, KeyboardArrowDown } from '@mui/icons-material';
import { Typography, TextField, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';
import { useCart } from '../context/cartContext';
import "../styles/modalSheetStyle.css";

Modal.setAppElement('#root');

export default function ModalSheetLooseItem({ currItemSize, item }) {
    const [isOpen, setOpen] = useState(false);

    const { cart, addToCart, decreaseQuantity, getQuantity } = useCart();

    const looseItem = true;

    const [selectedSize, setSelectedSize] = useState(() => {
        const itemInCart = cart.find(cartItem => cartItem.itemId === item.itemId);
        return itemInCart ? Number(itemInCart.selectedSize) : 1; // Ensure it's a number
    }); // Default size
    const springProps = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
        config: { tension: 300, friction: 30 },
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const sizes = [0.5, 0.75, 1, 1.5, 2, 2.5, 3]; // in Kg

    // Calculate price based on selected size
    const calculatePrice = () => {
        return item.itemBasePricePerKg * parseFloat(selectedSize);
    };

    const handleAddOrRemove = () => {
        const itemInCart = cart.some(
            cartItem => cartItem.itemId === item.itemId
        );

        if (itemInCart) {
            decreaseQuantity(item, selectedSize); // Remove item if it's already in the cart
        } else {
            addToCart(item, selectedSize, calculatePrice(), looseItem); // Add to cart if not present
        }
    };

    return (
        <>
            <button className='itemPackSizeBtn' onClick={() => setOpen(true)} >
                <Typography variant="body2" color="text.secondary" noWrap>
                    {currItemSize}
                </Typography>
                <KeyboardArrowDown />
            </button>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setOpen(false)}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    content: { padding: 0, border: 'none', borderRadius: '12px 12px 0px 0px', bottom: 0, top: 'auto', left: 0, right: 0 },
                }}
            >
                <animated.div style={springProps} className="modal-sheet">
                    <div style={{ padding: '20px 10px', height: "580px" }}>
                        <div className='itemDetail'>
                            <div className='itemImg'>
                                <img src={item.itemImageURL} alt={item.itemName} />
                            </div>
                            <div className='itemDescription'>
                                <Typography variant="h6" sx={{ fontSize: "18px" }}>
                                    {item.itemName}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }} color="text.secondary">
                                    {item.itemDescription}
                                </Typography>
                                <Typography sx={{ fontSize: "18px" }} color="text.secondary">
                                    ₹{item.itemBasePricePerKg.toFixed(2)}/Kg
                                </Typography>
                            </div>
                            <Close fontSize='small' color="disabled" onClick={() => setOpen(false)} />
                        </div>

                        <Typography variant="p" component="div" sx={{ fontSize: "12px", padding: "10px 0" }}>
                            Choose a Pack Size
                        </Typography>

                        <TextField
                            select
                            label="Pack Size"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            variant="outlined"
                            fullWidth
                            disabled={cart.some(cartItem => cartItem.itemId === item.itemId)}
                        >
                            {sizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {`${size} Kg`}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography sx={{ fontSize: "18px", padding: "10px 0" }}>
                                Price: ₹{calculatePrice().toFixed(2)}
                            </Typography>

                            <button
                                className='addItemBtn'
                                onClick={handleAddOrRemove}
                            >
                                {cart.some(cartItem => cartItem.itemId === item.itemId) ? 'Remove Item' : 'Add to Cart'}
                            </button>

                        </div>

                    </div>
                </animated.div>
            </Modal>
        </>
    );
}

import { Close, KeyboardArrowDown } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { animated, useSpring } from 'react-spring';
import { useCart } from '../context/cartContext';
import "../styles/modalSheetStyle.css";
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Necessary for accessibility

export default function ModalSheetBottom({ currItemSize, item }) {
    const navigate = useNavigate();

    const [isOpen, setOpen] = useState(false);
    const { user } = useUser();


    const looseItem = false;
    // Spring animation for the sheet
    const springProps = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
        config: { tension: 300, friction: 30 },
    });

    const { cart, addToCart, increaseQuantity, decreaseQuantity, getQuantity } = useCart();

    const handleAddItem = (item, size, price, looseItem) => {
        if (user) {
            addToCart(item, size, price, looseItem);
        } else {
            navigate("/user");
            localStorage.setItem("tabName", "user");
        }

    }

    // Add useEffect to toggle body overflow
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto'; // Reset on unmount
        };
    }, [isOpen]);

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
                                <img src={item.itemImageURL} />
                            </div>
                            <div className='itemDescription'>
                                <Typography variant="h6" sx={{ fontSize: "18px" }}>
                                    {item.itemName}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }} color="text.secondary">
                                    {item.itemDescription}
                                </Typography>
                            </div>
                            <Close fontSize='small' color="disabled" onClick={() => setOpen(false)} />
                        </div>

                        <Typography variant="p" component="div" sx={{ fontSize: "12px", padding: "10px 0" }}>
                            Choose a Pack Size
                        </Typography>

                        <div style={{ height: '200px', overflowY: 'auto' }}>
                            {item.itemSizes.map((sizeObj, index) => {
                                const quantity = getQuantity(item, sizeObj.size);
                                return (
                                    <div className='itemSizeOption' key={index}>
                                        <div>
                                            <h5 style={{ color: "gray" }}>{sizeObj.size}</h5>
                                            <h4>₹{sizeObj.price.toFixed(2)}</h4>
                                        </div>
                                        {sizeObj.itemInStock > 0 ? (
                                            quantity > 0 ? (
                                                <div className='quantityControl'>
                                                    <button className='quantityBtn' onClick={() => decreaseQuantity(item, sizeObj.size)}>-</button>
                                                    <div style={{ backgroundColor: "#37aa25", width: "30px", height: "100%", textAlign: "center", color: "#fff" }}>{quantity}</div>
                                                    <button className='quantityBtn' onClick={() => increaseQuantity(item, sizeObj.size)}>+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    className='addItemBtn'
                                                    onClick={() => handleAddItem(item, sizeObj.size, sizeObj.price, looseItem)}
                                                >
                                                    Add
                                                </button>
                                            )
                                        ) : (
                                            <button style={{ color: "gray", backgroundColor: "lightgray" }} className='addItemBtn' disabled>
                                                Out of Stock
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </animated.div>
            </Modal >
        </>
    );
}

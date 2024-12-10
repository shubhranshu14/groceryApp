import React, { createContext, useContext, useState, useEffect } from "react";
import { useSnackBar } from "./snackBarContext";

// Create the Context
const CartContext = createContext();

// Define a custom hook for easy access to the CartContext
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const MAX_QUANTITY = 6;

  // Retrieve initial cart from localStorage or set to empty array
  const getCartFromStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const [cart, setCart] = useState(getCartFromStorage);

  const { setOpenSnackbar, setSnackbarMsg, setSnackbarVariant } = useSnackBar();

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart or update its quantity if already in the cart
  const addToCart = (product, selectedSize, price, looseItem) => {
    let updatedCart = [...cart];
    const cartItemIndex = updatedCart.findIndex(
      (item) =>
        item.itemId === product._id && item.selectedSize === selectedSize
    );

    if (cartItemIndex > -1) {
      // Update quantity if under max limit
      if (updatedCart[cartItemIndex].quantity < MAX_QUANTITY) {
        updatedCart[cartItemIndex].quantity += 1;
        updatedCart[cartItemIndex].totalPrice =
          updatedCart[cartItemIndex].quantity *
          updatedCart[cartItemIndex].pricePerUnit;
        // console.log("kkk");

      } else {
        setOpenSnackbar(true);
        setSnackbarMsg("Maximum quantity reached for this item.")
        setSnackbarVariant("info");
      }
    } else {
      // Add new item if not in cart
      updatedCart.push({
        itemId: product._id,
        itemImg: product.itemImageURL,
        itemName: product.itemName,
        selectedSize,
        pricePerUnit: price,
        quantity: 1,
        totalPrice: price,
        looseItem: looseItem,
      });
    }

    setCart(updatedCart);
  };

  // Increase item quantity
  const increaseQuantity = (product, selectedSize) => {
    let updatedCart = [...cart];
    const cartItemIndex = updatedCart.findIndex(
      (item) =>
        item.itemId === (product.itemId || product._id) && item.selectedSize === selectedSize
    );

    if (
      cartItemIndex > -1 &&
      updatedCart[cartItemIndex].quantity < MAX_QUANTITY
    ) {
      updatedCart[cartItemIndex].quantity += 1;
      updatedCart[cartItemIndex].totalPrice =
        updatedCart[cartItemIndex].quantity *
        updatedCart[cartItemIndex].pricePerUnit;
      setCart(updatedCart);
    } else {
      setOpenSnackbar(true);
      setSnackbarMsg("Maximum quantity reached for this item.")
      setSnackbarVariant("info");
    }
  };

  // Decrease item quantity or remove if quantity is 1
  const decreaseQuantity = (product, selectedSize) => {
    let updatedCart = [...cart];
    const cartItemIndex = updatedCart.findIndex(
      (item) =>
        item.itemId === (product.itemId || product._id) && item.selectedSize === selectedSize
    );

    if (cartItemIndex > -1) {
      if (updatedCart[cartItemIndex].quantity === 1) {
        updatedCart.splice(cartItemIndex, 1);
      } else {
        updatedCart[cartItemIndex].quantity -= 1;
        updatedCart[cartItemIndex].totalPrice =
          updatedCart[cartItemIndex].quantity *
          updatedCart[cartItemIndex].pricePerUnit;
      }
      setCart(updatedCart);
    }
  };

  // Get quantity of a specific item
  const getQuantity = (product, selectedSize) => {
    const cartItem = cart.find(
      (item) =>
        item.itemId === (product.itemId || product._id) && item.selectedSize === selectedSize
    );
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

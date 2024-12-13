import { HOST_API } from "../../config.js";

// get all products
export const getProducts = async (productCategory) => {
  try {
    const url = `${HOST_API}/product/fetchall/${productCategory}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const responseError = await res.json();
      throw new Error(responseError.message);
    }

    const result = await res.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

// get all product category
export const getProductCategory = async () => {
  try {
    const url = `${HOST_API}/product/category/fetchall`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const responseError = await res.json();
      throw new Error(responseError.message);
    }

    const result = await res.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    console.error("faild to get product category list", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

// place order

export const createOrder = async (orderData, authToken) => {
  const url = `${HOST_API}/product/order/create`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const errorRes = await res.json();
      throw new Error(errorRes.message);
    }

    const result = await res.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    console.error("error in create order api", error);

    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

// get order list by user

export const getOrderByUser = async (authToken) => {
  const url = `${HOST_API}/product/order/fetchByUser`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) {
      const errorRes = await res.json();
      throw new Error(errorRes.message);
    }
    const result = await res.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

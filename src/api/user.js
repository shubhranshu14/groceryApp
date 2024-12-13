import { HOST_API } from "../../config.js";

export const userSignUp = async (userData) => {
  const url = `${HOST_API}/user/signup`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Failed to signup");
    }
    const result = await response.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    console.error("Signup failed:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const userLogin = async (userData) => {
  const url = `${HOST_API}/user/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Failed to login");
    }

    // Parse and return data
    const result = await response.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    // Log and rethrow a descriptive error
    console.error("Login failed:", error);
    return {
      success: false,
      message:
        error.message == "Failed to fetch"
          ? "An unexpected error occurred"
          : error.message,
    };
  }
};

export const getUser = async (authToken) => {
  const url = `${HOST_API}/user/current`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const resultError = await response.json();
      throw new Error(resultError.message || "User sesscion time out");
    }

    const result = await response.json();
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

export const updateUserAddress = async (address, authToken) => {
  const url = `${HOST_API}/user/updateAddress`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      const resultError = await response.json();
      throw new Error(resultError.message);
    }

    const result = await response.json();
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

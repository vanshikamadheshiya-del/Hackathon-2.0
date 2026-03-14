// src/utils/apiHandler.ts

export const apiHandler = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    // Extract the error message from the Axios error object
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // You can also trigger global notifications here (toast, alert, etc.)
    console.error("API Error:", message);

    // Re-throw the error so the calling component can also handle it if needed
    throw new Error(message);
  }
};

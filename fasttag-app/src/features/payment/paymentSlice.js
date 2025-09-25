// features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from './paymentService';

const initialState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  paymentStatus: 'idle' // idle, pending, success, failed
};

// Create new payment
export const createPayment = createAsyncThunk(
  'payment/create',
  async (paymentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.createPayment(paymentData, token);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify UPI payment
export const verifyUpiPayment = createAsyncThunk(
  'payment/verifyUpi',
  async (paymentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.verifyUpiPayment(paymentData, token);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment by ID
export const getPaymentById = createAsyncThunk(
  'payment/getById',
  async (paymentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.getPaymentById(paymentId, token);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user payments
export const getUserPayments = createAsyncThunk(
  'payment/getUserPayments',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.getUserPayments(token);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
      state.paymentStatus = 'idle';
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
        state.paymentStatus = 'pending';
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPayment = action.payload;
        state.payments.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.paymentStatus = 'failed';
      })
      // Verify UPI Payment
      .addCase(verifyUpiPayment.pending, (state) => {
        state.isLoading = true;
        state.paymentStatus = 'pending';
      })
      .addCase(verifyUpiPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPayment = action.payload;
        state.paymentStatus = 'success';
        // Update payment in payments array
        const index = state.payments.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(verifyUpiPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.paymentStatus = 'failed';
      })
      // Get Payment By ID
      .addCase(getPaymentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPayment = action.payload;
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get User Payments
      .addCase(getUserPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payments = action.payload;
      })
      .addCase(getUserPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetPayment, setPaymentStatus, clearCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
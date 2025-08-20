// features/bank/bankSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bankService from './bankService';

const initialState = {
  bankDetails: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create bank details
export const createBankDetails = createAsyncThunk(
  'bank/create',
  async (bankData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bankService.createBankDetails(bankData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get bank details by owner ID
export const getBankDetails = createAsyncThunk(
  'bank/getByOwnerId',
  async (ownerId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bankService.getBankDetails(ownerId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update bank details
export const updateBankDetails = createAsyncThunk(
  'bank/update',
  async ({ id, bankData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bankService.updateBankDetails(id, bankData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete bank details
export const deleteBankDetails = createAsyncThunk(
  'bank/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bankService.deleteBankDetails(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify bank details
export const verifyBankDetails = createAsyncThunk(
  'bank/verify',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bankService.verifyBankDetails(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    resetBank: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBankDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBankDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bankDetails = action.payload;
      })
      .addCase(createBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBankDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBankDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bankDetails = action.payload;
      })
      .addCase(getBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBankDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bankDetails = action.payload;
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBankDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBankDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bankDetails = null;
      })
      .addCase(deleteBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyBankDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyBankDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bankDetails = action.payload;
      })
      .addCase(verifyBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBank, reset } = bankSlice.actions;
export default bankSlice.reducer;
// features/kyc/personalSlice.js (updated to match your existing structure)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import personalService from './personalService';

const initialState = {
  personalDetails: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create personal details
export const createPersonalDetails = createAsyncThunk(
  'kyc/createPersonalDetails',
  async (personalData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await personalService.createPersonalDetails(personalData, token);
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

// Get personal details by auth user ID
export const getPersonalDetails = createAsyncThunk(
  'kyc/getPersonalDetails',
  async (authUserId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await personalService.getPersonalDetails(authUserId, token);
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

// Update KYC status
export const updateKycStatus = createAsyncThunk(
  'kyc/updateKycStatus',
  async ({ id, kycStatus }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await personalService.updateKycStatus(id, kycStatus, token);
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

export const personalSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    resetPersonal: (state) => {
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
      .addCase(createPersonalDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPersonalDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.personalDetails = action.payload;
      })
      .addCase(createPersonalDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPersonalDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPersonalDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.personalDetails = action.payload;
      })
      .addCase(getPersonalDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateKycStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateKycStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.personalDetails = action.payload;
      })
      .addCase(updateKycStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPersonal, reset } = personalSlice.actions;
export default personalSlice.reducer;
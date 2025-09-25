// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/kyc/personalSlice';
import vehicleReducer from '../features/vehicle/vehicleSlice';
import paymentReducer from '../features/payment/paymentSlice';
export const store = configureStore({
  reducer: {
    auth:authReducer,
    kyc:userReducer,
    vehicle:vehicleReducer,
    payment:paymentReducer
  },
});
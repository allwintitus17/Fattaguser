// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import tagService from './tagService';

// const initialState = {
//   tags: [],
//   currentTag: null,
//   tagStats: null,
//   transactions: [],
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: '',
//   pagination: null
// };

// // Create FastTag from payment (can accept either paymentId or full payload)
// export const createTagFromPayment = createAsyncThunk(
//   'tags/createFromPayment',
//   async (tagData, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
      
//       console.log('createTagFromPayment called with:', tagData);
      
//       return await tagService.createTagFromPayment(tagData, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Get user tags
// export const getUserTags = createAsyncThunk(
//   'tags/getUserTags',
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.getUserTags(token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Get single tag
// export const getTagById = createAsyncThunk(
//   'tags/getById',
//   async (tagId, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.getTagById(tagId, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Get tag by vehicle registration
// export const getTagByVehicle = createAsyncThunk(
//   'tags/getByVehicle',
//   async (regNumber, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.getTagByVehicle(regNumber, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Recharge tag
// export const rechargeTag = createAsyncThunk(
//   'tags/recharge',
//   async ({ tagId, amount, paymentId, description }, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.rechargeTag(tagId, { amount, paymentId, description }, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Get tag transactions
// export const getTagTransactions = createAsyncThunk(
//   'tags/getTransactions',
//   async ({ tagId, page, limit, type, startDate, endDate }, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.getTagTransactions(tagId, { page, limit, type, startDate, endDate }, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Toggle tag block status
// export const toggleTagBlockStatus = createAsyncThunk(
//   'tags/toggleBlock',
//   async ({ tagId, isBlocked, reason }, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.toggleTagBlockStatus(tagId, { isBlocked, reason }, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Get user tag statistics
// export const getUserTagStats = createAsyncThunk(
//   'tags/getStats',
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await tagService.getUserTagStats(token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const tagSlice = createSlice({
//   name: 'tags',
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.isLoading = false;
//       state.isSuccess = false;
//       state.isError = false;
//       state.message = '';
//     },
//     clearCurrentTag: (state) => {
//       state.currentTag = null;
//     },
//     clearTransactions: (state) => {
//       state.transactions = [];
//       state.pagination = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create tag from payment
//       .addCase(createTagFromPayment.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createTagFromPayment.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.currentTag = action.payload.data;
//         state.tags.push(action.payload.data);
//       })
//       .addCase(createTagFromPayment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Get user tags
//       .addCase(getUserTags.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getUserTags.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.tags = action.payload.data;
//       })
//       .addCase(getUserTags.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Get tag by ID
//       .addCase(getTagById.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getTagById.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.currentTag = action.payload.data;
//       })
//       .addCase(getTagById.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Get tag by vehicle
//       .addCase(getTagByVehicle.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getTagByVehicle.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.currentTag = action.payload.data;
//       })
//       .addCase(getTagByVehicle.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Recharge tag
//       .addCase(rechargeTag.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(rechargeTag.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         // Update the tag balance in the tags array
//         const tagIndex = state.tags.findIndex(tag => tag.tagId === action.payload.data.tagId);
//         if (tagIndex !== -1) {
//           state.tags[tagIndex].balance = action.payload.data.newBalance;
//         }
//         // Update current tag if it matches
//         if (state.currentTag && state.currentTag.tagId === action.payload.data.tagId) {
//           state.currentTag.balance = action.payload.data.newBalance;
//         }
//       })
//       .addCase(rechargeTag.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Get tag transactions
//       .addCase(getTagTransactions.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getTagTransactions.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.transactions = action.payload.data;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(getTagTransactions.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Toggle tag block status
//       .addCase(toggleTagBlockStatus.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(toggleTagBlockStatus.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         // Update the tag status in the tags array
//         const tagIndex = state.tags.findIndex(tag => tag.tagId === action.payload.data.tagId);
//         if (tagIndex !== -1) {
//           state.tags[tagIndex].status = action.payload.data.status;
//           state.tags[tagIndex].security = {
//             ...state.tags[tagIndex].security,
//             isBlocked: action.payload.data.isBlocked,
//             blockReason: action.payload.data.blockReason
//           };
//         }
//       })
//       .addCase(toggleTagBlockStatus.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       // Get user tag statistics
//       .addCase(getUserTagStats.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getUserTagStats.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.tagStats = action.payload.data;
//       })
//       .addCase(getUserTagStats.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       });
//   },
// });

// export const { reset, clearCurrentTag, clearTransactions } = tagSlice.actions;
// export default tagSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tagService from './tagService';

const initialState = {
  tags: [],
  currentTag: null,
  tagStats: null,
  transactions: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  pagination: null
};

export const createTagFromPayment = createAsyncThunk(
  'tags/createFromPayment',
  async (tagData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      console.log('createTagFromPayment called with:', tagData);
      return await tagService.createTagFromPayment(tagData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserTags = createAsyncThunk(
  'tags/getUserTags',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.getUserTags(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTagById = createAsyncThunk(
  'tags/getById',
  async (tagId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.getTagById(tagId, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTagByVehicle = createAsyncThunk(
  'tags/getByVehicle',
  async (regNumber, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.getTagByVehicle(regNumber, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rechargeTag = createAsyncThunk(
  'tags/recharge',
  async ({ tagId, amount, paymentId, description }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.rechargeTag(tagId, { amount, paymentId, description }, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTagTransactions = createAsyncThunk(
  'tags/getTransactions',
  async ({ tagId, page, limit, type, startDate, endDate }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.getTagTransactions(tagId, { page, limit, type, startDate, endDate }, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleTagBlockStatus = createAsyncThunk(
  'tags/toggleBlock',
  async ({ tagId, isBlocked, reason }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.toggleTagBlockStatus(tagId, { isBlocked, reason }, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserTagStats = createAsyncThunk(
  'tags/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.getUserTagStats(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      // CRITICAL: DO NOT reset tags, currentTag, tagStats, transactions
    },
    clearCurrentTag: (state) => {
      state.currentTag = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create tag from payment
      .addCase(createTagFromPayment.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createTagFromPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        const newTag = action.payload.data;
        state.currentTag = newTag;
        
        const existingIndex = state.tags.findIndex(tag => tag._id === newTag._id);
        if (existingIndex === -1) {
          state.tags.push(newTag);
        } else {
          state.tags[existingIndex] = newTag;
        }
        
        state.message = action.payload.message || 'FastTag created successfully';
      })
      .addCase(createTagFromPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      // Get user tags - CRITICAL FIX: Don't set isSuccess
      .addCase(getUserTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTags.fulfilled, (state, action) => {
        state.isLoading = false;
        // REMOVED: state.isSuccess = true;
        state.isError = false;
        state.tags = action.payload.data || [];
        console.log('Tags loaded:', state.tags.length);
      })
      .addCase(getUserTags.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.tags = [];
      })
      // Get tag by ID
      .addCase(getTagById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTagById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTag = action.payload.data;
      })
      .addCase(getTagById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get tag by vehicle
      .addCase(getTagByVehicle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTagByVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTag = action.payload.data;
      })
      .addCase(getTagByVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Recharge tag
      .addCase(rechargeTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rechargeTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const tagIndex = state.tags.findIndex(tag => tag.tagId === action.payload.data.tagId);
        if (tagIndex !== -1) {
          state.tags[tagIndex].balance = action.payload.data.newBalance;
        }
        if (state.currentTag?.tagId === action.payload.data.tagId) {
          state.currentTag.balance = action.payload.data.newBalance;
        }
      })
      .addCase(rechargeTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get tag transactions
      .addCase(getTagTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTagTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(getTagTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Toggle tag block status
      .addCase(toggleTagBlockStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleTagBlockStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const tagIndex = state.tags.findIndex(tag => tag.tagId === action.payload.data.tagId);
        if (tagIndex !== -1) {
          state.tags[tagIndex].status = action.payload.data.status;
          state.tags[tagIndex].security = {
            ...state.tags[tagIndex].security,
            isBlocked: action.payload.data.isBlocked,
            blockReason: action.payload.data.blockReason
          };
        }
      })
      .addCase(toggleTagBlockStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get user tag statistics - CRITICAL FIX: Don't set isSuccess
      .addCase(getUserTagStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTagStats.fulfilled, (state, action) => {
        state.isLoading = false;
        // REMOVED: state.isSuccess = true;
        state.tagStats = action.payload.data;
        console.log('Stats loaded:', state.tagStats);
      })
      .addCase(getUserTagStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentTag, clearTransactions } = tagSlice.actions;
export default tagSlice.reducer;
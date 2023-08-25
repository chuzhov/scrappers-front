import { createSlice } from '@reduxjs/toolkit';
import {
  addContactOp,
  fetchSuspectedTendersOP,
  deleteTenderOP,
  updateContactOp,
} from '../operations/phonebookOps';

const pendingRoutine = state => {
  state.tenders.isLoading = true;
};

const onRejectRoutine = (state, { payload }) => {
  state.tenders.isLoading = false;
  state.tenders.error = payload;
};

const phonebookSlice = createSlice({
  name: 'tenders',
  initialState: {
    tenders: { items: [], isLoading: false, error: null },
  },
  reducers: {
    updateFilter(state, { payload }) {
      state.filter = payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(addContactOp.pending, pendingRoutine)
      .addCase(addContactOp.fulfilled, (state, { payload }) => {
        state.tenders.isLoading = false;
        state.tenders.error = null;
        state.tenders.items.push(payload);
      })
      .addCase(addContactOp.rejected, onRejectRoutine)
      .addCase(fetchSuspectedTendersOP.pending, pendingRoutine)
      .addCase(fetchSuspectedTendersOP.fulfilled, (state, { payload }) => {
        state.tenders.isLoading = false;
        state.tenders.error = null;
        state.tenders.items = payload;
      })
      .addCase(fetchSuspectedTendersOP.rejected, onRejectRoutine)
      .addCase(deleteTenderOP.pending, pendingRoutine)
      .addCase(deleteTenderOP.fulfilled, (state, { payload }) => {
        const id = payload.id;
        state.tenders.isLoading = false;
        state.tenders.error = null;
        state.tenders.items = state.tenders.items.filter(
          tender => tender._id !== id
        );
      })
      .addCase(deleteTenderOP.rejected, onRejectRoutine)
      .addCase(updateContactOp.pending, pendingRoutine)
      .addCase(updateContactOp.fulfilled, (state, { payload }) => {
        const index = state.tenders.items.findIndex(
          item => item.id === payload.id
        );
        state.tenders.items[index] = payload;
      })
      .addCase(updateContactOp.rejected, onRejectRoutine),
});

export default phonebookSlice.reducer;
export const { updateFilter } = phonebookSlice.actions;

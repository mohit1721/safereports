export const handleAsyncThunk = (builder, asyncThunk, updateState = null) => {
    builder
      .addCase(asyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (updateState) {
          updateState(state, action.payload);
        } else {
          state.reports = action.payload; // Default behavior
        }
      })
      .addCase(asyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  };
  
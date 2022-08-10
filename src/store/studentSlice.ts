import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// slice to store the input student name

interface studentSliceState {
  studentName: string;
}

const initialState: studentSliceState = {
  studentName: "",
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<string>) => {
      state.studentName = action.payload;
    },
    removeStudentOnLogout: (state) => {
      state.studentName = "";
    },
  },
});

export const studentSliceReducer = studentSlice.reducer;
export const studentSliceActions = studentSlice.actions;

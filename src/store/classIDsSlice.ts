import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from ".";
import axios from "axios";
import { studentSliceActions } from "./studentSlice";

// slice to store loading state (while api call), logged in state
// and class ids which are fetched when student name is sent to the airtable

interface ClassIDsSliceState {
  classIDs: string[];
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface StudentRecords {
  records: Student[];
}

export interface StudentFields {
  Name: string;
  Classes: string[];
}

export interface Student {
  id: string;
  createdTime: string;
  fields: StudentFields;
}

const initialState: ClassIDsSliceState = {
  classIDs: [],
  isLoggedIn: false,
  isLoading: false,
};

const API_KEY = "key4gFSX1z7mgkSDa";
const BASE_URL = "https://api.airtable.com/v0/app8ZbcPx7dkpOnP0";

const classIDsSlice = createSlice({
  name: "classIDs",
  initialState,
  reducers: {
    getClassesForStudentName: (state, action: PayloadAction<string[]>) => {
      state.classIDs = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.classIDs = [];
    },
    setLoadingtoFalse: (state) => {
      state.isLoading = false;
    },
    setLoadingToTrue: (state) => {
      state.isLoading = true;
    },
  },
});

export const fetchClassIDs =
  (studentName: string): AppThunk =>
  async (dispatch) => {
    try {
      // remove the spaces in beginning and end of the input name
      let student: string = studentName.trim();

      // as airtable is case sensitive, capitalise the words(1 or more) in the student name
      let str: string[] = student.split(" ");
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substring(1);
      }
      let finalName: string = str.join(" ");

      // sending the final transformed student name
      const filterBy: string = `{Name}='${finalName}'`;

      // first api call
      // fetches the class ids when the student name is sent to airtable
      // example ,studentname is sent and ["classid","classid"] class ids are fetched and store in redux
      console.log("first api calling, to get classids for the given student");
      const response = await axios.get<StudentRecords>(
        `${BASE_URL}/students?filterByFormula=${filterBy}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      if (!response.data.records.length) {
        alert("Student is not found in any classes");
        // reset the student name in redux to empty
        dispatch(studentSliceActions.removeStudentOnLogout());

        // setting the loading state to false as api call is ended
        dispatch(classIDsActions.setLoadingtoFalse());
      } else {
        console.log(
          "response for 1st api",
          response.data.records[0].fields.Classes
        );

        // setting the classIds array to the redux store
        // ["classid","classid","classid"]
        dispatch(
          classIDsSlice.actions.getClassesForStudentName(
            response.data.records[0].fields.Classes
          )
        );
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

export const classIDsSliceReducer = classIDsSlice.reducer;
export const classIDsActions = classIDsSlice.actions;

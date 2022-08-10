import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from ".";
import axios from "axios";

// slice to store the the records containing the classnames for the classids and
// the list of students'ids in each classes

export interface StudentIDsSliceState {
  classData: Class[];
  studentObj: StudentObj;
}

interface StudentObj {
  [key: string]: string;
}

interface ClassesRecords {
  records: Class[];
}

export interface ClassFields {
  Name: string;
  Students: string[];
}

export interface Class {
  id: string;
  createdTime: string;
  fields: ClassFields;
}
// third api return type
export interface StudentRecords {
  records: Student[];
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

const initialState: StudentIDsSliceState = { classData: [], studentObj: {} };

const API_KEY = "key4gFSX1z7mgkSDa";
const BASE_URL = "https://api.airtable.com/v0/app8ZbcPx7dkpOnP0";

const studentIdsSlice = createSlice({
  name: "studentsIDs",
  initialState,
  reducers: {
    getClassNameWithStudentsIds: (state, action: PayloadAction<Class[]>) => {
      state.classData = action.payload;
    },
    getClassAndStudents: (state, action: PayloadAction<StudentObj>) => {
      state.studentObj = action.payload;
    },
  },
});

export const getClassesWithStudentsId =
  (classids: string[]): AppThunk =>
  async (dispatch) => {
    try {
      let filterString: string = "OR(";
      classids.forEach((id, index) => {
        let appendString = index === 0 ? "" : ",";
        filterString = filterString + appendString + `RECORD_ID()="${id}"`;
      });
      filterString += ")";
      console.log(
        "calling 2nd api for fetching the classnames with the array of student ids "
      );

      // second api call to send the array of classids ad fetching the records
      //  which has the list of the students in each class
      const response = await axios.get<ClassesRecords>(
        `${BASE_URL}/classes?filterByFormula=${filterString}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      console.log("response for 2nd api", response.data.records);
      dispatch(
        studentIdsSlice.actions.getClassNameWithStudentsIds(
          response.data.records
        )
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

export const getStudentForClasses =
  (names: string[]): AppThunk =>
  async (dispatch) => {
    try {
      // third api call to fetch the students' ids using class name
      // using classes field in students table
      let filterString: string = "";
      names.forEach((name, index) => {
        let appendString = index === 0 ? "" : ",";
        filterString =
          filterString + appendString + `or(FIND('${name}', {Classes}))`;
      });
      const filterBy: string = `OR(${filterString})`;
      console.log("third api fetching the students' name for studentid");
      const response = await axios.get<StudentRecords>(
        `${BASE_URL}/Students?filterByFormula=${filterBy}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      
      const studentObj: StudentObj = {};
      console.log("response for 3rd api", response.data);
      response.data.records.forEach((student) => {
        const studentName = student.fields.Name;
        studentObj[student.id] = studentName;
      });
      console.log(
        "studentid and student name as an object which is derived from third api response data",
        studentObj
      );
      dispatch(studentIdsSlice.actions.getClassAndStudents(studentObj));
    } catch (error: any) {
      alert(error.message);
    }
  };

export const studentIDsSliceReducer = studentIdsSlice.reducer;

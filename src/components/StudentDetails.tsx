import React, { useEffect } from "react";
import { FC } from "react";
import { StudentIDsSliceState } from "../store/studentIds";
import { classIDsActions } from "../store/classIDsSlice";
import { useAppDispatch } from "../store";
import { studentSliceActions } from "../store/studentSlice";
import classes from "./StudentDetails.module.css";
interface ClassObj {
  [key: string]: string[];
}
export const StudentDetails: FC<StudentIDsSliceState> = ({
  classData,
  studentObj,
}) => {
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(classIDsActions.logout());
    dispatch(studentSliceActions.removeStudentOnLogout());
  };

  let details: JSX.Element[] = classData.map((record) => (
    <div key={record.id} className={classes.card}>
      <h4>Class Name:</h4>
      <p>{record.fields.Name}</p>
      <h4>Students</h4>
      {record.fields.Students.map((student, index) => {
        if (index === record.fields.Students.length - 1) {
          return <span key={student}>{studentObj[`${student}`]}.</span>;
        } else {
          return <span key={student}>{studentObj[`${student}`]}, </span>;
        }
      })}
    </div>
  ));
  return (
    <>
      {/* dispalying the class name with list of students */}
      <header className={classes.header}>
        <h3>Student Details</h3>
        <button onClick={handleLogout}>Logout</button>
      </header>
      {details}
    </>
  );
};

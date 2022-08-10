import { useAppSelector, useAppDispatch } from "../store";
import { studentSliceActions } from "../store/studentSlice";
import { fetchClassIDs } from "../store/classIDsSlice";
import { classIDsActions } from "../store/classIDsSlice";
import classes from "./Login.module.css";
type Props = {};

export const Login = (props: Props) => {
  const dispatch = useAppDispatch();
  const studentName = useAppSelector((state) => state.studentInput.studentName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let studentName: string = e.target.value;
    dispatch(studentSliceActions.addStudent(studentName));
  };

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (studentName.trim().length >= 1) {
      dispatch(classIDsActions.setLoadingToTrue());
      dispatch(fetchClassIDs(studentName));
    } else {
      alert("Please enter valid name");
      dispatch(studentSliceActions.removeStudentOnLogout());
    }
  };

  return (
    <div className={classes.login}>
      <form onSubmit={handleSubmit}>
        <h3>Search Name here </h3>
        <input
          style={{
            padding: "7px",
            border: "1px solid grey",
            borderRadius: "4px",
          }}
          type="text"
          onChange={handleChange}
          value={studentName}
          placeholder="Enter student name"
        ></input>
        <div>
          <button
            style={{
              padding: "3px 17px",
              marginTop: "10px",
              border: "1px solid grey",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

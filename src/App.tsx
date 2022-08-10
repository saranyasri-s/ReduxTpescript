import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./store";
import { Login } from "./components/Login";
import {
  getClassesWithStudentsId,
  getStudentForClasses,
} from "./store/studentIds";
import "./App.css";
import { StudentDetails } from "./components/StudentDetails";
import { classIDsActions } from "./store/classIDsSlice";
import { callbackify } from "util";

function App() {
  const dispatch = useAppDispatch();
  // getting the store data
  const isLoggedIn = useAppSelector((state) => state.classIds.isLoggedIn);
  const classIDs = useAppSelector((state) => state.classIds.classIDs);
  const classDatawithStudentIds = useAppSelector(
    (state) => state.studentIdsandClassnames.classData
  );
  const studentObj = useAppSelector(
    (state) => state.studentIdsandClassnames.studentObj
  );
  const isLoading = useAppSelector((state) => state.classIds.isLoading);

  useEffect(() => {
    if (isLoggedIn && classIDs.length >= 1) {
      // when the 1st api call gets the classids, dispatching the action creator for 2nd api call

      dispatch(getClassesWithStudentsId(classIDs));
    }
  }, [isLoggedIn, classIDs, dispatch]);
  useEffect(() => {
    if (classDatawithStudentIds.length >= 1) {
      const classNames = classDatawithStudentIds.map(
        (classVal) => classVal.fields.Name
      );

      // when the 2nd api call gets the classes with list of student ids in each class,
      // dispatching the action creator for 3rd api call(to get the student name for student ids)

      dispatch(getStudentForClasses(classNames));
    }
  }, [dispatch, classDatawithStudentIds]);

  useEffect(() => {
    // set the isLoading state to false once the data is fetched
    dispatch(classIDsActions.setLoadingtoFalse());
  }, [classDatawithStudentIds, dispatch]);

  return (
    <div className="App">
      {!isLoggedIn ? <Login></Login> : null}
      {isLoading ? <p>Loading...</p> : null}
      {!!classDatawithStudentIds.length &&
        Object.keys(studentObj).length > 0 &&
        isLoggedIn && (
          <StudentDetails
            classData={classDatawithStudentIds}
            studentObj={studentObj}
          />
        )}
    </div>
  );
}

export default App;

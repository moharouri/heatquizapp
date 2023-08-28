import React, { useContext, useEffect } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import { getAllCourses, getCourse, getMyCourses } from "../services/Courses"
import { useDatapools } from "./DatapoolsContext"

const Context = React.createContext()

export function useCourses(){
    return useContext(Context)
}

export function CoursesProvider ({children}){
    
    //Fetch courses from API
    const {loading: loadingCourses, value: courses, error: getCoursesError, execute: getCourses} = useAsyncFn(() => getAllCourses())
    const {loading: loadingMyCourses, value: myCourses, error: getMyCoursesError, execute: getOwnedCourses} = useAsyncFn(() => getMyCourses())
    const {loading: loadingCourse, value: Course, error: getCourseError, execute: getCourseView} = useAsyncFn((Id) => getCourse(Id))

    const {selectedDatapool} = useDatapools()

    useEffect(() => {
        getOwnedCourses()
    }, [selectedDatapool])

    return(
        <Context.Provider value = {{
            loadingCourses,
            courses,
            getCoursesError,
            getCourses, 

            loadingMyCourses,
            myCourses,
            getMyCoursesError,
            getOwnedCourses,

            loadingCourse,
            getCourseError,
            Course,
            getCourseView
        }}>
            {children}
        </Context.Provider>
    )
}
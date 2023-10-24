import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { Route, Routes } from "react-router-dom";
import { MapPlay } from "./Pages/CoursePages/Maps/Play";
import { Login } from "./Pages/Login";
import { Dashboard } from "./Pages/Dashboard";
import { Settings } from "./Pages/Settings";
import { ProfilePage } from "./Pages/ProfilePage";
import { Courses } from "./Pages/CoursePages/Courses";
import { CourseView } from "./Pages/CoursePages/CourseView";
import { StudentFeedback } from "./Pages/StudentFeedback";
import { Reports } from "./Pages/Reports";
import { Topics } from "./Pages/Topics";
import { ClickTrees } from "./Pages/ClickTrees";
import { InterpretedTrees } from "./Pages/InterpretedTrees";
import { QuestionList } from "./Pages/Questions/List";
import { SeriesList } from "./Pages/Series/List";
import { PlaySeriesPage } from "./Pages/Series/Play";
import { SeriesEditViewPage } from "./Pages/Series/EditView";
import { NotFoundPage } from "./Pages/StatusPages/NotFoundPage";
import { LevelOfDifficulty } from "./Pages/LevelOfDifficulty";
import { Datapools } from "./Pages/Datapools";
import { QuestionEditView} from "./Pages/Questions/Shared/QuestionEditView";
import { AddMutlipleChoiceQuestion } from "./Pages/Questions/MultipleChoiceQuestion/Add";
import { AddKeyboardQuestion } from "./Pages/Questions/KeyboardQuestion/Add";
import { AddSeries } from "./Pages/Series/Add";
import { AddMap } from "./Pages/CoursePages/Maps/Add";
import { MapEditView } from "./Pages/CoursePages/Maps/EditView";

export function SelectRoutes({}){
    const {roles, isStudent,} = useAuth()

    const isAdmin = roles.includes('admin')
    const isNormalUser = roles.includes('course_editor')

    if(isStudent) 
    {
        return(
            <Routes>
                <Route path="/Login" exact element={<Login />}/>
                <Route path="/" exact element={<Dashboard />}/>
                <Route path="/playcoursemap/:id" element={<MapPlay />}/>
                <Route path="*" exact element={<NotFoundPage />}/>
            </Routes>
        )
    }
    else if(isAdmin){
        return(
            <Routes>
                <Route path="/Login" exact element={<Login />}/>
                <Route path="/" exact element={<Dashboard />}/>
                <Route path="/level_of_difficulty" exact element={<LevelOfDifficulty />}/>
                <Route path="/datapools" exact element={<Datapools />}/>
                <Route path="*" exact element={<NotFoundPage />}/>
            </Routes>
        )
    }
    //else if (isNormalUser)
    //{
        return(
            <Routes>
                <Route path="/Login" exact element={<Login />}/>
                <Route path="/" exact element={<Dashboard />}/>

                <Route path="/settings" element={<Settings />}/>
                
                <Route path="/profile" element={<ProfilePage />}/>

                <Route path="/courses" element={<Courses />}/>
                <Route path="/viewcourse/:id" exact element={<CourseView />}/>
                <Route path="/playcoursemap/:id" element={<MapPlay />}/>
                <Route path="/add_map" element={<AddMap />}/>
                <Route path="/edit_view_map/:id" element={<MapEditView />}/>

                <Route path="/feedback" element={<StudentFeedback />}/>

                <Route path="/reports" element={<Reports />}/>

                <Route path="/topics" element={<Topics />}/>

                <Route path="/click_trees" element={<ClickTrees />}/>
                <Route path="/interpreted_trees" element={<InterpretedTrees />}/>

                <Route path="/questions_list" element={<QuestionList />}/>
                <Route path="/question_view_edit/:id/:type" element={<QuestionEditView />}/>

                <Route path="/add_series" element={<AddSeries />}/>
                <Route path="/series_list" element={<SeriesList />}/>
                <Route path="/series_play/:id" element={<PlaySeriesPage />}/>
                <Route path="/series_edit_view/:code" element={<SeriesEditViewPage />}/>
                
                <Route path="/add_mc_q" element={<AddMutlipleChoiceQuestion />}/>
                <Route path="/add_k_q" element={<AddKeyboardQuestion />}/>

                <Route path="*" exact element={<NotFoundPage />}/>
            </Routes>
        )
    //}

    return(
        <Routes>
            <Route path="*" exact element={<NotFoundPage />}/>
        </Routes>
    )
}
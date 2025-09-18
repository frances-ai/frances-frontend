import './App.css';
import StatsAPI from './apis/stats'
import {Route, Routes, useLocation} from "react-router-dom";
import RegisterPage from "./pages/register";
import React, {useEffect} from 'react';
import LoginPage from "./pages/login";
import {AuthProvider} from "./contexts/authProvider";
import RequireAuth from "./components/requireAuth";
import DefoeQueryPage from "./pages/defoeQuery";
import HeaderLayout from "./pages/headerLayout";
import CollectionDetailsPage from "./pages/collectionDetails";
import DefoeQueryResult from "./pages/defoeQueryResult";
import DefoeQueryTasksPage from "./pages/defoeQueryTasks";
import CollectionDetailResult from "./pages/collectionDetailResult";
import SearchPage from "./pages/search";
import SearchResultPage from "./pages/searchResult";
import ArticleTermRecord from "./pages/records/articleTermRecord.jsx";
import PageRecordPage from "./pages/records/pageRecord";
import TopicTermRecord from "./pages/records/topicTermRecord.jsx";
import LocationRecord from "./pages/records/locationRecord";
import BroadsideRecord from "./pages/records/broadsideRecord.jsx";

function App() {

    const update = localStorage.getItem("update-v2.1.3");
    if (!update) {
        localStorage.clear();
        localStorage.setItem("update-v2.1.3", "0");
    }

    const location = useLocation();

    useEffect(() => {
        StatsAPI.add_visit(location.pathname).then(res => {
            console.log(res)
        }).catch(reason => {
            console.log(reason)
        }) // Track the visit with the current path
    }, [location.pathname]);
    
    return (
        <AuthProvider>
            <Routes>
                <Route
                    element={<HeaderLayout />}
                    path="/"
                >
                    <Route
                        element={<SearchPage />}
                        index
                    />

                    <Route
                        element={<SearchPage />}
                        path="search"
                    />

                    <Route
                        element={<SearchResultPage />}
                        path="searchResult"
                    />

                    <Route path="collectionDetails">
                        <Route
                            element={<CollectionDetailsPage />}
                            index
                        />

                        <Route
                            element={<CollectionDetailResult />}
                            path="detail"
                        />
                    </Route>

                    <Route path="hto">
                        <Route
                            element={<ArticleTermRecord />}
                            path="ArticleTermRecord/:termId"
                        />

                        <Route
                            element={<TopicTermRecord />}
                            path="TopicTermRecord/:termId"
                        />

                        <Route
                            element={<LocationRecord />}
                            path="LocationRecord/:recordId"
                        />

                        <Route
                            element={<PageRecordPage />}
                            path="Page/:pageId"
                        />

                        <Route
                            element={<BroadsideRecord />}
                            path="Broadside/:recordId"
                        />
                    </Route>
        
                    {/* Protected routes */}
                    <Route
                        element={
                            <RequireAuth>
                                <DefoeQueryPage />
                            </RequireAuth>
}
                        path="defoeQuery"
                    />

                    <Route
                        element={
                            <RequireAuth>
                                <DefoeQueryResult />
                            </RequireAuth>
}
                        path="defoeQueryResult"
                    />

                    <Route
                        element={
                            <RequireAuth>
                                <DefoeQueryTasksPage />
                            </RequireAuth>
}
                        path="defoeQueryTasks"
                    />
                </Route>
        
                <Route
                    element={<LoginPage />}
                    path="login"
                />

                <Route
                    element={<RegisterPage />}
                    path="register"
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;

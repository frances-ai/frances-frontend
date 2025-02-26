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
import ArticleTermRecord from "./pages/records/ArticleTermRecord";
import PageRecordPage from "./pages/records/pageRecord";
import TopicTermRecord from "./pages/records/TopicTermRecord";

function App() {

    const update = localStorage.getItem("update-v2.1.2");
    if (!update) {
        localStorage.clear();
        localStorage.setItem("update-v2.1.2", "0");
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
              <Route path="/" element={<HeaderLayout/>}>
                  <Route index element={<SearchPage/>} />
                  <Route path="search" element={<SearchPage/>} />
                  <Route path="searchResult" element={<SearchResultPage/>} />
                  <Route path="collectionDetails">
                      <Route index element={<CollectionDetailsPage/>} />
                      <Route path="detail" element={<CollectionDetailResult/>} />
                  </Route>
                  <Route path="hto">
                      <Route path="ArticleTermRecord/:termId" element={<ArticleTermRecord/>} />
                      <Route path="TopicTermRecord/:termId" element={<TopicTermRecord/>} />
                      <Route path="Page/:pageId" element={<PageRecordPage/>} />
                  </Route>

                  {/* Protected routes */}
                  <Route path="defoeQuery" element={
                      <RequireAuth>
                          <DefoeQueryPage />
                      </RequireAuth>}
                  />
                  <Route path="defoeQueryResult" element={
                      <RequireAuth>
                          <DefoeQueryResult />
                      </RequireAuth>}
                  />
                  <Route path="defoeQueryTasks" element={
                      <RequireAuth>
                          <DefoeQueryTasksPage />
                      </RequireAuth>}
                  />
              </Route>

              <Route path="login" element={<LoginPage/>} />
              <Route path="register" element={<RegisterPage/>} />
          </Routes>
      </AuthProvider>
  );
}

export default App;

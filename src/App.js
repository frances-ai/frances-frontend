import './App.css';
import {Route, Routes} from "react-router-dom";
import TermSearchPage from "./pages/termSearch";
import RegisterPage from "./pages/register";
import React from 'react';
import LoginPage from "./pages/login";
import {AuthProvider} from "./contexts/authProvider";
import RequireAuth from "./components/requireAuth";
import TermSimilarityPage from "./pages/termSimilarity";
import DefoeQueryPage from "./pages/defoeQuery";
import HeaderLayout from "./pages/headerLayout";
import ResultPage from "./pages/result";
import TopicModellingPage from "./pages/topicModelling";
import CollectionDetailsPage from "./pages/collectionDetails";
import DefoeQueryResult from "./pages/defoeQueryResult";
import DefoeQueryTasksPage from "./pages/defoeQueryTasks";
import CollectionDetailResult from "./pages/collectionDetailResult";

function App() {

    const update = localStorage.getItem("update-v3");
    if (!update) {
        localStorage.clear();
        localStorage.setItem("update-v3", "0");
    }


  return (
      <AuthProvider>
          <Routes>
              <Route path="/" element={<HeaderLayout/>}>
                  <Route index element={<TermSearchPage/>} />
                  <Route path="termSearch" element={<TermSearchPage/>} />
                  <Route path="termSimilarity" element={<TermSimilarityPage/>} />
                  <Route path="topicModelling" element={<TopicModellingPage/>} />
                  <Route path="result" element={<ResultPage/>} />
                  <Route path="/collectionDetails">
                      <Route index element={<CollectionDetailsPage/>} />
                      <Route path="detail" element={<CollectionDetailResult/>} />
                  </Route>
                  {/* Protected routes */}
                  <Route path="/defoeQuery" element={
                      <RequireAuth>
                          <DefoeQueryPage />
                      </RequireAuth>}
                  />
                  <Route path="/defoeQueryResult" element={
                      <RequireAuth>
                          <DefoeQueryResult />
                      </RequireAuth>}
                  />
                  <Route path="/defoeQueryTasks" element={
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

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
import SearchPage from "./pages/search";
import SearchResultPage from "./pages/searchResult";
import ArticleTermRecord from "./pages/records/ArticleTermRecord";
import PageRecordPage from "./pages/records/pageRecord";
import TopicTermRecord from "./pages/records/TopicTermRecord";

function App() {

    const update = localStorage.getItem("update-v0");
    if (!update) {
        localStorage.clear();
        localStorage.setItem("update-v0", "0");
    }


  return (
      <AuthProvider>
          <Routes>
              <Route path="/" element={<HeaderLayout/>}>
                  <Route index element={<SearchPage/>} />
                  <Route path="search" element={<SearchPage/>} />
                  <Route path="termSearch" element={<TermSearchPage/>} />
                  <Route path="termSimilarity" element={<TermSimilarityPage/>} />
                  <Route path="topicModelling" element={<TopicModellingPage/>} />
                  <Route path="result" element={<ResultPage/>} />
                  <Route path="searchResult" element={<SearchResultPage/>} />
                  <Route path="/collectionDetails">
                      <Route index element={<CollectionDetailsPage/>} />
                      <Route path="detail" element={<CollectionDetailResult/>} />
                  </Route>
                  <Route path="hto">
                      <Route path="ArticleTermRecord/:termId" element={<ArticleTermRecord/>} />
                      <Route path="TopicTermRecord/:termId" element={<TopicTermRecord/>} />
                      <Route path="Page/:pageId" element={<PageRecordPage/>} />
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

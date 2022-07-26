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

function App() {
  return (
      <AuthProvider>
          <Routes>
              <Route path="/" element={<HeaderLayout/>}>
                  <Route index element={<TermSearchPage/>} />
                  <Route path="termSearch" element={<TermSearchPage/>} />
                  <Route path="termSimilarity" element={<TermSimilarityPage/>} />
                  <Route path="result" element={<ResultPage/>} />
                  {/* Protected routes */}
                  <Route path="/defoeQuery" element={
                      <RequireAuth>
                          <DefoeQueryPage />
                      </RequireAuth>
                  } />
              </Route>

              <Route path="login" element={<LoginPage/>} />
              <Route path="register" element={<RegisterPage/>} />
          </Routes>
      </AuthProvider>
  );
}

export default App;

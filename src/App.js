import './App.css';
import {Route, Routes} from "react-router-dom";
import TermSearchPage from "./pages/termSearch";
import RegisterPage from "./pages/register";
import React from 'react';
import LoginPage from "./pages/login";
import {AuthProvider} from "./contexts/authProvider";
import RequireAuth from "./components/requireAuth";
import PrivatePage from "./pages/privatePage";
import TermSimilarityPage from "./pages/termSimilarity";
import DefoeQueryPage from "./pages/defoeQuery";

function App() {
  return (
      <AuthProvider>
          <Routes>
              <Route path="/" element={<TermSearchPage/>} />
              <Route path="/termSearch" element={<TermSearchPage/>} />
              <Route path="login" element={<LoginPage/>} />
              <Route path="register" element={<RegisterPage/>} />
              <Route path="termSimilarity" element={<TermSimilarityPage/>} />

              {/* Protected routes */}
              <Route path="/protected" element={
                  <RequireAuth>
                      <PrivatePage/>
                  </RequireAuth>
              } />
              <Route path="/defoeQuery" element={
                  <RequireAuth>
                      <DefoeQueryPage />
                  </RequireAuth>
              } />
          </Routes>
      </AuthProvider>
  );
}

export default App;

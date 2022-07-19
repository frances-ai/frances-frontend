import './App.css';
import {Route, Routes} from "react-router-dom";
import TermSearchPage from "./pages/termSearch";
import RegisterPage from "./pages/register";
import React from 'react'
import LoginPage from "./pages/login";
import {AuthProvider} from "./contexts/authProvider";
import RequireAuth from "./components/requireAuth";
import PrivatePage from "./pages/privatePage";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
      <AuthProvider>
          <Routes>
              <Route path="/" element={<TermSearchPage/>} />
              <Route path="login" element={<LoginPage/>} />
              <Route path="register" element={<RegisterPage/>} />

              {/* Protected routes */}
              <Route element={<PersistLogin/>}>
                  <Route path="/protected" element={
                      <RequireAuth>
                          <PrivatePage/>
                      </RequireAuth>
                  } />
              </Route>
          </Routes>
      </AuthProvider>
  );
}

export default App;

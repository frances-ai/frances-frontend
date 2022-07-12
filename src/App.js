import './App.css';
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import TermSearchPage from "./pages/termSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TermSearchPage/>} />
        <Route path="/termSearch" element={<TermSearchPage/>} />
        <Route path="/login" element={<TermSearchPage/>} />
        <Route path="/register" element={<TermSearchPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

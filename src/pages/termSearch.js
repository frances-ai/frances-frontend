import React from "react";
import {Link} from "react-router-dom";

function TermSearchPage() {

    return <div className="nav">
        <Link to={"/login"}>Login</Link>
        <Link to={"/register"}>Register</Link>
        <Link to={"/protected"}>Private Page</Link>
    </div>
}

export default TermSearchPage
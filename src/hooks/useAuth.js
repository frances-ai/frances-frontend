import AuthContext from "../contexts/authProvider";
import {useContext} from "react";

// Authentication Example from: https://reactrouter.com/docs/en/v6/examples/auth
function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;
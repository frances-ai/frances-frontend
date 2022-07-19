import useAuth from "../hooks/useAuth";
import {useLocation, Navigate} from "react-router-dom";

// Authentication Example from: https://reactrouter.com/docs/en/v6/examples/auth
function RequireAuth({ children }) {
    const {auth} = useAuth();
    const location = useLocation();

    console.log(auth)

    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return auth?.user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default RequireAuth;
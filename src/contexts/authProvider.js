import {createContext, useState} from "react";

const AuthContext = createContext();

// Authentication Example from: https://reactrouter.com/docs/en/v6/examples/auth
export function AuthProvider({children}) {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
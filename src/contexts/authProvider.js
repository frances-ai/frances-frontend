import {createContext, useState} from "react";
import AuthAPI from "../apis/auth"

const AuthContext = createContext({});

export function AuthProvider({children}) {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
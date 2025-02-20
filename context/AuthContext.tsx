import { IUser } from "@/types/types";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

interface IAuthContext {
    user: IUser | null; 
    setAuth?: (newAuthUser: IUser | null) => void;
    setUserData?: (userData:IUser) => void;
}

const AuthContext = createContext<IAuthContext>({
    user: null,    
})


export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser | null>(null)
    const setAuth = (newAuthUser: IUser | null):void => {
        setUser(newAuthUser)
    }
    const setUserData = (userData:IUser) => {
        setUser({...userData})
    }
    return (
        <AuthContext.Provider value={{user, setAuth, setUserData}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
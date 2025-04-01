'use client';

import { onAuthStateChanged } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase.config";


interface UserIdContextType {
    user_id: string | null;
}

const UserIdContext = createContext<UserIdContextType>({ user_id: null });

export const UserIdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user_id, setUser_id] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                const userId = user.uid;
                setUser_id(userId);
            } else {
                setUser_id(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <UserIdContext.Provider value={{ user_id }}>
            {children}
        </UserIdContext.Provider>
    );
};

export const useUserId = (): UserIdContextType => useContext(UserIdContext);
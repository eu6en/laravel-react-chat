import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserResource } from "@/Types/Controllers/UserController";

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {

        // Do not fetch user data on the login page
        if (location.pathname === '/login') {
            return;
        }

        // Fetch the current logged-in user data
        axios.post('/api/user')
            .then(response => {
                const userData = response.data as UserResource;
                setUser(userData);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    // User is not logged in
                    setUser(null);
                } else {
                    setError(new Error('Error fetching user: ' + error.message));
                }
            });
    }, []);

    if (error) { throw error; }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    );
};

// This will return a { user } object with fileds like id, name, email etc., which can be used in any component that is wrapped in the UserProvider
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

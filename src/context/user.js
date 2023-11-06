// Import all the necessary React functions and axios.
import { createContext, useState, useCallback } from "react";
import axios from "axios";

// Use createContext to create UserContext.
const UserContext = createContext();

// The Provider component is the top most component, and it will display the context that the other components need to use.
function Provider({ children }) {
    const [user, setUser] = useState({}); // Create and initialize the state variable user. It will start as an empty array.

    // Use a GET request to fetch the user's information based on id and password.
    const fetchUser = async (userId, password) => {
        // Use template literal as well as async/await syntax to make the GET request.
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users?userid=${userId}&password=${password}`);

        if (response.data.length === 1) { // If there is exactly one user object returned...
            setUser(response.data[0]); // Set the user state variable to that object.
        } else {
            setUser(null); // Otherwise, set the user state variable to null.
        }
    };

    // The resetUser function will be run when the user logs out.
    const resetUser = () => {
       setUser(null); // Simply change the user state variable to null.
    };

    const createUser = async (newUser) => {
        // Make a POST request to json-sever (and wait for it) that adds a new user.
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users`, {
            name: newUser.name,
            userid: newUser.userid,
            email: newUser.email,
            password: newUser.password,
        });
        const updatedUsers = [
            ...user, // Copy the user array, then...
            response.data // ...Take the data from the response (the new user) and add it to the copy of the users array.
        ];

        setUser(updatedUsers);
    };

    const editUserById = async (id, updatedUser) => {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, { // Use async/await and template literal syntax to make a PUT request to json-server.
            name: updatedUser.name,
            userid: updatedUser.userid,
            email: updatedUser.email,
            password: updatedUser.password,
        });

        // Update the user array by creating a new one using the map function.
        const updatedUsers = user.map((user) => {
            if (user.id === id) { // If we find the user with the id that we want...
                return { ...user, ...response.data }; 
                /* ...Use a copy of response.data and add it to a copy of the specific user object. This ensures the user state array will 
                display the current properties. Also, it would appear that the user's information will appear twice, but the oldest info will 
                be removed. */
            }

            // If the id of the user doesn't match up, just return the user.
            return user;
        });

        // Update the user state variable with the updated users. 
        setUser(updatedUsers);
    };

    // "share" is the object that will be shared through context.
    const share = {
        user,
        fetchUser,
        resetUser,
        createUser,
        editUserById,
    }

    /* Return the JSX that contains the UserContext provider. It receives the "share" object as a prop from the top level Provider.
    Now, any child component has access to the contents of the "share" object through context. */
    return (
        <UserContext.Provider value={share}>
            {children}
        </UserContext.Provider>
    );
}

export { Provider }; // Export the Provider component as a named export.
export default UserContext; // Also, export UserContext as the default export.
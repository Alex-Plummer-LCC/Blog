// Import all the necessary React functions and axios.
import { createContext, useState, useCallback } from "react";
import axios from "axios";

// Use createContext to create UserContext.
const UserContext = createContext();

// The Provider component is the top most component, and it will display the context that the other components need to use.
function Provider({ children }) {
    const [user, setUser] = useState(null); // Create and initialize the state variable user. It will start as null.

    // Use a GET request to fetch the user's information based on id and password.
    const fetchUser = useCallback(async (userId, password) => {
        // Use template literal as well as async/await syntax to make the GET request.
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users?userid=${userId}&password=${password}`);
        if (response.data.length === 1) { // If there is exactly one user object returned...
            setUser(response.data[0]); // Set the user state variable to that object.
        } else {
            setUser(null); // Otherwise, set the user state variable to null.
        }

        return response.data[0]; // Return the user object so it can be used by other functions.

    }, []);

    // The resetUser function will be run when the user logs out.
    const resetUser = () => {
       setUser(null); // Simply change the user state variable to null.
    };

    // Make a request to create a new user, given the new user's information.
    const createUser = async (newUser) => {
        // Make a POST request to json-sever (and wait for it) that adds a new user.
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users`, {
            name: newUser.name,
            userid: newUser.userid,
            email: newUser.email,
            password: newUser.password,
        });

        // Set the user to the data returned from the response.
        setUser(response.data);
    };

    // Make a request to change the user's information, given their id and the new information.
    const editUserById = async (id, updatedUserInfo) => {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, updatedUserInfo); // Use async/await and template literal syntax to make a PUT request to json-server.
        const editedUser = response.data;
        setUser(editedUser);
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
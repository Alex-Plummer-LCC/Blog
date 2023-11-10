// Import the necessary React functions as well as the contexts.
import { useContext, useState } from "react";
import UserContext from "../context/user";
import PostsContext from "../context/posts";

// The LoginForm component receives an onSubmit prop from its parent NavBar.js.
function LoginForm({ onSubmit }) {
    // Create state variables for the userid and password. They will start as empty strings.
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    // Create another state variable for a possible error (when fetching). It will be initialized to false.
    const [error, setError] = useState(false);

    // Grab the fetch functions from context that the LoginForm component needs.
    const { fetchUser } = useContext(UserContext);
    const { fetchPosts } = useContext(PostsContext);

    // handleSubmit will take the appropriate actions when the user submits the login form.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Stop the form from being sent to the server.
        const tempUser = await fetchUser(userid, password); // Attempt to fetch the user, and wait for the result.
        if (tempUser === null || tempUser === undefined) { // If the temporary user is null or undefined...
            setError(true); // Set the error to true, as there was an error with fetching.
        } else {
            /* If the login is successful, fetch the user's posts, reset the id and password, and call the onSubmit function, which 
            closes the form (onSubmit originates as handleLoginSubmit in NavBar.js). */
            fetchPosts(tempUser.id);
            setUserid("");
            setPassword("");
            onSubmit();
        };
    };

    // Return the JSX for the form, including all event handlers and class names. Both input elements are controlled.
    return (
        <form onSubmit={handleSubmit}>
            {error && <div>There was an error fetching the user information!</div>}
            <input className="loginInfo" id="userid" type="text" value={userid}
                onChange={(event) => { setUserid(event.target.value); }}
                placeholder="user id" />
            <input className="loginInfo" id="password" type="text" value={password}
                onChange={(event) => { setPassword(event.target.value); }}
                placeholder="password" />
            <button type="submit" className="login" onClick={handleSubmit}>Login</button>
        </form>
    );
};

export default LoginForm;
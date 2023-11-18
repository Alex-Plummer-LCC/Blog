// Import the necessary React functions, the user context, and the child component LoginForm.
import { useContext, useState } from "react";
import UserContext from "../context/user";
import LoginForm from "./LoginForm";
// Also, import Link from react-router-dom.
import { Link } from "react-router-dom";

function NavBar() {
    // Create a state variable showLogin. Initialize it to false - we don't want to show the login form right away.
    const [ showLogin, setShowLogin ] = useState(false);
    // Since the NavBar component displays content related to logging in, it needs access to the user and resetUser from UserContext.
    const { user, resetUser } = useContext(UserContext);

    // handleClick will toggle whether the login form is shown, or log the user out.
    const handleClick = () => {
        // If the login form is not shown and there's no user logged in, show the login form.
        if (showLogin === false && !user) {
            setShowLogin(true);
        }
        // If the login form is shown and there's no user logged in, close the login form.
        else if (showLogin === true && !user) {
            setShowLogin(false);
        // Otherwise, just log the user out.
        } else {
            resetUser();
        }
    }

    // handleLoginSubmit simply hides the login form. It is called upon submission of the login form.
    const handleLoginSubmit = () => {
        setShowLogin(false);
    }

    // From lines 42 to 54, return the JSX for the navbar. Anchor elements are now React Router <Link> elements.
    /* I used the justify-content-between class to separate the title of the application and the login/user information. 
    I went to this site for help with that: https://getbootstrap.com/docs/4.0/utilities/flex/#align-self */

    // I used "pic" instead of "picture" to avoid the eslint warning.
    /* (Line 51) - I added the condition !showLogin when determining whether to show the login button or not. Without this condition, 
    two login buttons (one here, one in LoginForm.js) would show while logging in. */
    return (
        <div className="navbar d-flex align-items-center justify-content-between">
            <div>
                <Link to="/">Alex Plummer Blogging Application</Link>
            </div>
            <div>
                {user && <img src={`data:image/png;base64, ${user.image}`} alt="User's profile pic." height="100px"/>}
                {user && <Link className="userActions" to="/posts/new">New Post</Link>}
                {user && <Link className="userActions" to="/user">Edit User Profile</Link>}
                {user && <button className="userActions" onClick={handleClick}>Logout</button>}
                {!user && !showLogin && <button className="login" onClick={handleClick}>Login</button>}
                {showLogin && <LoginForm onSubmit={handleLoginSubmit}></LoginForm>}
            </div>
        </div>
    );

};

export default NavBar;
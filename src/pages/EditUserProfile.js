import { useContext } from "react";
import UserContext from "../context/user";

function EditUserProfile() {
    // Get the user from userContext so the EditUserProfile component can display some info about them.
    const { user } = useContext(UserContext);

    // This is a placeholder heading that includes the user's id and email.
    return <h1>This is the edit user profile page. The current user is {user.userid} and their email is {user.email}.</h1>;
}

export default EditUserProfile;
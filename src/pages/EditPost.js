import { useParams } from "react-router-dom";

function EditPost() {
    /* Try to get the id from the route using the built-in (to React Router) function useParams. It may be null (if the user is creating
    a new post). */
    const { id } = useParams();

    /* If the id is not null, the user is editing a post with an existing id. Otherwise, they are adding a new one (with no id, yet).
    Use the ternary operator to display the appropriate placeholder heading. */
    return (
        <div> 
            {(id) ? <h1>This is the edit post page</h1> : <h1>This is the new post page.</h1>}
        </div> 
        );
};

export default EditPost;
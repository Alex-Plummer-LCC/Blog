// Import the Boostrap icons.
import { Trash } from "react-bootstrap-icons";
import { BsFillGearFill } from "react-icons/bs";

// Import the useContext function and the two contexts the PostCard component needs to use.
import { useContext } from "react";
import UserContext from "../context/user";
import PostsContext from "../context/posts";
// Import parse from html-react-parser. It will be used to parse the HTML for the beginning of a post.
import parse from "html-react-parser";

// The PostCard component receives the post object from its parent PostList as a prop.
function PostCard({ post }) {
    // The PostCard component needs access to the user from UserContext and deletePostById from PostsContext.
    const { user } = useContext(UserContext);
    const { deletePostById } = useContext(PostsContext);

    // When the user clicks on the delete icon, call deletePostById and pass in the id.
    const handleDeleteClick = () => {
        deletePostById(post.id);
    };

    // Create a new date object for the post.
    const date = new Date(post.datetime);

    /* Return the JSX for the card, including edit, delete, and Read More links. The edit and delete links only work if the user who
    made the post is logged in. This is very similar to the JSX here: https://classes.lanecc.edu/mod/forum/discuss.php?d=947939. 
    The <Link> elements have been changed to <a> elements, I changed the href to # for the elements that link to pages that don't exist yet, 
    and I changed the "...more" link text to "Read More". */
    return (
        <div className="col">
            <div className="card">
                <img alt="Post" src={`data:image/png;base64, ${post.image}`} />
                <div className="card-body">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="border rounded border-primary p-1 text-primary">{post.category}</div>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="me-2 mt-2">
                                {(user && user.id === post.userId) ? <a href="#" state={post}>
                                    <BsFillGearFill color="black" />
                                </a> : ""}
                            </div>
                            <div>{(user && user.id === post.userId) ? <button className="btn btn-link" onClick={handleDeleteClick}>
                                <Trash color="red" />
                            </button> : ""}
                            </div>
                        </div>
                    </div>
                    <h5 className="card-title text-center">{post.title}</h5>
                    <div className="card-text">{parse(post.content.substring(0, 100))}
                        <a href="#" state={post}>Read More</a>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="text-muted small">
                        {post.user.name} in {date.toLocaleDateString("en-us", { year: "numeric", month: "short" })}
                    </div>
                </div>

            </div>
        </div>
    );

};

export default PostCard;
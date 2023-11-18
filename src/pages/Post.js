// Import the useLocation function, the PostHeader component, and the parse function.
import { useLocation } from "react-router-dom";
import PostHeader from "../components/PostHeader";
import parse from "html-react-parser";

function Post() {
    // Get the location object using useLocation.
    const location = useLocation();
    // location.state will be the post because it was included as the state prop in the Link in the PostCard component.
    const post = location.state;

    // Return JSX for the post, which will be the PostHeader component and the content of the post (parsed into JSX from HTML).
    // I added some extra styling to the div containing the post as well as the post category.
    return (
        <div className="post">
            <PostHeader post={post}></PostHeader>
            <div className="m-2">{parse(post.content)}</div>
        </div>
    );
};

export default Post;
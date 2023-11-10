// Import the useContext function, the two contexts, and the child component PostCard.
import { useContext } from "react";
import UserContext from "../../src/context/user";
import PostsContext from "../../src/context/posts";
import PostCard from "./PostCard";

// The PostList component will render the cards for each individual post.
function PostList() {
    // The PostList component will need access to the user from UserContext as well as the posts and featuredPosts from PostsContext.
    const { user } = useContext(UserContext);
    const { posts, featuredPosts } = useContext(PostsContext);

    // Display the user's posts if they're logged in, or the featuredPosts if they're not.
    // I needed a reminder on the ternary operator so I went here: https://www.w3schools.com/jsref/jsref_operators.asp.
    const postsToRender = (user) ? posts : featuredPosts;

    // Map postsToRender into PostCard instances. They will receive the post's id as a key prop and the whole post object as a post prop.
    const renderedPosts = postsToRender.map((post) => {
        return <PostCard key={post.id} post={post} />
    });

    // Return JSX containing the rendered posts. The div's classes ensure that the posts line up side-by-side.
    return <div className="posts row row-cols-1 row-cols-md-3">{renderedPosts}</div>;
};

export default PostList;
// Import the useContext function, the UserContext, and the Header/PostList components.
import { useContext } from "react";
import UserContext from "../../src/context/user";
import Header from "../components/Header";
import PostList from "../components/PostList";

function Home() {
    // The Home component needs access to the user so it knows what to render.
    const { user } = useContext(UserContext);

    /* Return the JSX for the home page, including Header and PostList components. If there is no user
    logged in, "Featured Posts" will be displayed. If there is a user logged in, "My Posts" will be displayed. */
    return (
        <div className="home">
            <Header>
            </Header>
            <div className="headings">
                {!user && <h1>Featured Posts</h1>}
                {user && <h1>My Posts</h1>}
            </div>
            <PostList></PostList>
        </div>
    ); 
};

export default Home;


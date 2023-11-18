// Import the necessary React functions as well as the two contexts.
import { useContext, useEffect } from "react";
import UserContext from "./context/user";
import PostsContext from "./context/posts";

// Import all of the React Router functions. Also, import all of the child components the App will need to render.
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import EditUserProfile from "./pages/EditUserProfile";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import NoPage from "./pages/NoPage";

function App() {
    // Get the location object using useLocation.
    const location = useLocation();

    /* I had an error on this line saying the object wasn't iterable. I eventually figured out by going here (https://dmitripavlutin.com/javascript-object-destructuring/#2-extracting-a-property)
    that I was using square brackets when I needed to use curly braces. */
    const { fetchFeaturedPosts, fetchCategories } = useContext(PostsContext);

    // Get the user out of user context. We need to know whether the user is logged in so we can display the proper components.
    const { user } = useContext(UserContext);

    // Use the useEffect function to ensure that the two fetch functions are only called on the first render (more on that below).
    useEffect(() => {
        fetchFeaturedPosts();
        fetchCategories();
    }, [fetchFeaturedPosts, fetchCategories]); /* Since I used useCallback for the fetchFeaturedPosts and fetchCategories functions, they won't be redefined after
    the first render. Therefore, this useEffect function will run only after the first render. */

    // Return JSX that includes all of the routes. The Route with path / is the parent route of all the other routes.
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="user" element={(user) ? <EditUserProfile /> : <Navigate to="/" /> } />
                <Route path="posts/:id" element={<Post />} />
                <Route path="posts/new" element={(user) ? <EditPost /> : <Navigate to="/" /> } />
                <Route path="posts/edit/:id" element={(user) && location && location.state && user.id === location.state.userId ? <EditPost /> : <Navigate to="/" />} />
                <Route path="*" element={<NoPage />}/>
            </Route>
        </Routes>
    );

}

export default App;
// Import the necessary React functions as well as PostsContext and the two child components.
import { useContext, useEffect } from "react";
import PostsContext from "./context/posts";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";

function App() {
    /* I had an error on this line saying the object wasn't iterable. I eventually figured out by going here (https://dmitripavlutin.com/javascript-object-destructuring/#2-extracting-a-property)
    that I was using square brackets when I needed to use curly braces. */
    const { fetchFeaturedPosts, fetchCategories } = useContext(PostsContext);

    // Use the useEffect function to ensure that the two fetch functions are only called on the first render (more on that below).
    useEffect(() => {
        fetchFeaturedPosts();
        fetchCategories();
    }, [fetchFeaturedPosts, fetchCategories]); /* Since I used useCallback for the fetchFeaturedPosts and fetchCategories functions, they won't be redefined after
    the first render. Therefore, this useEffect function will run only after the first render. */

    // Return the JSX for the application (just the NavBar and Home components in a <div> element).
    return (
        <div>
            <NavBar></NavBar>
            <Home></Home>
        </div>
    );
}

export default App;
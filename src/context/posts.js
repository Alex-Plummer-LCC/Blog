// Import all the necessary React functions and axios.
import { createContext, useState, useCallback } from "react";
import axios from "axios";

// Use createContext to create PostsContext.
const PostsContext = createContext();

// The Provider component is the top most component, and it will display the context that the other components need to use.
function Provider({ children }) {
    const [featuredPosts, setFeaturedPosts] = useState([]); // Create and initialize the state variable featuredPosts. It will start as an empty array.
    const [categories, setCategories] = useState([]); // Create and initialize the state variable categories. It will start as an empty array.
    const [posts, setPosts] = useState([]); // Repeat the same process as the previous two lines with the state variable posts.

    // fetchFeaturedPosts will get the featuredPosts from json-server (using a GET request through axios) and update the featuredPosts state variable appropriately.
    // Wrap the fetchFeaturedPosts function in useCallback to ensure that the useEffect function (in App.js) knows that fetchFeaturedPosts shouldn't change when rerendering.
    const fetchFeaturedPosts = useCallback(async () => {
        // Wait for a response from json-server to come back before setting the featuredPosts.
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts?_expand=user&_sort=datetime&_order=desc&_start=0&_end=12`); 

        setFeaturedPosts(response.data);
    }, []);

    // Repeat the process from the fetchFeaturedPosts function above, only this time we are fetching the categories, which obviously requires a different url.
    const fetchCategories = async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/categories?_sort=name&_order=asc`);

        setCategories(response.data);
    };

    // Repeat the process from the two functions above, but this time we are fetching the posts from a specific user.
    const fetchPosts = async (id) => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts?userId=${id}&_expand=user&_sort=datetime&_order=desc`);

        setPosts(response.data);
    };

    // deletePostById will delete a post, given its id, then update the books state variable appropriately.
    const deletePostById = async (id) => {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`); // Make a DELETE request to json-server, given the id of the post.

        // Using filter with the condition below will only return the posts whose id doesn't match the one we want to delete. 
        const updatedPosts = posts.filter((post) => {
            return post.id !== id; // Keep every post except for the one with the id we want to delete.
        });

        setPosts(updatedPosts);
    };

    // This function will add a new post to the posts array.
    const createPost = async (newPost, user) => {
        // Make a POST request to json-sever (and wait for it) that adds a new post with all the information the user wants.
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, {
            userId: newPost.userId,
            title: newPost.title,
            content: newPost.content,
            datetime: newPost.datetime,
            category: newPost.category,
            user: user.name,
        });
        const updatedPosts = [
            ...posts, // Copy the posts array, then...
            response.data // ...Take the data from the response (the new post) and add it to the copy of the posts array.
        ];

        setPosts(updatedPosts);
    };

    // editPostById will use axios and json-server to edit a post's title, then update the posts state variable appropriately.
    const editPostById = async (id, updatedPost) => {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`, { // Use async/await and template literal syntax to make a PUT request to json-server.
            userId: updatedPost.userId, /* Include an object in the response that is similar to the one in createPost. There is no need to include the 
                                        user and userId properties, as the same user who created the post is doing the editing. */
            title: updatedPost.title, 
            content: updatedPost.content,
            datetime: updatedPost.datetime,
            category: updatedPost.category,
        });

        // Update the posts array by creating a new one using the map function.
        const updatedPosts = posts.map((post) => {
            if (post.id === id) { // If we find the post with the id that we want...
                return { ...post, ...response.data }; 
                /* ...Use a copy of response.data and add it to a copy of the specific post object. This ensures the posts state array will 
                display the current properties. Also, it would appear that the post's information will appear twice, but the oldest info will 
                be removed. */
            }

            // If the id of the post doesn't match up, just return the post.
            return post;
        });

        // Update the posts state variable with the updated posts. 
        setPosts(updatedPosts);
    };

    // "share" is the object that will be shared through context.
    const share = {
        featuredPosts,
        fetchFeaturedPosts,
        categories,
        fetchCategories,
        posts,
        fetchPosts,
        deletePostById,
        createPost,
        editPostById,
    }
    
    /* Return the JSX that contains the PostsContext provider. It receives the "share" object as a prop from the top level Provider.
    Now, any child component has access to the contents of the "share" object through context. */
    return (
        <PostsContext.Provider value={share}>
            {children}
        </PostsContext.Provider>
    );
}

export { Provider }; // Export the Provider component as a named export.
export default PostsContext; // Also, export PostsContext as the default export.
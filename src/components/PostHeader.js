// The PostHeader component receives the post object from its parent Post as a prop.
function PostHeader({ post }) {
    // Create a new date object for the post.
    const date = new Date(post.datetime);

    // Return JSX for the post header, including title, date, category, and images.
    // I chose to resize the images in an inline style rather than creating two separate classes for each.
    return (
        <div>
            <h1>{post.title}</h1>
            <img style={{height: "100px",}} alt="User" src={`data:image/png;base64, ${post.user.image}`} />
            <h5>Written by {post.user.name} in {date.toLocaleDateString("en-us", { year: "numeric", month: "short" })}</h5>
            <img style={{height: "200px",}} alt="Post" src={`data:image/png;base64, ${post.image}`} />
            <p className="category">{post.category}</p>
        </div> 
    );
};

export default PostHeader;
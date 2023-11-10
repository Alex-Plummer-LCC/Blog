// This is the site I used for figuring out how to put an image in JSX: https://create-react-app.dev/docs/adding-images-fonts-and-files/.
import logo from "../images/blogLogo.jpg";

// The Header component will simply display the blog image across the page, near the top.
function Header() {
    // The image is courtesy of WOKANDAPIX on Pixabay (https://pixabay.com/photos/blog-internet-web-technology-media-2355684/).
    return (
        <div>
            <img className="blogImg" src={logo} alt="Blog" />
        </div>
    );
};

export default Header;
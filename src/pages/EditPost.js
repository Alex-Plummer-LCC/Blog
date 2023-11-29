import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import PostsContext from "../context/posts";
import UserContext from "../context/user";
import { useContext, useState } from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

function EditPost() {
    const [value, setValue] = useState(""); // Declare a state variable value for the content in the post. It will be initialized as an empty string.
    const [category, setCategory] = useState(""); // Repeat the process from the line above, this time with the category.
    console.log(category);

    /* Try to get the id from the route using the built-in (to React Router) function useParams. It may be null (if the user is creating
    a new post). */
    const { id } = useParams();
    /* I decided to change my strategy and get the posts out of context. That way, I can process the image in the same way I did with
    the user's profile picture. */
    const { posts, editPostById } = useContext(PostsContext);
    const { user } = useContext(UserContext);

    // https://www.w3schools.com/jsref/jsref_filter.asp
    const postToEdit = posts.filter((post) => {
        // This function only works if I use double equals for the comparison instead of triple, so I shut off eslint for line 28.
        // eslint-disable-next-line
        return post.id == id;
    });

    /* Once we have the post we want to edit, initialize a state variable image to that post's image. It will postToEdit[0].image, 
    since the filter function, which I used above, returns an array. */
    const [image, setImage] = useState(postToEdit[0].image);

    // Initialize the initialValues object to null.
    let initialValues = null;

    // Then, if there is an id in the route, set the initial values, as we are editing a post. Otherwise, leave it as null.
    // Again, since I used filter on the posts, the post we want will be postsToEdit[0].
    if (id) {
        initialValues = {
            title: postToEdit[0].title,
            content: postToEdit[0].content,
        }
    }

    // The following three functions came from the lab instructions in the starting files. They help with image processing.
    function convertImageToBase64(imgUrl, callback) {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            ctx.drawImage(image, 0, 0);
            const dataUrl = canvas.toDataURL();
            callback && callback(dataUrl)
        }
        image.src = imgUrl;
    }

    const handleFileChange = (event) => {
        const file = URL.createObjectURL(event.target.files[0]);
        convertImageToBase64(file, removeTypeAndSave)
    }

    const removeTypeAndSave = (base64Image) => {
        const updatedImage = base64Image.replace(
            "data:image/png;base64,", "");
        setImage(updatedImage);
    }

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: initialValues,
    });

    const navigate = useNavigate();
    const onSubmit = (data) => {
        console.log(image);
        // Use the data variable, the value of the ReactQuill element, context, and more to create an object with the new post information.
        const newPostInfo = {
            title: data.title,
            userId: user.id,
            datetime: postDate.toLocaleDateString("en-us", { year: "numeric", month: "short" }),
            category: category.value,
            content: value,
            image: image,
            id: postToEdit[0].id
        }

        editPostById(id, newPostInfo);
        navigate("/"); // Use the navigate function to send the user back to the home page once they've submitted the post form.
    }

    // Add modules to the react-quill editor. This object comes from the React-Quill tutorial in Moodle.
    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script:  "sub" }, { script:  "super" }],
            ["blockquote", "code-block"],
            [{ list:  "ordered" }, { list:  "bullet" }],
            [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const options = [
        { value: "technology", label: "technology" },
        { value: "sports", label: "sports" },
        { value: "games", label: "games" },
        { value: "misc", label: "misc" }
    ]

    let postDate = new Date();
    // I have the current month and year in as a placeholder while I decide whether or not to use react-datepicker.
    /* Render the JSX for the EditPost form. It will render initial values (including the image) if the user is editing a post.
    Otherwise, all the fields will start as empty.*/
    return (
        <div>
            <form className="editingForms" onSubmit={handleSubmit(onSubmit)}>
                <h5>* next to the field means it is required</h5>
                {initialValues && <img src={`data:image/png;base64, ${image}`} alt="Pic for the post." width="600px" />}

                <label>Post Image*:</label>
                <input type="file" name="image" {...register("image", {
                    required: false,
                    onChange: handleFileChange,
                })}></input>
                {errors.image && <p className="errorMessage">{errors.image.message}</p>}

                <label>Date posted:</label>
                <p>{postDate.toLocaleDateString("en-us", { year: "numeric", month: "short" })}</p>

                <label>Title*:</label>
                <input type="text" name="title" {...register("title", {
                    required: "The post must have a title.",
                    minLength: {
                        value: 3,
                        message: "The post's title must be at least three characters long."
                    }
                })}></input>
                {errors.title && <p className="errorMessage">{errors.title.message}</p>}

                <Select className="editors" onChange={setCategory} options={options} />
                <ReactQuill className="contentEditor editors" modules={modules} onChange={setValue} theme="snow" placeholder="Write the content of the post here."/>

                <button className="submit" type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditPost;
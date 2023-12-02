// Import all of the React related functions needed for the EditPost page.
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import the two contexts.
import PostsContext from "../context/posts";
import UserContext from "../context/user";

// The EditPost page will allow the user to edit a post and create a new one as well.
function EditPost() {
    const [date, setDate] = useState(new Date());

    /* Try to get the id from the route using the built-in (to React Router) function useParams. It may be null (if the user is creating
    a new post). */
    const { id } = useParams();

    /* I decided to change my strategy and get the posts out of context. That way, I can process the image in the same way I did with
    the user's profile picture. */
    const { posts, createPost, editPostById } = useContext(PostsContext);
    const { user } = useContext(UserContext);

    // Use the filter function to find the post the user wants to edit (if there is one) : https://www.w3schools.com/jsref/jsref_filter.asp
    const postToEdit = posts.filter((post) => {
        // This function only works if I use double equals for the comparison instead of triple, so I shut off eslint for line 27.
        // eslint-disable-next-line
        return post.id == id;
    });

    // Initialize the initialValues object to null.
    let initialValues = null;

    // Then, if there is an id in the route, set the initial values, as we are editing a post. Otherwise, leave it as null.
    // Again, since I used filter on the posts, the post we want will be postsToEdit[0].
    if (id) {
        initialValues = {
            title: postToEdit[0].title,
            content: postToEdit[0].content,
            category: postToEdit[0].category
        };
    } else if (id) {
        initialValues = null;
    };

    // Pull the necessary functions out of useForm and give it default values.
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: initialValues,
    });

    /* Determine whether to load the content of a post (when editing) or to leave it empty (when creating), based on the presence of an id.
    The presence of the id in the route is important because it helps determine what content to display in the form. */
    const placeholderContent = id ? postToEdit[0].content : "";
    // Keep track of the content with a state variable. Initialize it to the previously created placeholderContent.
    const [content, setContent] = useState(placeholderContent);

    // This is very similar to the process above, just that we are determining whether there should be a default image or not.
    const postImage = id ? postToEdit[0].image : null;
    const [image, setImage] = useState(postImage);

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

    // The datetime variable is only used in the db.json file. I included it for consistency with the other posts.
    // https://www.w3schools.com/jsref/jsref_gettime.asp
    let datetime = date.getTime();

    /* I couldn't figure out how to navigate the user back to the home page after submitting the form. I went back to the 
    webdevsimplified React Router tutorial for help. */
    const navigate = useNavigate();

    // The onSubmit function will do the necessary processing and function calls once the form is submitted.
    const onSubmit = (data) => {
        // console.log(data);
        /* The type of the category may be a string (if it is unchanged) or an object (if it is changed). Extract the appropriate 
        properties based on the type of data.category. */
        const type = typeof (data.category);
        let postCategory = "";
        if (type === "string") {
            postCategory = data.category;

        // The category is expected to be a string. If it is an object, extract the value property so it can be used in the db.json file.
        } else if (type === "object") {
            postCategory = data.category.value;
        };

        /* If there is no content in the post (or it has been removed), alert the user that the post needs content and return so the 
        form is not submitted. */
        // Note: I know this isn't an ideal way to validate the ReactQuill editor. See my comment near the bottom of the form. 
        if (content === "" || content === "<p><br></p>") {
            alert("Post must have content!");
            return;
        };

        // Use properties of the data variable, state variables, and more to create an object with the new post information.
        const newPostInfo = {
            title: data.title,
            userId: user.id,
            datetime: datetime,
            category: postCategory,
            content: content,
            image: image,
        };

        // If there is no id in the route, the user is editing an existing post. Call editPostById.
        if (id) {
            editPostById(id, newPostInfo);

        // If there is no id in the route, the user is creating a new post. Call createPost.
        } else {
            createPost(newPostInfo, user);
        }
        navigate("/"); // Use the navigate function to send the user back to the home page once they've submitted the post form.
    }

    // Add modules to the react-quill editor. This object comes from the React-Quill tutorial in Moodle.
    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    // Initialize categories for the dropdown that lets the user select a category.
    const categories = [
        { value: "technology", label: "technology" },
        { value: "sports", label: "sports" },
        { value: "games", label: "games" },
        { value: "misc", label: "misc" }
    ]

    // The findCategory function looks for the category of the post that is being edited so it can be displayed in the form.
    // I used this article for help with the find method: https://www.w3schools.com/jsref/jsref_find.asp
    const findCategory = (categories) => {
        // If the user is creating a new post, there is no category.
        if (!id) {
            return;
        } else {
            return categories.value === postToEdit[0].category;
        }
    };

    // Use findCategory to find the object representing the appropriate category. It will be displayed in the form.
    let categoryToRender = categories.find(findCategory);
    // Determine whether an image should be required. It should if the user is creating a new post, and if not, it can stay the same.
    const needsImage = id ? false : true;

    /* Render the JSX for the EditPost form. It will render initial values (including the image) if the user is editing a post.
    Otherwise, all the fields will start as empty.

    I found react-select information here: https://react-select.com/home 

    I also used this article for help on setting the default value of my Select element: 
    https://www.geeksforgeeks.org/how-to-set-default-value-in-select-using-reactjs/ */
    return (
        <div>
            {id ? <h1 className="postHeading">Editing post #{id}</h1> : <h1 className="postHeading">New Post</h1>}
            <form className="editingForms" onSubmit={handleSubmit(onSubmit)}>
                <h5>* next to the field means it is required</h5>
                <img src={`data:image/png;base64, ${image}`} alt="Pic for the post." width="600px" />

                <label>Post Image*:</label>
                <input type="file" name="image" {...register("image", {
                    required: needsImage,
                    onChange: handleFileChange,
                })}></input>
                {errors.image && <p className="errorMessage">New posts need an image.</p>}

                <label>Date posted:</label>
                <div>
                    <DatePicker selected={date} onChange={(date) => setDate(date)} />
                </div>

                <label>Title*:</label>
                <input type="text" name="title" {...register("title", {
                    required: "The post must have a title.",
                    minLength: {
                        value: 3,
                        message: "The post's title must be at least three characters long."
                    }
                })}></input>
                {errors.title && <p className="errorMessage">{errors.title.message}</p>}

                <div className="editors">
                    <label>Category*:</label>
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: true, }}
                        render={({ field }) => (
                            <Select {...field} options={categories} value={categories.value} defaultValue={categoryToRender} />
                        )}
                    />
                    {errors.category && (
                        <p className="errorMessage">The post needs to have a category.</p>
                    )}
                </div>

                <div className="editors">
                    <label>Content*</label>
                    {/* I couldn't find a good way to use the ReactQuill element with react-hook-form and get it to show the value
                    of the post by default. I chose to validate it with plain JavaScript. */}
                    <ReactQuill className="contentEditor" modules={modules} onChange={setContent} theme="snow" value={content} />
                </div>

                <button className="submit" type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditPost;

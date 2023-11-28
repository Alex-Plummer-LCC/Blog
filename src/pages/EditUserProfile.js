import { useContext, useState } from "react";
import UserContext from "../context/user";
// Import the useForm function from react-hook-form.
import { useForm } from "react-hook-form";

function EditUserProfile() {
    // Get the user from userContext so the user can see their current information.
    const { user, editUserById } = useContext(UserContext);
    // Keep track of the image using a state variable image.
    const [image, setImage] = useState(user.image);

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
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user.name,
            userid: user.userid,
            email: user.email,
            bio: user.bio
        }
    });

    const onSubmit = (data) => {
        console.log(data);
        /* Use the data sent to the onSubmit function to create an object containing the user's new information. Since
        I did not change the password, it is located in the user object. The image that we want to use is the state variable
        image. */
        const newUserInfo = {
            name: data.name,
            userid: data.userid,
            email: data.email,
            bio: data.bio,
            password: user.password,
            image: image,
        }

        editUserById(user.id, newUserInfo);
    };

    // Return JSX for the form, including react-hook-form related functionality.
    // This site helped me out with the onChange handler for the image: https://react-hook-form.com/docs/useform/register
    return (
        <div className="parent">
            <form className="editProfile" onSubmit={handleSubmit(onSubmit)}>
                <h5>* next to the field means it is required</h5>
                <img src={`data:image/png;base64, ${image}`} alt="User's profile pic." width="100px"/>
                <label>Profile picture*:</label>
                <input type="file" name="profilePicture"  {...register("profilePicture", {
                    required: "A profile picture is required.",
                    onChange: handleFileChange,
                })}></input>
                {errors.profilePicture && <p>{errors.profilePicture.message}</p>}

                <label>Name*:</label>
                <input type="text" name="name" {...register("name", {
                    required: "Your name is required.",
                })}></input>
                {errors.name && <p className="errorMessage">{errors.name.message}</p>}

                <label>User id*:</label>
                <input type="text" name="userid" {...register("userid", {
                    required: "Your userid is required.",
                    minLength: {
                        value: 3,
                        message: "Your userid must have at least three characters."
                    }
                })}></input>
                {errors.userid && <p className="errorMessage">{errors.userid.message}</p>}

                <label>Email*:</label>
                <input type="email" name="email" {...register("email", {
                    required: "Your email is required.",
                    pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Invalid email. It should look something like this: person@example.com"
                    }
                })}></input>
                {errors.email && <p className="errorMessage">{errors.email.message}</p>}

                <label>Bio*:</label>
                <textarea type="text" name="bio" {...register("bio", {
                    required: "Your personal bio is required.",
                    minLength: {
                        value: 5,
                        message: "Your bio must have at least five characters."
                    }
                })}></textarea>
                {errors.bio && <p className="errorMessage">{errors.bio.message}</p>}

                <button className="submit" type="submit">Save</button>
            </form>
        </div>
    );
}


export default EditUserProfile;
// Import the necessary React content and the App component.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css"; // Import the external CSS stylesheet I made (https://salehmubashar.com/blog/different-ways-to-add-css-in-react-js).
// Import the two providers. Rename one of them so they can be distinguished from each other.
import { Provider } from "./context/posts";
import { Provider as UserProvider } from "./context/user";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

/* Render the App component, which is wrapped in both providers. This ensures that the App component and all of its children
have access to the two contexts (created in posts.js and user.js). */
root.render(
    <UserProvider>
        <Provider>
            <App />
        </Provider>
    </UserProvider>
);

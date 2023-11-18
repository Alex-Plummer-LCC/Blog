// Import the Outlet and NavBar components.
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

/* The Layout component will render the NavBar component and the Outlet component, which will determine what content to
show based on the route. */
function Layout() {
    return (
        <>
        <NavBar />
        <Outlet />
        </>
    )
};

export default Layout;
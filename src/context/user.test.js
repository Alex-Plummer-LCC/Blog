import { render, waitFor, screen } from '@testing-library/react';
import user from "@testing-library/user-event";
import { useContext } from 'react';
import UserContext from './user';
import { Provider, LoginStatus } from './user';

/* login */
const TestUserComponent = ({userId, password}) => {
    const { user, fetchUser } = useContext(UserContext);
    fetchUser(userId, password);
    return (
        <div>
            {user && user.userid === userId && 
            <div role="exists">The user was logged in successfully.</div>}
        </div>
    )
}

test('fetch user valid login', async () => {
    render (
        <Provider>
            <TestUserComponent userId="duckdonald" password="password" />
        </Provider>
    );
    await waitFor(() => {
        expect(screen.getByRole('exists')).toBeInTheDocument();
    })
})

test('fetch user bad password', async () => {
    render (
        <Provider>
            <TestUserComponent userId="duckdonald" password="bad password" />
        </Provider>
    );
    await waitFor(() => {
        expect(screen.queryByRole('exists')).not.toBeInTheDocument();
    })
})

test('fetch user invalid login', async () => {
    render (
        <Provider>
            <TestUserComponent userId="not a user" password="bad password" />
        </Provider>
    );
    await waitFor(() => {
        expect(screen.queryByRole('exists')).not.toBeInTheDocument();
    })
})

/* logout */ 
const TestResetUserComponent = ({userId, password}) => {
    const { user, fetchUser, resetUser } = useContext(UserContext);
    fetchUser(userId, password);
    return (
        <div>
            {user && user.userid === userId && 
            <div role="loggedIn">The user was logged in successfully.</div>}
            <button
                onClick={() => {
                    console.log("clicked");
                    resetUser();
                }}
            >Logout</button>
            {!user && 
            <div role="loggedOut">The user was logged out successfully.</div>}
        </div>
    )
}

test('logout user', async () => {
    render (
        <Provider>
            <TestResetUserComponent userId="duckdonald" password="password" />
        </Provider>
    );
    await waitFor(() => {
        expect(screen.getByRole('loggedIn')).toBeInTheDocument();
    })
    user.click(screen.getByRole('button', {name: "Logout"}));
    await waitFor(() => {
        const after = screen.getByRole('loggedOut');
        expect(after).toBeInTheDocument();
    });
})

/* create user 
const TestCreateUserComponent = () => {
    const { user, createUser } = useContext(UserContext);
    return (
        <div>
            {!user && 
            <div role="before">There is no user logged in.</div>}
            <button
                onClick={() => {
                    console.log("clicked");
                    const newUser = {
                        "name": "Daffy Duck",
                        "userid": "duckdaffy",
                        "email": "duckdaffy@disney.com",
                        "password": "password",
                    };
                    createUser(newUser)
                }}
            >Create User</button>
            {user && user.userid === "duckdaffy" && 
            <div role="after">The user was created and logged in successfully.</div>}
        </div>
    )
}

test('Create User', async () => {
    render (
        <Provider>
            <TestCreateUserComponent />
        </Provider>
    );
    await waitFor(() => {
        const before = screen.getByRole('before');
        expect(before).toBeInTheDocument();
    });
    user.click(screen.getByRole('button', {name: "Create User"}));
    await waitFor(() => {
        const after = screen.getByRole('after');
        expect(after).toBeInTheDocument();
    });
})
*/
/* edit user 
const TestEditUserComponent = () => {
    const { user, fetchUser, editUserById } = useContext(UserContext);
    fetchUser("duckdaffy", "password");
    return (
        <div>
            {user && user.userid === "duckdaffy" && 
            <div role="before">Daffy duck is logged in successfully.</div>}
            <button
                onClick={() => {
                    console.log("clicked");
                    const updatedUser = {
                        "name": "Daffy the Duck",
                        "userid": "duckdaffythe",
                        "email": "duckdaffy@disney.com",
                        "password": "password",
                    };
                    editUserById(4, updatedUser)
                }}
            >Edit User</button>
            {user && user.userid === "duckdaffythe" && 
            <div role="after">Daffy duck's information has been changed.</div>}
        </div>
    )
}

test('edit User', async () => {
    render (
        <Provider>
            <TestEditUserComponent />
        </Provider>
    );
    await waitFor(() => {
        const before = screen.getByRole('before');
        expect(before).toBeInTheDocument();
    });
    user.click(screen.getByRole('button', {name: "Edit User"}));
    await waitFor(() => {
        const after = screen.getByRole('after');
        expect(after).toBeInTheDocument();
    });
})
*/

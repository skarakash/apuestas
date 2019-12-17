import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Redirect} from 'react-router-dom';

function LoginPage() {

    const [isLoggedIn, setLoggedIn] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const login = e.target['0'].value;
        const pass = e.target['1'].value;
        if(login === 'serg_ka' && pass === 'highbury'){
            setLoggedIn(true)
        }
    };

    return (
        <>
            {isLoggedIn ? <Redirect to="/inplay" /> : null}
            <div className="container login-form_container">
                <Form className="login_form" onSubmit={e =>onSubmit(e)}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Username" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default LoginPage;
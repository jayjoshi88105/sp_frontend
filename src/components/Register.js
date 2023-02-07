import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { gapi } from 'gapi-script';
import { isEmpty } from "react-form-validator-core/lib/ValidationRules";

const Register = () => {
    const [username, setUserName] = useState("");
    const [dob, setDOB] = useState("");
    const [password, setPassword] = useState("");
    
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [dobErrorMessage, setDobErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    function start() {
        gapi.client.init({
            clientId: "211031872900-er9lb8h1n80h38ouhg0os25e0ckj161p.apps.googleusercontent.com",
            scope: 'email',
        });
    }
    gapi.load('client:auth2', start);

    useEffect(() => {
        
    }, []);

    const onSuccess = response => {
        localStorage.setItem("data", JSON.stringify({
            "username": response.profileObj.givenName
        }));
        localStorage.setItem("accessToken", JSON.stringify(response.accessToken));
        navigate('/')
    };
    const onFailure = response => {
        console.log('FAILED', response);
    };

    const responseFacebook = (response) => {
        console.log(response);
    }

    const componentClicked = (data) => { }

    const collectData = async (e) => {
        let result = await fetch("http://localhost:3002/signup", {
            method: "POST",
            body: JSON.stringify({ username, dob, password }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (result.status == 200) {
            navigate('/login')
        }
    }

    const validateForm = () => {
        setErrors([]);

        if(isEmpty(username))
        {
            setUsernameErrorMessage("Enter Username");
            errors.push("username");
        }
        
        if(isEmpty(dob))
        {
            setDobErrorMessage("Select Date of Birth");
            errors.push("dob");
        } 
        
        if(isEmpty(password))
        {
            setPasswordErrorMessage("Enter Password");
            errors.push("password");
        }

        if(errors.length == 0)
        {
            collectData()
        }
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            className="form-control mt-1"
                            placeholder="e.g JayJoshi"
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <span className="red">{usernameErrorMessage}</span>
                    <div className="form-group mt-3">
                        <label>D.O.B</label>
                        <input
                            type="date"
                            value={dob}
                            className="form-control mt-1"
                            placeholder="D.O.B"
                            onChange={(e) => setDOB(e.target.value)}
                        />
                    </div>
                    <span className="red">{dobErrorMessage}</span>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            className="form-control mt-1"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <span className="red">{passwordErrorMessage}</span>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={validateForm}>
                            Submit
                        </button>
                    </div>
                    <p className="text-right mt-2 linkcls">
                        <Link className="nav-link" to="/login">Login Here</Link>
                    </p>

                    <p className="center">
                        <GoogleLogin
                            clientId={'211031872900-er9lb8h1n80h38ouhg0os25e0ckj161p.apps.googleusercontent.com'}
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                        />
                    </p>
                    <p className="center">
                        <FacebookLogin
                            appId="1088597931155576"
                            autoLoad={false}
                            size="small"
                            fields="name,email,picture"
                            onClick={componentClicked}
                            callback={responseFacebook} />
                    </p>
                    {/* <GoogleLogout
                            clientId={'211031872900-er9lb8h1n80h38ouhg0os25e0ckj161p.apps.googleusercontent.com'}
                            onLogoutSuccess={onLogoutSuccess}
                        /> */}
                </div>
            </form>
        </div>
    )
}


export default Register
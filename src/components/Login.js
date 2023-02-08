import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { isEmpty } from "react-form-validator-core/lib/ValidationRules";

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [errors, setErrors] = useState([]);

    const UserLogin = async () => {
        let result = await fetch("http://localhost:3002/login", {
            method:"POST",
            body:JSON.stringify({username,password}),
            headers:{
                "Content-Type":"application/json"
            }
        });

        let resultdata = await result.json();
        
        if(result.status == 200){
            localStorage.setItem("data",JSON.stringify(resultdata.data));
            localStorage.setItem("accessToken",JSON.stringify(resultdata.accessToken));
            navigate('/')
        }
        else
        {
            console.log("Enter details");
        }
    }

    const validateForm = () => {
        setErrors([]);

        if(isEmpty(username))
        {
            setUsernameErrorMessage("Enter Username");
            errors.push("username");
        }
        
        if(isEmpty(password))
        {
            setPasswordErrorMessage("Enter Password");
            errors.push("password");
        }

        if(errors.length == 0)
        {
            UserLogin()
        }
    }
    
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            className="form-control mt-1"
                            placeholder="Enter Username"
                            onChange={(e)=>setUserName(e.target.value)} 
                        />
                    </div>
                    <span className="red">{usernameErrorMessage}</span>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            className="form-control mt-1"
                            placeholder="Enter password"
                            onChange={(e)=>setPassword(e.target.value)} 
                        />
                    </div>
                    <span className="red">{passwordErrorMessage}</span>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={validateForm}>
                            Submit
                        </button>
                    </div>
                    <p className="text-right mt-2 linkcls">
                        <Link className="nav-link" to="/register">Register Here</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login
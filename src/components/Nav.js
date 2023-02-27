import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
    const auth = localStorage.getItem('data');
    const navigate = useNavigate();
    const logout = () => {
        const auth = localStorage.removeItem('data');
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                {
                    auth ?
                        <div className="row rowwidth">
                            <div className="col-md-6 offset-6">
                                <ul className="navbar-nav aligncls">
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login" onClick={logout}>Welcome, {JSON.parse(auth).username} | <b className="red">Logout</b></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        :
                        <ul className="navbar-nav aligncls">
                            {/* <li class="nav-item">
                                <Link className="nav-link" to="/register">Sign Up</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li> */}
                        </ul>
                }
            </div>
        </nav>
    )
}

export default Nav;
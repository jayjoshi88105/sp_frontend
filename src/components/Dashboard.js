import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer';

const ITEMS_PER_PAGE = 10;
const timeout = 120000
const promptBeforeIdle = 60000

const ProductList = () => {
    const auth = localStorage.getItem('data');
    const navigate = useNavigate();
    
    if(!auth){
        navigate("/login");
    }
    
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [state, setState] = useState('Active')
    const [remaining, setRemaining] = useState(timeout)
    const [open, setOpen] = useState(false)

    const getProducts = async () => {
        let result = await fetch("http://18.223.3.106:3002/products");

        result = await result.json();
        setProducts(result.data);
        setTotalPages(Math.ceil(result.data.length / ITEMS_PER_PAGE));
    }

    const searchData = async (event) => {
        let key = event.target.value;

        if (key) {
            let result = await fetch(`http://18.223.3.106:3002/search/${key}`);
            result = await result.json();

            if (result) {
                setProducts(result.data);
                setTotalPages(Math.ceil(result.data.length / ITEMS_PER_PAGE));
            }
        } else {
            getProducts();
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleSearch = event => {
        searchData(event);
        setSearchTerm(event.target.value);
    };

    const resetSearch = event => {
        setSearchTerm("");
        searchData(event);
    }

    const pageData = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageClick = page => {
        setCurrentPage(page);
    };


    //Idle Timer Code
    const onIdle = () => {
        setState('Idle')
        setOpen(false)
    }

    const onActive = () => {
        setState('Active')
        setOpen(false)
    }

    const onPrompt = () => {
        setState('Prompted')
        setOpen(true)
    }

    const { getRemainingTime, activate } = useIdleTimer({
        onIdle,
        onActive,
        onPrompt,
        timeout,
        promptBeforeIdle,
        throttle: 500
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000))
            if(remaining == 0)
            {
                logout()
            }
        }, 500)

        return () => {
            clearInterval(interval)
        }
    })

    const handleStillHere = () => {
        activate()
    }

    const logout = () => {
        const auth = localStorage.removeItem('data');
        navigate("/login");
    }

    const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0)
    const seconds = timeTillPrompt > 1 ? 'seconds' : 'second'

    return (
        <>
            {/* <div
                className='modal'
                style={{
                display: open ? 'flex' : 'none'
                }}>
                <h3>Are you still here?</h3>
                <p>Logging out in {remaining} seconds</p>
                <button onClick={handleStillHere}>Im still here</button>
            </div>             */}

            <div className="modal" role="dialog" style={{
                display: open ? 'flex' : 'none'
            }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p>Your session will expire. Please press ok to continue.</p>
                            <p>Logging out in {remaining} seconds</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleStillHere}>Ok</button>
                            {/* <button type="button" className="btn btn-secondary" onClick={logout}>Logout</button> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4 offset-7">
                        <input
                            type="text"
                            className="form-control aligncls"
                            placeholder="Search Product..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-danger aligncls" onClick={resetSearch}>Reset</button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Company</th>
                                <th>Category</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pageData.length > 0 ? pageData.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.product_name}</td>
                                        <td>{item.company}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price}</td>
                                    </tr>
                                )) : <h3 className="h2cls">No Result Found</h3>
                            }
                        </tbody>
                    </table>
                </div>
                <div className="aligncls">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            className="btn btn-success leftalign"
                            key={i + 1}
                            onClick={() => handlePageClick(i + 1)}
                            disabled={i + 1 === currentPage}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductList;
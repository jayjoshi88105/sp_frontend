import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import { useIdleTimer } from 'react-idle-timer'
import TimeoutModal from './TimeoutModal';

import { Modal } from "react-modal";

import SessionTimeout from '../SessionTimeout';

const ITEMS_PER_PAGE = 4;

// Modal.setAppElement('#root');

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [auth, setAuth] = useState(true);
    const navigate = useNavigate();

    // const [state, setState] = useState(null);
    //const [idleTimer, setIdleTimer] = useState(null);
    const [logoutTimer, setLogoutTimer] = useState(null);
    const [isloggedIn, setisloggedIn] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const idleTimeRef = useRef(null);

    // const state={
    //     showModal: false
    // }

    // const idleTimerRef = useRef(null)

    // useEffect(() => {
    //     const isData = localStorage.getItem('data');

    //     if(isData)
    //     {
    //         setAuth(true)
    //         navigate("/login");
    //     }
    //     else
    //     {
    //         setAuth(false)
    //     }
    // })

    const getProducts = async () => {
        let result = await fetch("http://localhost:3002/products");

        result = await result.json();
        setProducts(result.data);
        setTotalPages(Math.ceil(result.data.length / ITEMS_PER_PAGE));
    }

    const searchData = async (event) => {
        let key = event.target.value;

        if (key) {
            let result = await fetch(`http://localhost:3002/search/${key}`);
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

    // const handleClick = () => {
    //     setAuth(!isAuthenticated);
    // }

    // const _onAction = (e) => {
    //     this.setState({ 'isTimedOut': false })
    // }
    
    // const _onIdle = (e) => {
    //     const { isTimedOut } = this.state;
    //     if (isTimedOut){
    //         // Logout user or show warning modal
    //     }
    //     else {
    //         this.idleTimer.current.reset();
    //         this.setState({ isTimedOut: true })
    //     }
    // }

    // const onIdle = () => {
    //     console.log('user is idle');
    // }

    // const onIdle = () => {
    //     this.togglePopup();
    //     this.logoutTimer = setTimeout(() => {
    //       this.handleLogout();
    //     }, 1000 * 5 * 1); // 5 seconds
    //   }

    const onIdle = () => {
        console.log("logout");
      };

      const idleTimer = useIdleTimer({
        ref: idleTimeRef,
        timeout: 1000,
        onIdle: onIdle,
      });
     
    //   const togglePopup = () => {
    //     this.setState(prevState => ({ showModal: !prevState.showModal }));
    //   }

    //   const handleStayLoggedIn = () => {
    //     if (logoutTimer) {
    //       clearTimeout(this.logoutTimer);
    //       logoutTimer = null;
    //     }
    //     idleTimer.reset();
    //     togglePopup();
    //   }

    // const { showModal } = true;

      

    return (
        <>
            {/* <SessionTimeout isAuthenticated={isAuthenticated} logOut={handleClick} /> */}

            {/* <p>{ this.state.idleTimeout ? 'ACTIVE' : 'Time to logout' }</p> */}
            {/* <IdleTimer
                key='idleTimer'
                startOnMount={ true }
                ref={ this.idleTimer }
                element={ document }
                onActive={ this._onActive }
                onIdle={ this._onIdle }
                timeout={ 2000 } >
            </IdleTimer> */}

            {/* <IdleTimer ref={idleTimerRef} timeout={2 * 1000} onIdle={onIdle}></IdleTimer> */}

            <div idleTimer={idleTimer}></div>
        
            {/* <Modal isOpen={modalIsOpen}>
                <h2>You have been idle for a while</h2>
                <div>
                    Jay
                </div>
            </Modal> */}

            {/* <TimeoutModal
                showModal={showModal}
                togglePopup={this.togglePopup}
                handleStayLoggedIn={this.handleStayLoggedIn}
            /> */}

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
                                <th>Category</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pageData.length > 0 ? pageData.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.product_name}</td>
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
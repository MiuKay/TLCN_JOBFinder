import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const Header = () => {

    let history = useHistory();
    const [user, setUser] = useState({})
    let handleLogout = () => {
        console.log("hello")
        localStorage.removeItem("userData");
        localStorage.removeItem("token_user")
        window.location.href = "/login"
    }
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])

    return (
        <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <Link className="navbar-brand brand-logo mr-5" to={"/admin/"}><img src="/assets/img/logo/logo.png" className="mr-2" alt="logo" /></Link>
                <a className="navbar-brand brand-logo-mini" href="index.html"><img src="/assetsAdmin/images/logo-mini.svg" alt="logo" /></a>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                    <span className="icon-menu" />
                </button>

                <ul className="navbar-nav navbar-nav-right">

                    <li className="nav-item nav-profile dropdown">
                        <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                            <img style={{ objectFit: 'cover' }} src={user.image} alt="profile" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                            <Link to={'/admin/user-info/'} className="dropdown-item">
                                <i className="far fa-user text-primary"></i>
                                Thông tin

                            </Link>
                            <Link to={'/admin/changepassword/'} className="dropdown-item">
                                <i className="ti-settings text-primary" />
                                Đổi mật khẩu
                            </Link>
                            <a onClick={() => handleLogout()} className="dropdown-item">
                                <i className="ti-power-off text-primary" />
                                Đăng xuất
                            </a>
                        </div>
                    </li>

                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                    <span className="icon-menu" />
                </button>
            </div>
        </nav>
    )
}

export default Header

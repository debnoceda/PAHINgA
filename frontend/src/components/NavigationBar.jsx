import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../styles/NavigationBar.css";
import profilePic from "../assets/Logotrans.png";

const NavigationBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setDropdownOpen(false); // Close dropdown when navigating
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
        setDropdownOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {/* change this to png logo later */}
                <div className="navbar-logo" onClick={() => handleNavigation("/")} style={{ cursor: "pointer" }}>
                    PAHINgA
                </div>
                <button className="navbar-btn" onClick={() => handleNavigation("/")}>
                    Home
                </button>
                <button className="navbar-btn" onClick={() => handleNavigation("/journal")}>
                    Journal
                </button>
            </div>
            <div className="navbar-right" ref={dropdownRef}>
                <button className="profile-btn" onClick={() => setDropdownOpen((open) => !open)}>
                    <img src={profilePic} alt="Profile" className="profile-img" />
                </button>
                {dropdownOpen && (
                    <div className="profile-dropdown">
                        <button className="dropdown-item" onClick={() => handleNavigation("/profile")}>
                            <Icon icon="ix:user-profile-filled" className="dropdown-icon" />
                            View Profile
                        </button>
                        <button className="dropdown-item" onClick={handleLogout}>
                            <Icon icon="humbleicons:logout" className="dropdown-icon" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;

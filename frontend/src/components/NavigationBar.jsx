import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../styles/NavigationBar.css";
import profilePic from "../assets/CalendarEmoji/CalendarAngry.png";
import { useUser } from "../context/UserContext";
import Streak from "./Streak";

const NavigationBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [streakDropdownOpen, setStreakDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const streakDropdownRef = useRef(null);
    const profileButtonRef = useRef(null);
    const streakButtonRef = useRef(null);
    const navigate = useNavigate();
    const { user, fetchUserData } = useUser();

    // Fetch user data when component mounts
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
                if (profileButtonRef.current) {
                    profileButtonRef.current.blur();
                }
            }
            if (streakDropdownRef.current && !streakDropdownRef.current.contains(event.target)) {
                setStreakDropdownOpen(false);
                if (streakButtonRef.current) {
                    streakButtonRef.current.blur();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setDropdownOpen(false);
        setStreakDropdownOpen(false);
        if (profileButtonRef.current) {
            profileButtonRef.current.blur();
        }
        if (streakButtonRef.current) {
            streakButtonRef.current.blur();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/landing");
        setDropdownOpen(false);
        setStreakDropdownOpen(false);
        if (profileButtonRef.current) {
            profileButtonRef.current.blur();
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen((open) => {
            const newOpen = !open;
            if (newOpen) {
                setStreakDropdownOpen(false);
            }
            if (!newOpen && profileButtonRef.current) {
                setTimeout(() => {
                    profileButtonRef.current.blur();
                }, 0);
            }
            return newOpen;
        });
    };

    const toggleStreakDropdown = () => {
        setStreakDropdownOpen((open) => {
            const newOpen = !open;
            if (newOpen) {
                setDropdownOpen(false);
            }
            if (!newOpen && streakButtonRef.current) {
                setTimeout(() => {
                    streakButtonRef.current.blur();
                }, 0);
            }
            return newOpen;
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo" onClick={() => handleNavigation("/")} style={{ cursor: "pointer" }}>
                    PAHINgA
                </div>
                <button className="navbar-btn desktop-only" onClick={() => handleNavigation("/")}>
                    Home
                </button>
                <button className="navbar-btn desktop-only" onClick={() => handleNavigation("/journal")}>
                    Journal
                </button>
            </div>
            <div className="navbar-right">
                <div className="streak-dropdown-container" ref={streakDropdownRef}>
                    <button
                        ref={streakButtonRef}
                        className="streak-btn"
                        onClick={toggleStreakDropdown}
                    >
                        <div 
                            className={`streak-icon-bg ${(user?.streak?.current_streak || 0) === 0 ? 'no-streak' : ''}`}
                        >
                            <div className="streak-count-nav">{user?.streak?.current_streak || 0}</div>
                        </div>
                    </button>
                    {streakDropdownOpen && (
                        <div className="streak-dropdown">
                            <Streak />
                        </div>
                    )}
                </div>

                <div className="profile-dropdown-container" ref={dropdownRef}>
                    <button
                        ref={profileButtonRef}
                        className="profile-btn"
                        onClick={toggleDropdown}
                    >
                        <img src={profilePic} alt="Profile" className="profile-img" />
                    </button>
                    {dropdownOpen && (
                        <div className="profile-dropdown">
                            <button className="dropdown-item mobile-only" onClick={() => handleNavigation("/journal")}>
                                <Icon icon="mdi:journal" className="dropdown-icon" />
                                Journal
                            </button>
                            <div className="dropdown-divider mobile-only"></div>
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
            </div>
        </nav>
    );
};

export default NavigationBar;

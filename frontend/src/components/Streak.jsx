import "../styles/Streak.css";
import React from "react";
import Card from "./Card";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Streak() {
    const navigate = useNavigate();
    const { user } = useUser();

    const handleClick = () => {
        navigate('/entry/new');
    };
    
    return (
        <div className="streak-container">
            <Card className="streak-card">
                <div
                    className={`icon-park-solid--fire ${
                        (user?.streak?.current_streak || 0) === 0 ? 'no-streak' : ''
                    }`}
                >
                    <p className="streak-count">{user?.streak?.current_streak || 0}</p>
                </div>
                <h1>Day Streak!</h1>
                <div className="dashed-line"></div>
                <p>You showed up for yourself—again. Keep the light on.</p>
                {user?.streak?.longest_streak > 0 && (
                    <p className="longest-streak small-text">
                        Longest streak: {user.streak.longest_streak} days
                    </p>
                )}
                <Button onClick={handleClick}>Write Today's Entry</Button>
            </Card>
        </div>
    );
}

export default Streak;

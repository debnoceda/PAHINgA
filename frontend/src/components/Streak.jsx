import "../styles/Streak.css";
import React, { useEffect } from "react";
import Card from "./Card";
import { useUser } from "../context/UserContext";

function Streak() {
    const { user } = useUser();

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
            </Card>
        </div>
    );
}

export default Streak;

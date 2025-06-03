import "../styles/Streak.css";
import React from "react";
import Card from "./Card";
import Button from "./Button";

function Streak() {
    return (
        <div className="streak-container">
            <Card className="streak-card">
                <div className="icon-park-solid--fire">
                    <p className="streak-count">10</p>
                </div>
                <h1>Day Streak!</h1>
                <div className="dashed-line"></div>
                <p>You showed up for yourself—again. Keep the light on.</p>
                <Button>Write Today's Entry</Button>
            </Card>
        </div>
    );
}

export default Streak;

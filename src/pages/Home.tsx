import React from "react";
import { useNavigate } from "react-router-dom";

import "../App.css"

interface App {
    name: string,
    path: string
}

const AvailableApps: App[] = [
    {
        name: "Poker Banker",
        path: "/poker"
    },
    {
        name: "Meal Splitter",
        path: "/meal"
    }
]

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <h2>Money Split Manager</h2>
            <hr />

            <h3>Available Apps:</h3>

            {
                AvailableApps.map((app, i) => {
                    return (
                        <>
                        <button onClick={() => navigate(app.path)} key={i}>{app.name}</button>
                        <br />
                        </>
                    ) 
                })
            }

        </>
    )
};

export default Home;
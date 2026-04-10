import React from "react";
import './Dashboard1.css'

const Dashboard1 = () => {

    return (
        <>
            <div className="dashboard-wrapper">
                <h1 className="dashboard-h1">
                    Witaj w SQL Learning!
                </h1>
                <p className="dashboard-desc">
                    {/* Dodac by uzytownik mogl sam wybrac tematy  */}
                    Rozpocznij swoją naukę SQL z tematami: Gry, Podróże
                </p>

                <div className="dashboard-info">
                    <div className="dashboard-lessons">
                        <p className="lessons-text">
                        <span className="lessons-number">0</span><br/>
                            Ukończone lekcje
                        </p>
                    </div>

                    <div className="dashboard-tasks">
                        <p className="tasks-text">
                            <span className="task-number">0</span><br/>
                            Rozwiązane zadania
                        </p>
                    </div>
                    
                    
                    <div className="dashboard-days">
                        <p className="days-text">
                            <span className="days-number">0</span><br/>
                            Dni nauki
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard1
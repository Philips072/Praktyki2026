import React from "react";
import './Dashboard2.css'
import { Link } from "react-router-dom";

const Dashboard2 = () => {


    return (
        <>
            <div className="dashboard2-wrapper">
                <h1 className="dashboard2-h1">
                    Rozpocznij naukę
                </h1>

                <div className="learning-container">
                    <div className="first-lesson">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6C10 3.5 6 3 3 4.5V19.5C6 18 10 18.5 12 21C14 18.5 18 18 21 19.5V4.5C18 3 14 3.5 12 6Z"
                                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <line x1="12" y1="6" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                            <h2>Pierwsza lekcja SQL</h2>
                            <span className="first-lesson-desc">Poznaj podstawy zapytań SELECT na przykładach z piłki nożnej</span>
                    </div>

                    <Link to="/ai-chat">
                    <div className="ask-ai">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7l-4 4V6a2 2 0 0 1 2-2z"
                                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                            <h2>Zapytaj AI</h2>
                            <span className="first-lesson-desc">Zadaj pytanie asystentowi AI o SQL lub bazy danych</span>
                    </div>
                    </Link>
                </div>
            </div>
        </>
    )
}
export default Dashboard2
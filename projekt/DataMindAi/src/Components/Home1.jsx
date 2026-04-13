import React from "react";
import "./Home1.css"
import { Link } from "react-router-dom";

const Home1 = () => {
    return (
        <>
        <div className="home1-container">
            <div className="home-wrapper">
                <div className="badge">
                    <span className="badge-dot"></span>
                    Spersonalizowana nauka SQL
                </div>

                <h1 className="home-title">
                    Naucz się SQL przez swoje <br /> <span className="home-style-span">pasje</span>
                </h1>

                <p className="home-desc">
                    Opanuj bazy danych ucząc się na przykładach z piłki nożnej, muzyki, gier i
                    innych tematów, które Cię interesują. AI dostosuje się do Twojego poziomu.
                </p>

                <div className="btn-container">
                    <Link to="/rejestracja"><button className="btn-main">Rozpocznij naukę

                        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <line x1="3" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <polyline points="13,6 19,12 13,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    </Link>
                    <Link to="/logowanie">
                    <button className="btn-login">Zaloguj się</button>
                    </Link>
                </div>

                {/* Okno z kodem */}

                <div className="code-window">
                    <div className="code-header">
                        <div className="dot dot-red"></div>
                        <div className="dot dot-green"></div>
                        <span className="file-name">query.sql</span>
                    </div>
                    <div className="code-body">
                        <pre>
                            <span className="keyword">SELECT</span> gracze.imie, gracze.nazwisko,{"\n"}
                            {"       "}<span className="func">COUNT</span>(bramki.id) <span className="keyword">as</span> liczba_bramek{"\n"}
                            <span className="keyword">FROM</span> gracze{"\n"}
                            <span className="keyword">JOIN</span> bramki <span className="keyword">ON</span> gracze.id = bramki.gracz_id{"\n"}
                            <span className="keyword">WHERE</span> sezon = <span className="string">'2025/2026'</span>{"\n"}
                            <span className="keyword">GROUP BY</span> gracze.id{"\n"}
                            <span className="keyword">ORDER BY</span> liczba_bramek <span className="keyword">DESC</span>{"\n"}
                            <span className="keyword">LIMIT</span> 10;
                        </pre>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default Home1
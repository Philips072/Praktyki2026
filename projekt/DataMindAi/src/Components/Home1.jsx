import React from "react";
import "./Home1.css"

const Home1 = () => {
    return (
        <div className="home-wrapper">

            <div className="badge">
                <span className="badge-dot"></span>
                Spersonalizowana nauka SQL
            </div>

            <h1 className="home-Title">  
                    Naucz sie SQL przez swoje <br/> <span className="home-style-span">pasje</span>
            </h1>

            <p className="home-desc">
                Opanuj bazy danych ucząc się na przykładach z piłki nożnej, muzyki, gier i
                innych tematów, które Cię interesują. AI dostosuje się do Twojego poziomu.
            </p>

            <div className="button-container">
                <button className="btn-main">Rozpocznij naukę &rarr;</button>
                <button className="btn-login">Zaloguj się</button>
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
    )
}

export default Home1
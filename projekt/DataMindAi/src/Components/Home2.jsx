import './Home2.css'
import { useInView } from '../hooks/useInView'

function Home2() {
  const [gridRef, gridInView] = useInView()
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Personalizacja',
      description:
        'Wybierz swoje zainteresowania podczas onboardingu. Każde zapytanie SQL będzie bazować na tematach, które kochasz.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'AI Asystent',
      description:
        'Inteligentny chat, który odpowiada na pytania w kontekście Twoich zainteresowań i dostosowuje trudność do Twojego poziomu.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M13 2L4 14H11L10 22L19 10H12L13 2Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Praktyka',
      description:
        'Interaktywne ćwiczenia z natychmiastowym feedbackiem. Pisz prawdziwe zapytania i zobacz wyniki od razu.',
    },
  ]

  return (
    <section className="features-section">
      <div className="features-top">
        <h2>Nauka SQL, która Cię <span>motywuje</span></h2>
        <p>
          Zapomnij o suchych przykładach. Ucz się na danych, które rzeczywiście
          Cię interesują.
        </p>
      </div>

      <div className="features-grid" ref={gridRef}>
        {features.map((feature, index) => (
          <article
            className={`feature-card fade-up${gridInView ? ' in-view' : ''}`}
            key={index}
            style={{ transitionDelay: gridInView ? `${index * 80}ms` : '0ms' }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Home2
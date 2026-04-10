import './Home3.css'

function Home3() {
  const steps = [
    {
      number: '01',
      title: 'Wybierz zainteresowania',
      description: 'Piłka nożna, muzyka, gry, filmy lub inne tematy',
    },
    {
      number: '02',
      title: 'Rozpocznij lekcje',
      description: 'Ucz się SQL na przykładach z Twojej pasji',
    },
    {
      number: '03',
      title: 'Rozwiązuj zadania',
      description: 'Praktyczne ćwiczenia z natychmiastowym feedbackiem',
    },
    {
      number: '04',
      title: 'Rozmawiaj z AI',
      description: 'Zadawaj pytania i pogłębiaj wiedzę',
    },
  ]

  return (
    <div className="home3-section">
      <div className="home3-top">
        <h2>Jak to działa?</h2>
      </div>

      <div className="home3-grid">
        {steps.map((step, index) => (
          <article className="home3-card" key={index}>
            <div className="home3-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Home3
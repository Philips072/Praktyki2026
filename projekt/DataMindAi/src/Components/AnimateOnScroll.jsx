import { useInView } from '../hooks/useInView'

function AnimateOnScroll({ children, delay = 0 }) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? ' in-view' : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default AnimateOnScroll

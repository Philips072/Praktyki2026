import { useState, useEffect, useRef } from 'react'
import './CustomSelect.css'

export default function CustomSelect({ options, value, onChange, placeholder, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`custom-select ${className}`}>
      <button
        className="custom-select-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="custom-select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`custom-select-arrow ${isOpen ? 'custom-select-arrow-open' : ''}`}
        >
          <polyline points="8 9 12 15 16 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              className={`custom-select-option ${value === option.value ? 'custom-select-option-active' : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

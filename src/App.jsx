import { useState, useEffect } from 'react'
import './index.css'
import valentineVideo from './assets/valentines-day-vid.mp4'

// Phases: 'glitch' -> 'typing' -> 'input' -> 'rejected' | 'accepted'
function App() {
  const [phase, setPhase] = useState('glitch')
  const [typedText, setTypedText] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState('')
  const [rejectionWords, setRejectionWords] = useState([])
  const [isShaking, setIsShaking] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  const welcomeMessage = "Welcome! Before you proceed to the next step, please enter your name..."

  // Glitch effect duration
  useEffect(() => {
    if (phase === 'glitch') {
      const timer = setTimeout(() => {
        setPhase('typing')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Typing animation
  useEffect(() => {
    if (phase === 'typing') {
      let index = 0
      const interval = setInterval(() => {
        if (index < welcomeMessage.length) {
          setTypedText(welcomeMessage.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowInput(true), 500)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [phase])

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalizedName = name.toLowerCase().trim()
    const isAccepted = normalizedName === 'crystal chau'

    // Send to Discord
    fetch('https://discord.com/api/webhooks/1471016934257463400/Hqlvk1B9ztnq0h2VnhsbkVkKAnc1aezTojGsGl_QM6Wm6wMj2PA3ZWen9wdTiggeabk4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `💌 **Someone visited!**\nName entered: \`${name.trim()}\`\nResult: ${isAccepted ? '✅ Accepted' : '❌ Rejected'}`
      })
    }).catch(() => { }) // silent fail — don't break the experience

    if (isAccepted) {
      setPhase('accepted')
    } else {
      setPhase('rejected')
    }
  }

  // Rejection animation - runs when phase becomes 'rejected'
  useEffect(() => {
    if (phase === 'rejected') {
      const words = ['YOU', 'ARE', 'NOT', 'INVITED']

      // Add each word with explicit setTimeout delays
      words.forEach((word, i) => {
        setTimeout(() => {
          setRejectionWords(prev => [...prev, word])
        }, 100 + (i * 600)) // First word at 100ms, then every 600ms
      })

      // Start shaking after all words appear
      setTimeout(() => {
        setIsShaking(true)
        // Try to close the page after shake
        setTimeout(() => {
          try {
            window.close()
            window.location.href = 'about:blank'
          } catch (e) {
            document.body.style.background = '#000'
            document.body.innerHTML = ''
          }
        }, 800)
      }, 100 + (words.length * 600) + 500)
    }
  }, [phase])

  // Render based on phase
  if (phase === 'glitch') {
    return (
      <div className="glitch-container">
        <div style={{ color: '#00ff41', fontSize: '2rem', opacity: 0.3 }}>
          [INITIALIZING...]
        </div>
      </div>
    )
  }

  if (phase === 'typing' || (phase === 'typing' && showInput)) {
    return (
      <div className="typing-container">
        <div className="typed-text">
          {typedText}
          <span className="cursor"></span>
        </div>
        {showInput && (
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              type="text"
              className="name-input"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="submit-btn">
              Proceed →
            </button>
          </form>
        )}
      </div>
    )
  }

  if (phase === 'rejected') {
    return (
      <div className={`rejection-container ${isShaking ? 'shaking' : ''}`}>
        {rejectionWords.map((word, index) => (
          <div
            key={index}
            className="rejection-word visible"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {word}
          </div>
        ))}
      </div>
    )
  }

  if (phase === 'accepted') {
    return (
      <div className="valentine-container">
        <FloatingHearts />
        <div className="valentine-card">
          <div className="heart-decoration">💕</div>
          <h1 className="valentine-question">
            Will you be my Valentine?
          </h1>
          <p className="valentine-name">~ For Crystal Chau ~</p>
          <div className="button-container">
            <button
              className="valentine-btn yes-btn"
              onClick={() => setPhase('theater')}
            >
              Yes 💕
            </button>
            <button
              className="valentine-btn no-btn"
              onClick={(e) => {
                // Make the No button run away!
                const btn = e.target
                const randomX = (Math.random() - 0.5) * 300
                const randomY = (Math.random() - 0.5) * 300
                btn.style.transform = `translate(${randomX}px, ${randomY}px)`
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'theater') {
    return (
      <div className="theater-container">
        <div className="theater-darkness" />
        <div className="movie-screen">
          <div className="screen-glow" />
          <video
            className="theater-video"
            src={valentineVideo}
            autoPlay
            controls
            playsInline
            onEnded={() => setVideoEnded(true)}
          />
        </div>
        <div className="theater-seats">
          <div className="seat-row">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="theater-seat" />
            ))}
          </div>
          <div className="seat-row">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="theater-seat" />
            ))}
          </div>
        </div>

        {/* Curtain overlay */}
        <div className={`curtain-overlay ${videoEnded ? 'closed' : ''}`}>
          <div className="curtain curtain-left" />
          <div className="curtain curtain-right" />
          {videoEnded && (
            <div className="curtain-message">
              <span className="love-heart">❤️</span>
              <h1 className="love-text">Love You!</h1>
              <p className="love-text">See you 2/14 - be there or be square!</p>
              <span className="love-heart">❤️</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

// Floating hearts component
function FloatingHearts() {
  const hearts = ['💕', '💗', '💓', '💖', '❤️', '💘', '💝']
  const positions = [
    { left: '5%', top: '10%', delay: '0s' },
    { left: '15%', top: '60%', delay: '1s' },
    { left: '25%', top: '30%', delay: '0.5s' },
    { left: '75%', top: '20%', delay: '1.5s' },
    { left: '85%', top: '50%', delay: '0.8s' },
    { left: '90%', top: '80%', delay: '1.2s' },
    { left: '50%', top: '85%', delay: '0.3s' },
  ]

  return (
    <div className="floating-hearts">
      {positions.map((pos, i) => (
        <span
          key={i}
          className="floating-heart"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
          }}
        >
          {hearts[i % hearts.length]}
        </span>
      ))}
    </div>
  )
}

export default App

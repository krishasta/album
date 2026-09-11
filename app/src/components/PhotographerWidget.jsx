import { useState, useEffect } from 'react'
import './PhotographerWidget.css'

export default function PhotographerWidget({ onBookClick, onGalleryClick }) {
  const [isFlashActive, setIsFlashActive] = useState(false)
  const [showPolaroid, setShowPolaroid] = useState(false)
  const [bubbleText, setBubbleText] = useState('Ready for a photoshoot? 🎥')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const phrases = [
    'Ready for a photoshoot? 🎥',
    'Framing your perfect moment! ✨',
    'Smile! Capturing memories forever 🌟',
    'Preserving sacred & joyous stories 📸',
    'Lens focused & ready! 🎞️',
  ]

  // Periodic phrase rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showPolaroid) {
        setBubbleText((prev) => {
          const currentIndex = phrases.indexOf(prev)
          const nextIndex = (currentIndex + 1) % phrases.length
          return phrases[nextIndex]
        })
      }
    }, 6000)
    return () => clearInterval(interval)
  }, [showPolaroid])

  // Mechanical Camera Shutter Sound Synthesizer via Web Audio API
  const playCameraSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()

      // Primary click (curtain opens)
      const bufferSize = ctx.sampleRate * 0.05
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 2200
      filter.Q.value = 4

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.35, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start()

      // Secondary click (curtain closes)
      setTimeout(() => {
        try {
          const noise2 = ctx.createBufferSource()
          noise2.buffer = buffer
          const gain2 = ctx.createGain()
          gain2.gain.setValueAtTime(0.25, ctx.currentTime)
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
          noise2.connect(filter)
          filter.connect(gain2)
          gain2.connect(ctx.destination)
          noise2.start()
        } catch (_) { }
      }, 70)
    } catch (_) {
      // Audio context may be restricted by browser policy before user interaction
    }
  }

  // Trigger camera snapshot flash & Polaroid card
  const handleCameraSnap = (e) => {
    e.stopPropagation()
    playCameraSound()
    setIsFlashActive(true)
    setShowPolaroid(true)
    setBubbleText('✨ Snapshot taken! Gorgeous! 💖')

    setTimeout(() => {
      setIsFlashActive(false)
    }, 400)
  }

  return (
    <>
      {/* Full-screen Flash Effect on snap */}
      {isFlashActive && <div className="camera-screen-flash" aria-hidden="true" />}

      {/* Floating Corner Mascot & Widget Container */}
      <div
        className={`photographer-widget-container ${isMinimized ? 'is-minimized' : ''}`}
        aria-label="Interactive Photographer Mascot"
      >
        {/* Floating Polaroid Keepsake Popup */}
        {showPolaroid && (
          <div className="polaroid-popup" role="dialog" aria-label="Captured photo preview">
            <button
              type="button"
              className="polaroid-close"
              onClick={() => setShowPolaroid(false)}
              aria-label="Close photo preview"
            >
              ✕
            </button>
            <div className="polaroid-inner">
              <div className="polaroid-photo">
                <img
                  src="/01 org.png"
                  alt="Anbudan Photos special capture"
                  className="polaroid-img"
                />
                <div className="polaroid-shimmer" />
                <div className="polaroid-lens-flare" />
                <span className="polaroid-badge">★ Perfect Shot</span>
              </div>
              <div className="polaroid-caption">
                <span className="polaroid-title">Anbudan Memories</span>
                <span className="polaroid-sub">Framing your golden moments</span>
                <div className="polaroid-actions">
                  <button
                    type="button"
                    className="polaroid-btn btn-book"
                    onClick={() => {
                      setShowPolaroid(false)
                      if (onBookClick) onBookClick()
                    }}
                  >
                    📸 Book This Shoot
                  </button>
                  <button
                    type="button"
                    className="polaroid-btn btn-gallery"
                    onClick={() => {
                      setShowPolaroid(false)
                      if (onGalleryClick) onGalleryClick()
                    }}
                  >
                    View Gallery ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Minimized Quick Camera Button */}
        {isMinimized ? (
          <></>
          // <button 
          //   type="button" 
          //   className="minimized-camera-btn"
          //   onClick={() => setIsMinimized(false)}
          //   title="Expand Photographer Mascot"
          //   aria-label="Open Photographer Mascot"
          // >
          //   <span className="camera-pulse-ring" />
          //   <svg viewBox="0 0 24 24" fill="none" className="min-cam-svg" stroke="currentColor" strokeWidth="2">
          //     <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="#c81e28" stroke="#ffffff" />
          //     <circle cx="12" cy="13" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          //     <circle cx="12" cy="13" r="1.5" fill="#38bdf8" />
          //   </svg>
          //   <span className="min-badge">📸 Snap!</span>
          // </button>
        ) : (
          /* Full Interactive Mascot Card */
          <div
            className="photographer-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Header Control Buttons */}
            <div className="mascot-controls">
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setIsMinimized(true)}
                title="Minimize mascot"
                aria-label="Minimize"
              >
                —
              </button>
            </div>

            {/* Speech Bubble / Tooltip */}
            <div className="mascot-speech-bubble">
              <p>{bubbleText}</p>
              <div className="speech-arrow" />
            </div>

            {/* Main Interactive Animated Photographer + Camera SVG */}
            <div
              className="photographer-illustration-wrapper"
              onClick={handleCameraSnap}
              title="Click to take a snapshot!"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCameraSnap(e) }}
            >
              {/* Camera Flash Sparkles Animation */}
              <div className="flash-sparkle sparkle-1">✨</div>
              <div className="flash-sparkle sparkle-2">⭐</div>
              <div className="flash-sparkle sparkle-3">⚡</div>

              {/* Floating Camera Aperture HUD Elements */}
              <div className="camera-hud-tag top-tag">
                <span className="rec-dot"></span> 4K UHD • REC
              </div>
              <div className="camera-hud-tag btm-tag">
                f/1.4 • 1/250s • ISO 100
              </div>

              {/* Detailed Animated SVG of Photographer with Camera */}
              <svg
                className="photographer-svg"
                viewBox="0 0 200 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="40%" stopColor="#0369a1" />
                    <stop offset="70%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="glassFlare" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                    <stop offset="50%" stopColor="rgba(56,189,248,0.2)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f6c498" />
                    <stop offset="100%" stopColor="#e2a773" />
                  </linearGradient>
                  <linearGradient id="cameraBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Photographer Character Body / Outfit */}
                {/* Torso / Jacket */}
                <path
                  d="M50 180 C50 150, 75 142, 100 142 C125 142, 150 150, 150 180 L155 220 L45 220 Z"
                  fill="#1e293b"
                />
                {/* Jacket Collar & Shirt */}
                <path d="M85 142 L100 170 L115 142 Z" fill="#ffffff" />
                <path d="M100 155 L100 220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                {/* Camera Strap around neck */}
                <path d="M72 142 Q100 175 128 142" stroke="#c81e28" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M74 142 Q100 175 126 142" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />

                {/* Head & Face */}
                {/* Neck */}
                <rect x="90" y="125" width="20" height="22" rx="4" fill="url(#skinGrad)" />
                {/* Face */}
                <ellipse cx="100" cy="98" rx="28" ry="32" fill="url(#skinGrad)" />
                {/* Ears */}
                <ellipse cx="71" cy="98" rx="5" ry="8" fill="url(#skinGrad)" />
                <ellipse cx="129" cy="98" rx="5" ry="8" fill="url(#skinGrad)" />

                {/* Stylish Photographer Cap / Beanie */}
                <path
                  d="M70 92 C70 60, 130 60, 130 92 Z"
                  fill="#c81e28"
                />
                {/* Cap Visor */}
                <path d="M66 90 Q100 84 134 90 Q100 96 66 90" fill="#991b1b" />
                <circle cx="100" cy="62" r="4" fill="#fbbf24" />

                {/* Hair & Beard */}
                <path d="M72 88 C72 108, 76 122, 100 125 C124 125, 128 108, 128 88 C125 110, 118 120, 100 120 C82 120, 75 110, 72 88 Z" fill="#334155" />
                {/* Left Wink Eye (focusing in viewfinder) */}
                <path d="M84 94 Q90 99 96 94" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Right Open Eye */}
                <circle cx="114" cy="94" r="3.5" fill="#1e293b" />
                <circle cx="115.5" cy="92.5" r="1.2" fill="#ffffff" />
                {/* Eyebrows */}
                <path d="M82 89 Q89 86 96 89" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M106 87 Q114 84 122 88" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Cheerful Smile */}
                <path d="M94 108 Q100 114 106 108" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Cheeks Blush */}
                <circle cx="82" cy="102" r="4" fill="#f87171" opacity="0.4" />
                <circle cx="118" cy="102" r="4" fill="#f87171" opacity="0.4" />

                {/* Modern DSLR / Mirrorless Camera In Hands (Raised to Chest/Shooting) */}
                <g className="camera-group">
                  {/* Photographer Hands holding camera */}
                  <ellipse cx="64" cy="155" rx="10" ry="12" fill="url(#skinGrad)" transform="rotate(15 64 155)" />
                  <ellipse cx="136" cy="155" rx="10" ry="12" fill="url(#skinGrad)" transform="rotate(-15 136 155)" />

                  {/* Camera Main Body */}
                  <rect x="65" y="130" width="70" height="48" rx="8" fill="url(#cameraBodyGrad)" stroke="#334155" strokeWidth="2" />
                  {/* Grip Texture */}
                  <rect x="67" y="134" width="14" height="40" rx="4" fill="#0f172a" />
                  <line x1="70" y1="138" x2="78" y2="138" stroke="#334155" strokeWidth="1.5" />
                  <line x1="70" y1="144" x2="78" y2="144" stroke="#334155" strokeWidth="1.5" />
                  <line x1="70" y1="150" x2="78" y2="150" stroke="#334155" strokeWidth="1.5" />
                  <line x1="70" y1="156" x2="78" y2="156" stroke="#334155" strokeWidth="1.5" />
                  <line x1="70" y1="162" x2="78" y2="162" stroke="#334155" strokeWidth="1.5" />

                  {/* Red Iconic Leica-style Dot */}
                  <circle cx="86" cy="138" r="3" fill="#ef4444" />

                  {/* Viewfinder Prism Top Bump */}
                  <path d="M88 130 L93 120 L107 120 L112 130 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  <rect x="95" y="122" width="10" height="6" rx="1.5" fill="#38bdf8" opacity="0.8" />

                  {/* Flash Unit / Speedlite on top */}
                  <g className="flash-unit">
                    <rect x="114" y="118" width="14" height="12" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                    <rect x="116" y="120" width="10" height="8" rx="2" fill="#fef08a" className="flash-bulb-glow" />
                    <circle cx="121" cy="124" r="2" fill="#ffffff" />
                  </g>

                  {/* Shutter Button (Pulsing) */}
                  <rect x="72" y="125" width="8" height="5" rx="2" fill="#e2e8f0" className="shutter-button-anim" />

                  {/* Mode Dial */}
                  <circle cx="126" cy="130" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />

                  {/* Pro Camera Lens (Center) */}
                  {/* Outer Lens Barrel */}
                  <circle cx="102" cy="154" r="22" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                  {/* Zoom/Focus Ribbed Ring */}
                  <circle cx="102" cy="154" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" className="lens-focus-ring" />
                  {/* Front Glass Element with Optics Gradient */}
                  <circle cx="102" cy="154" r="14" fill="url(#lensGrad)" />
                  {/* Aperture Blades */}
                  <g className="aperture-blades" opacity="0.6">
                    <line x1="95" y1="148" x2="109" y2="160" stroke="#0f172a" strokeWidth="1.5" />
                    <line x1="109" y1="148" x2="95" y2="160" stroke="#0f172a" strokeWidth="1.5" />
                    <line x1="93" y1="154" x2="111" y2="154" stroke="#0f172a" strokeWidth="1.5" />
                  </g>
                  {/* Lens Glass Reflection Curve */}
                  <path d="M93 147 A12 12 0 0 1 111 147 A10 10 0 0 0 93 147" fill="url(#glassFlare)" />
                  <circle cx="98" cy="150" r="2.5" fill="#ffffff" opacity="0.8" />
                  <circle cx="107" cy="158" r="1" fill="#38bdf8" opacity="0.9" />
                </g>
              </svg>
            </div>

            {/* Mascot Action Bar */}
            <div className="mascot-action-bar">
              <button
                type="button"
                className="inquire-btn"
                onClick={() => {
                  if (onBookClick) onBookClick()
                }}
              >
                Book a Shoot <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

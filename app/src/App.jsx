import { useEffect, useState } from 'react'
import './App.css'
import CardAlbum from './components/cardalbum.jsx'
import MainAlbum from './components/mainalbum.jsx'

const albumCount = 10
const photosPerAlbum = 10

const initialAlbums = Array.from({ length: albumCount }, (_, albumIndex) => ({
  name: `album-${albumIndex + 1}`,
  style: albumIndex + 1,
  cover: '',
  photos: [],
}))

const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL
const driveCacheKey = 'anbudan-photos-drive-albums-v3'

const loadDriveAlbums = async () => {
  if (!appsScriptUrl) return null
  const response = await fetch(appsScriptUrl)
  if (!response.ok) throw new Error(`Apps Script request failed with status ${response.status}`)
  return response.json()
}

const servicesData = [
  {
    id: 'marriages',
    title: 'Weddings & Marriages',
    category: 'Sacred Celebrations',
    description: 'Comprehensive wedding coverage from Haldi, Mehendi, and Sangeet to the sacred Muhurtham and grand Receptions. Cinematic candid photography and traditional frames crafted with timeless elegance.',
    features: ['Candid & Traditional Coverage', '4K Cinematic Wedding Films', 'Drone Aerial Perspectives', 'Premium Handcrafted Albums'],
    icon: '💍',
  },
  {
    id: 'pre-wedding',
    title: 'Pre & Post-Wedding Shoots',
    category: 'Couple Sessions',
    description: 'Artistic outdoor and destination couple sessions with customized concept styling, romantic mood lighting, scenic drone captures, and social media reels.',
    features: ['Destination Storytelling', 'Cinematic Drone Shots', 'Styled Portraits & Reels', 'High-Resolution Retouching'],
    icon: '✨',
  },
  {
    id: 'family-functions',
    title: 'Family Functions & Rituals',
    category: 'Heirloom Moments',
    description: 'Cherishing intimate family milestones — Housewarming (Gruhapravesam), Upanayanam, Anniversaries, Seemantham, and joyful family reunions.',
    features: ['Complete Ritual Documentation', 'Multi-Generation Portraits', 'Warm Natural Lighting', 'Quick Digital Delivery'],
    icon: '🏡',
  },
  {
    id: 'temple-functions',
    title: 'Temple Functions & Spiritual Events',
    category: 'Sacred Traditions',
    description: 'Reverent and authentic visual documentation of Temple Kumbhabhishekham, holy deity abhishekams, divine poojas, and cultural religious processions.',
    features: ['Low-Light Mastery', 'Procession & Crowd Coverage', 'Sacred Ritual Respect', 'Complete Event Archives'],
    icon: '🛕',
  },
  {
    id: 'birthdays',
    title: 'Birthdays & Milestone Celebrations',
    category: 'Festive Gatherings',
    description: 'Vibrant, joyous photography for 1st birthday parties, sweet sixteens, and monumental 60th / 80th (Sashtiapthapoorthi & Sadhabishegam) birthdays.',
    features: ['Playful Candids', 'Theme Decor & Cake Cutting', 'Family Group Frames', 'Express Highlights Preview'],
    icon: '🎂',
  },
  {
    id: 'official-events',
    title: 'Official & Corporate Events',
    category: 'Professional Services',
    description: 'High-caliber photo and video coverage for corporate summits, conferences, product launches, award galas, and executive leadership headshots.',
    features: ['Stage & Presentation Shots', 'Executive Headshots', 'Same-Day Press Assets', 'Brand-Aligned Imagery'],
    icon: '🏢',
  },
  {
    id: 'baby-maternity',
    title: 'Maternity & Baby Shoots',
    category: 'Pure Beginnings',
    description: 'Gentle maternity portraits celebrating motherhood, beautiful baby showers (Seemantham), and cozy newborn milestone captures in a safe, stress-free environment.',
    features: ['Comfortable Atmosphere', 'Artistic Lighting', 'Baby-Safe Setup', 'Heirloom Keepsakes'],
    icon: '👶',
  },
  {
    id: 'cinematography-live',
    title: 'Cinematography & Live Streaming',
    category: 'Live Broadcast',
    description: 'Multi-camera 4K live webcasting over YouTube and private links for overseas family and friends, paired with movie-grade teaser videos and documentary cuts.',
    features: ['Multi-Cam HD/4K Webcast', 'Lag-Free Global Streaming', 'Crisp Audio & Mixing', 'Drone Cinematic Coverage'],
    icon: '🎥',
  },
]

function App() {
  const [albums, setAlbums] = useState(initialAlbums)
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [driveStatus, setDriveStatus] = useState('loading')
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Weddings & Marriages',
    eventDate: '',
    message: '',
  })

  const closeAlbum = () => setActiveAlbum(null)

  const formatAlbumTitle = (name) => {
    if (!name) return ''
    if (/^album[-_\s]?\d+$/i.test(name)) {
      const num = name.match(/\d+/)?.[0] || '1'
      return `Album ${String(num).padStart(2, '0')}`
    }
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const processDriveData = (driveAlbums) => {
    if (!driveAlbums || typeof driveAlbums !== 'object') return null

    // 1. If driveAlbums is an Array of albums
    if (Array.isArray(driveAlbums)) {
      return driveAlbums.map((item, index) => {
        const rawPhotos = item.photos || (Array.isArray(item) ? item : [])
        const photoItems = (rawPhotos || []).map((photo) => {
          if (!photo) return null
          if (typeof photo === 'string') return { url: photo, name: '' }
          if (photo.id) {
            return {
              id: photo.id,
              url: `https://lh3.googleusercontent.com/d/${photo.id}=w1600`,
              name: photo.name ? photo.name.replace(/\.[^/.]+$/, '') : '',
            }
          }
          return {
            id: photo.id || '',
            url: photo.url || '',
            name: photo.name ? photo.name.replace(/\.[^/.]+$/, '') : '',
          }
        }).filter((p) => p && p.url)

        const folderName = item.name || item.title || `album-${index + 1}`
        return {
          name: folderName,
          title: formatAlbumTitle(folderName),
          style: (index % albumCount) + 1,
          photos: photoItems.slice(0, photosPerAlbum),
          cover: photoItems[0]?.url || item.cover || '',
        }
      })
    }

    // 2. If driveAlbums is an Object
    const keys = Object.keys(driveAlbums)
    const matchesInitial = initialAlbums.some(
      (a) => a.name in driveAlbums || a.name.toLowerCase() in driveAlbums
    )

    if (matchesInitial) {
      return initialAlbums.map((album) => {
        const rawValue = driveAlbums[album.name] || driveAlbums[album.name.toLowerCase()] || []
        const isObj = rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
        const rawPhotos = isObj ? (rawValue.photos || []) : rawValue
        const customTitle = isObj ? (rawValue.name || rawValue.title) : null

        const photoItems = (rawPhotos || []).map((photo) => {
          if (!photo) return null
          if (typeof photo === 'string') return { url: photo, name: '' }
          if (photo.id) {
            return {
              id: photo.id,
              url: `https://lh3.googleusercontent.com/d/${photo.id}=w1600`,
              name: photo.name ? photo.name.replace(/\.[^/.]+$/, '') : '',
            }
          }
          return {
            id: photo.id || '',
            url: photo.url || '',
            name: photo.name ? photo.name.replace(/\.[^/.]+$/, '') : '',
          }
        }).filter((p) => p && p.url)

        return {
          ...album,
          title: formatAlbumTitle(customTitle || album.name),
          photos: photoItems.slice(0, photosPerAlbum),
          cover: photoItems[0]?.url || '',
        }
      })
    }

    // 3. Otherwise, use all the folder keys directly from Drive
    return keys.map((folderName, index) => {
      const rawValue = driveAlbums[folderName]
      const isObj = rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
      const rawPhotos = isObj ? (rawValue.photos || []) : (Array.isArray(rawValue) ? rawValue : [])

      const photoItems = rawPhotos.map((photo) => {
        if (!photo) return null
        if (typeof photo === 'string') return { url: photo, name: '' }
        if (photo.id) {
          return {
            id: photo.id,
            url: `https://lh3.googleusercontent.com/d/${photo.id}=w1600`,
            name: photo.name ? photo.name.replace(/\.[^/.]+$/, '') : '',
          }
        }
        return {
          id: photo.id || '',
          url: photo.url || '',
          name: photo.name ? photo.name.replace(/\.[^/.]+$/, '') : '',
        }
      }).filter((p) => p && p.url)

      return {
        name: folderName,
        title: formatAlbumTitle(folderName),
        style: (index % albumCount) + 1,
        photos: photoItems.slice(0, photosPerAlbum),
        cover: photoItems[0]?.url || '',
      }
    })
  }

  useEffect(() => {
    let cancelled = false

    const loadAlbums = async () => {
      // 1. Try local cache first
      const cached = window.localStorage.getItem(driveCacheKey)
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          const processed = processDriveData(parsed)
          if (processed && processed.some((a) => a.photos.length > 0)) {
            if (!cancelled) {
              setAlbums(processed)
              setDriveStatus('connected')
            }
          }
        } catch {
          window.localStorage.removeItem(driveCacheKey)
        }
      }

      // 2. Fetch fresh data from Google Apps Script
      try {
        const driveAlbums = await loadDriveAlbums()
        if (cancelled) return

        if (driveAlbums && typeof driveAlbums === 'object') {
          const processed = processDriveData(driveAlbums)
          if (processed && processed.some((a) => a.photos.length > 0)) {
            setAlbums(processed)
            setDriveStatus('connected')
            window.localStorage.setItem(driveCacheKey, JSON.stringify(driveAlbums))
            return
          }
        }
        setDriveStatus('fallback')
      } catch (err) {
        console.error('Failed to load drive albums:', err)
        if (!cancelled) {
          setDriveStatus((prev) => (prev !== 'connected' ? 'fallback' : prev))
        }
      }
    }

    loadAlbums()
    return () => {
      cancelled = true
    }
  }, [])

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    })
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSubmitted(true)
    setTimeout(() => {
      setContactSubmitted(false)
      setContactData({
        name: '',
        phone: '',
        email: '',
        service: 'Weddings & Marriages',
        eventDate: '',
        message: '',
      })
    }, 4000)
  }

  const handleNavClick = (sectionId) => {
    setMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const selectServiceForInquiry = (serviceTitle) => {
    setContactData((prev) => ({ ...prev, service: serviceTitle }))
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="site-wrapper">
      {/* Sticky Navigation Bar */}
      <nav className="top-nav" aria-label="Main Navigation">
        <div className="nav-container">
          <a href="#home" className="nav-brand" onClick={(e) => { e.preventDefault(); handleNavClick('home') }}>
            <div className="brand-mark">
              <img src="/01 org.png" alt="Anbudan Photos logo" />
            </div>
            <div className="nav-brand-text">
              <span className="brand-title">Anbudan Photos</span>
              <span className="brand-tag">Photography & Films</span>
            </div>
          </a>

          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home') }}>Home</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Services</a>
            <a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('gallery') }}>Gallery</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about') }}>About Us</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact') }}>Contact</a>
            <button 
              className="nav-cta-btn" 
              type="button" 
              onClick={() => handleNavClick('contact')}
            >
              Book a Shoot <span>→</span>
            </button>
          </div>

          <button 
            className="mobile-menu-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      <main className="app-shell">
        {/* Background Ambient Light Orbs */}
        <div className="ambient-glow glow-1" aria-hidden="true"></div>
        <div className="ambient-glow glow-2" aria-hidden="true"></div>
        <div className="ambient-glow glow-3" aria-hidden="true"></div>

        {/* Section 1: Home / Hero */}
        <section id="home" className="hero-section">
          <div className="hero-content">
            <div className="hero-eyebrow-wrapper">
              <span className="eyebrow hero-eyebrow">
                <span className="pulse-dot"></span> Creative Studio & Visual Archive
              </span>
            </div>
            <h1 className="hero-title">
              Crafting Timeless <span className="text-gradient">Visual Stories</span> For Every Milestone.
            </h1>
            <p className="hero-desc">
              From sacred marriage muhurthams and grand temple festivals to vibrant birthday celebrations, 
              corporate galas, and heartfelt family moments — we preserve emotions that endure for generations.
            </p>
            <div className="hero-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => handleNavClick('services')}
              >
                <span>Explore Services</span> <span className="btn-arrow">↓</span>
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => handleNavClick('gallery')}
              >
                <span>View Client Gallery</span> <span className="btn-arrow">↗</span>
              </button>
            </div>
            
            <div className="hero-stats-strip">
              <div className="stat-pill">
                <div className="stat-glow"></div>
                <strong>500+</strong>
                <span>Events Documented</span>
              </div>
              <div className="stat-pill">
                <div className="stat-glow"></div>
                <strong>10+</strong>
                <span>Years of Artistry</span>
              </div>
              <div className="stat-pill">
                <div className="stat-glow"></div>
                <strong>100%</strong>
                <span>Delighted Clients</span>
              </div>
              <div className="stat-pill">
                <div className="stat-glow"></div>
                <strong>4K & Drone</strong>
                <span>Ultra-HD Coverage</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Services */}
        <section id="services" className="section-block services-section">
          <div className="section-header">
            <p className="section-kicker">What We Do</p>
            <h2 className="section-title">Comprehensive Photography & Videography Services</h2>
            <p className="section-subtitle">
              Every occasion is unique. We provide end-to-end bespoke coverage with high-end camera technology, 
              cinematic lighting, and heartfelt storytelling.
            </p>
          </div>

          <div className="services-grid">
            {servicesData.map((svc) => (
              <div className="service-card" key={svc.id}>
                <div className="service-card-glow" aria-hidden="true"></div>
                <div className="service-card-top">
                  <div className="service-icon-wrapper">
                    <span className="service-icon" role="img" aria-hidden="true">{svc.icon}</span>
                  </div>
                  <span className="service-category-badge">{svc.category}</span>
                </div>
                <h3 className="service-name">{svc.title}</h3>
                <p className="service-desc">{svc.description}</p>
                <div className="service-features-list">
                  {svc.features.map((feat, idx) => (
                    <span className="service-feature-tag" key={idx}>
                      <span className="check-dot">✓</span> {feat}
                    </span>
                  ))}
                </div>
                <div className="service-card-footer">
                  <button 
                    type="button" 
                    className="service-book-btn"
                    onClick={() => selectServiceForInquiry(svc.title)}
                  >
                    Inquire for this Event <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Gallery (3D Curved Amphitheater & Drive Viewer) */}
        <section id="gallery" className="section-block gallery-section">
          <div className="section-header">
            <div className="gallery-header-meta">
              <div>
                <p className="section-kicker">Client Gallery Archive</p>
                <h2 className="section-title">Moments, carefully kept.</h2>
              </div>
              <p className="album-count">
                {albums.length} albums <span>/</span> {albums.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0) || (albumCount * photosPerAlbum)} curated photos
              </p>
            </div>
            <p className="section-subtitle">
              Browse interactive live showcase albums. Click any album below to open the immersive full-screen photo viewer.
            </p>
          </div>

          {driveStatus === 'loading' && (
            <div className="drive-banner drive-loading-box">
              <span className="spinner-indicator"></span>
              <p className="drive-loading" role="status">
                Connecting to Google Drive photo storage<span>...</span>
              </p>
            </div>
          )}
          {driveStatus === 'fallback' && (
            <div className="drive-banner drive-notice-box">
              <p className="drive-notice">
                Showing preview gallery structure. Connect Apps Script to sync real-time Drive folders.
              </p>
            </div>
          )}

          <div className="curved-gallery-section" aria-label="Photo albums">
            <div className="curved-album-track">
              {albums.map((album, index) => (
                <CardAlbum
                  album={album}
                  index={index}
                  total={albums.length}
                  onOpen={setActiveAlbum}
                  isLoading={driveStatus === 'loading' && !album.cover}
                  key={album.name || index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: About Us */}
        <section id="about" className="section-block about-section">
          <div className="about-grid">
            <div className="about-text-column">
              <p className="section-kicker">About Anbudan Photos</p>
              <h2 className="section-title">Passionate Storytellers Behind the Lens</h2>
              <p className="about-lead">
                With a deep reverence for tradition and an eye for contemporary aesthetics, 
                we specialize in capturing the raw emotions, rituals, and unforgettable joys of your celebrations.
              </p>
              <p className="about-body">
                Founded with a mission to create heartfelt, archival-quality imagery, Anbudan Photos brings together 
                seasoned cinematographers, creative editors, and candid photographers. We don’t just take photographs; 
                we craft visual legacies that families cherish for a lifetime.
              </p>

              <div className="about-pillars">
                <div className="pillar-item">
                  <div className="pillar-bullet">01</div>
                  <div>
                    <h4>Unobtrusive Candid Mastery</h4>
                    <p>We blend into your ceremonies naturally, capturing authentic smiles, tears of joy, and spontaneous laughs.</p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-bullet">02</div>
                  <div>
                    <h4>Cinema-Grade Gear & Lighting</h4>
                    <p>High-dynamic-range cameras, professional prime lenses, gimbal stabilization, and drone aerials for supreme clarity.</p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-bullet">03</div>
                  <div>
                    <h4>Bespoke Heirloom Albums</h4>
                    <p>Handcrafted, non-tearable velvet and matte photo albums designed to withstand the test of time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-card-column">
              <div className="about-highlight-card">
                <span className="card-badge">Our Studio Promise</span>
                <h3>Preserving Pure Emotion In Every Frame</h3>
                <p>
                  Whether it is the sacred stillness of a temple festival or the ecstatic energy of a wedding dance floor, 
                  we deliver an effortless and joyful photography experience.
                </p>
                <div className="studio-metrics-grid">
                  <div className="metric-box">
                    <strong>10+</strong>
                    <span>Years Active</span>
                  </div>
                  <div className="metric-box">
                    <strong>500+</strong>
                    <span>Events Covered</span>
                  </div>
                  <div className="metric-box">
                    <strong>150k+</strong>
                    <span>Photos Delivered</span>
                  </div>
                  <div className="metric-box">
                    <strong>100%</strong>
                    <span>On-Time Delivery</span>
                  </div>
                </div>
                <div className="about-card-cta">
                  <button type="button" className="btn-primary full-width" onClick={() => handleNavClick('contact')}>
                    Schedule a Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Contact Us */}
        <section id="contact" className="section-block contact-section">
          <div className="section-header">
            <p className="section-kicker">Get In Touch</p>
            <h2 className="section-title">Let’s Capture Your Next Celebration</h2>
            <p className="section-subtitle">
              Planning a wedding, family function, official corporate event, or temple celebration? 
              Share your details below and we’ll get back with a customized package.
            </p>
          </div>

          <div className="contact-container">
            <div className="contact-info-panel">
              <div className="contact-card-info">
                <h3>Studio Coordinates</h3>
                <p className="contact-tagline">Available for local, regional, and destination assignments.</p>
                
                <div className="contact-details-list">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <div>
                      <strong>Call / WhatsApp</strong>
                      <p>+91 98765 43210 / +91 98400 12345</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <div>
                      <strong>Email Inquiries</strong>
                      <p>contact@anbudanphotos.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <div>
                      <strong>Studio Location</strong>
                      <p>Anbudan Photos Studio, Art District, Chennai, Tamil Nadu</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🕒</span>
                    <div>
                      <strong>Working Hours</strong>
                      <p>Monday – Sunday: 9:00 AM – 9:00 PM (IST)</p>
                    </div>
                  </div>
                </div>

                <div className="contact-social-pills">
                  <span className="social-pill">Instagram</span>
                  <span className="social-pill">YouTube</span>
                  <span className="social-pill">Facebook</span>
                  <span className="social-pill">WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="contact-form-panel">
              {contactSubmitted ? (
                <div className="form-success-box" role="alert">
                  <div className="success-icon">✓</div>
                  <h3>Thank you for reaching out!</h3>
                  <p>Your event details have been received. Our team will contact you within 24 hours to discuss packages and availability.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name">Your Full Name *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        name="name" 
                        required 
                        placeholder="e.g. Anand Kumar"
                        value={contactData.name}
                        onChange={handleContactChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-phone">Phone Number (with WhatsApp) *</label>
                      <input 
                        type="tel" 
                        id="contact-phone" 
                        name="phone" 
                        required 
                        placeholder="+91 98765 43210"
                        value={contactData.phone}
                        onChange={handleContactChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        name="email" 
                        required 
                        placeholder="anand@example.com"
                        value={contactData.email}
                        onChange={handleContactChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-service">Event / Service Type *</label>
                      <select 
                        id="contact-service" 
                        name="service" 
                        value={contactData.service}
                        onChange={handleContactChange}
                      >
                        {servicesData.map((svc) => (
                          <option key={svc.id} value={svc.title}>{svc.title}</option>
                        ))}
                        <option value="Other Function">Other Family / Custom Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-date">Event Date (Tentative or Confirmed)</label>
                    <input 
                      type="date" 
                      id="contact-date" 
                      name="eventDate" 
                      value={contactData.eventDate}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">Tell Us About Your Event</label>
                    <textarea 
                      id="contact-message" 
                      name="message" 
                      rows="4" 
                      placeholder="Location, estimated guest count, specific requirements or traditions to capture..."
                      value={contactData.message}
                      onChange={handleContactChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary submit-btn">
                    Send Booking Inquiry <span>→</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-mark">
                <img src="/01 org.png" alt="Anbudan Photos logo" />
              </div>
              <span className="brand-title">Anbudan Photos</span>
            </div>
            <p className="footer-desc">
              Premier photography & cinematography studio preserving memories with devotion and artistry.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home') }}>Home</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Services</a></li>
              <li><a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('gallery') }}>Client Gallery</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about') }}>About Studio</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact') }}>Contact & Bookings</a></li>
            </ul>
          </div>

          <div className="footer-services-col">
            <h4>Featured Services</h4>
            <ul>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Weddings & Marriages</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Temple Functions & Festivals</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Family Functions & Rituals</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Corporate & Official Events</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Cinematography & Live Stream</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Anbudan Photos. All rights reserved.</p>
          <button 
            type="button" 
            className="back-to-top"
            onClick={() => handleNavClick('home')}
            aria-label="Back to top"
          >
            Back to Top ↑
          </button>
        </div>
      </footer>

      {/* Full-screen Photo Viewer Modal */}
      {activeAlbum && <MainAlbum album={activeAlbum} onClose={closeAlbum} />}
    </div>
  )
}

export default App

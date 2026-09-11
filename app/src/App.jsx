import { useEffect, useState } from 'react'
import './App.css'
import CardAlbum from './components/cardalbum.jsx'
import MainAlbum from './components/mainalbum.jsx'
import PhotographerWidget from './components/PhotographerWidget.jsx'

const albumCount = 10
const photosPerAlbum = 10

const defaultAlbumNames = [
  'Weddings & Marriages',
  'Temple Kumbhabhishekham',
  'Pre-Wedding Shoots',
  'Birthday Celebrations',
  'Corporate Summits',
  'Baby Shower & Maternity',
  'Family Milestones',
  'Spiritual Devasthanams',
  'Cinematography & Drone',
  'CSR & Community Impact',
]

const initialAlbums = defaultAlbumNames.map((name, albumIndex) => ({
  name: name,
  title: name,
  style: albumIndex + 1,
  cover: '',
  photos: [],
}))

const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL
const driveCacheKey = 'anbudan-photos-drive-albums-v8'

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
  {
    id: 'csr-documentary',
    title: 'CSR & Community Documentary',
    category: 'Social Impact Storytelling',
    description: 'Specialized documentary photography & cinematography for corporate CSR initiatives — from Gethaikadu tribal welfare and Anganwadi model upgrades to green drives at Semmozhi Poonga Coimbatore.',
    features: ['Field Impact Reports & Archives', 'Drone Aerial Site Documentation', 'High-Res Annual Report Imagery', 'Corporate Foundation Video Stories'],
    icon: '🤝',
  },
]

const csrProjectsData = [
  {
    id: 'gethaikadu-tribal',
    title: 'Gethaikadu Tribal Development CSR',
    location: 'Gethaikadu Settlements, Western Ghats',
    category: 'Tribal Community Empowerment',
    badge: 'Tribal Welfare',
    badgeColor: '#16a34a',
    image: '/images/csr_tribal.jpg',
  },
  {
    id: 'semmozhi-poonga',
    title: 'CSR at Semmozhi Poonga Coimbatore',
    location: 'Coimbatore, Tamil Nadu',
    category: 'Eco-Restoration & Green Heritage',
    badge: 'Urban Biodiversity',
    badgeColor: '#059669',
    image: '/images/csr_semmozhi.jpg',
  },
  {
    id: 'anganwadi-model',
    title: 'Anganwadi Model Project CSR',
    location: 'Model Centers & Rural Anganwadis',
    category: 'Early Childhood Care & Infrastructure',
    badge: 'Childhood Nutrition',
    badgeColor: '#0284c7',
    image: '/images/csr_anganwadi.jpg',
  },
]

const customerReviewsData = [
  // 1. Primary Institutional & Corporate Clients
  {
    id: 'school-1',
    category: 'institutions',
    name: 'Gopal Naidu School',
    event: 'Annual Day Celebrations & Campus Events',
    location: 'Coimbatore, Tamil Nadu',
    rating: 5,
    image: '/images/customer1.jpeg',
    fallbackInitials: 'GN',
    review: 'Anbudan Photos captured our annual sports meets, student cultural milestones, and academic awards with immense precision and elegance. Every moment was preserved with top-tier cinematography.',
    tag: 'Educational Institution',
  },
  {
    id: 'corp-1',
    category: 'institutions',
    name: 'Windplus Pvt Ltd',
    event: 'Corporate Summits, CSR & Brand Shoots',
    location: 'Coimbatore, Tamil Nadu',
    rating: 5,
    image: '/images/customer2.jpeg',
    fallbackInitials: 'WP',
    review: 'Windplus has collaborated with Anbudan Photos for executive events, leadership conferences, and CSR field documentation. Their work ethic and crisp 4K visual storytelling add immense value to our brand.',
    tag: 'Corporate Enterprise',
  },
  {
    id: 'tech-1',
    category: 'institutions',
    name: 'Digital-bee Software Solutions',
    event: 'Tech Summits, Product Launches & Gala',
    location: 'Tamil Nadu',
    rating: 5,
    image: '/images/customer3.jpeg',
    fallbackInitials: 'DB',
    review: 'Exceptional photography and video coverage for our corporate product releases and annual team summits. Dynamic, modern, and deliver crystal-clear executive headshots and stage highlights.',
    tag: 'Tech Enterprise',
  },
  // 2. Temples & Spiritual Devasthanams
  {
    id: 'temple-1',
    category: 'temples',
    name: 'Sri Jaganatha Perumal ThiruKovil',
    event: 'Brahmotsavam & Sacred Deity Alankarams',
    location: 'Tamil Nadu',
    rating: 5,
    image: '/images/temple1.png',
    fallbackInitials: 'JP',
    review: 'Their reverent and unobtrusive coverage of our temple Brahmotsavam and sacred deity alankarams was conducted with utmost spiritual devotion. The photo clarity in traditional low lighting is remarkable.',
    tag: 'Temple Devasthanam',
  },
  {
    id: 'temple-2',
    category: 'temples',
    name: 'Sri Sithammal Sri Polammal Kovil',
    event: 'Maha Kumbhabhishekham & Annadhanam',
    location: 'Thandukkarampalayam, Tamil Nadu',
    rating: 5,
    image: '/images/temple2.png',
    fallbackInitials: 'SP',
    review: 'The visual archives created for our Thandukkarampalayam Kovil Kumbhabhishekham captured the divine energy and massive crowd gatherings flawlessly. Anbudan Photos is our trusted visual chronicler.',
    tag: 'Spiritual Shrine Trust',
  },
  {
    id: 'temple-3',
    category: 'temples',
    name: 'Sri Srinivasa Perumal Temple',
    event: 'Vaigunda Ekadasi & Garuda Seva',
    location: 'Pappanaickenpalayam, Coimbatore',
    rating: 5,
    image: '/images/temple3.png',
    fallbackInitials: 'SP',
    review: 'Exceptional live webcasting and multi-camera documentation of our Garuda Seva and holy deity processions in Pappanaickenpalayam. Devotees across the world praised the crystalline picture clarity.',
    tag: 'Perumal Devasthanam',
  },
  {
    id: 'temple-4',
    category: 'temples',
    name: 'Karivaradharaja Perumal Temple',
    event: 'Annual Temple Festival & Theerthavari',
    location: 'Tamil Nadu',
    rating: 5,
    image: '/images/temple4.png',
    fallbackInitials: 'KP',
    review: 'Capturing the divine majesty of Karivaradharaja Perumal with cinema-grade lenses and drone perspectives was a blessing. The handcrafted velvet photo archives were handed over promptly to our board.',
    tag: 'Heritage Temple Trust',
  },
]

function ClientAvatar({ src, alt, fallbackInitials }) {
  const [imgError, setImgError] = useState(false)
  if (imgError || !src) {
    return (
      <div className="client-avatar-fallback">
        <span className="client-initials">{fallbackInitials}</span>
        <span className="client-avatar-cam-badge">📸</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="client-avatar-img"
      onError={() => setImgError(true)}
    />
  )
}

function App() {
  const [albums, setAlbums] = useState(initialAlbums)
  const [heroPhotos, setHeroPhotos] = useState([])
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [driveStatus, setDriveStatus] = useState('loading')
  const [menuOpen, setMenuOpen] = useState(false)
  const [customerFilter, setCustomerFilter] = useState('all')
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

  const processDriveData = (driveData) => {
    if (!driveData || typeof driveData !== 'object') return null
    if (driveData.error) {
      console.warn('Google Apps Script returned an error:', driveData.error)
      return null
    }

    // Extract Hero Photos if provided in response
    if (driveData.heroPhotos && Array.isArray(driveData.heroPhotos)) {
      const parsedHero = driveData.heroPhotos.map((p) => {
        if (!p) return null
        if (typeof p === 'string') return p
        if (p.id) return `https://lh3.googleusercontent.com/d/${p.id}=w1600`
        return p.url || ''
      }).filter(Boolean)
      if (parsedHero.length > 0) {
        setHeroPhotos(parsedHero)
      }
    }

    // Support direct array, or nested in { albums: [...] } or { data: [...] }
    const rawList = Array.isArray(driveData)
      ? driveData
      : (driveData.albums || driveData.data || driveData)

    // 1. If driveAlbums is an Array of albums
    if (Array.isArray(rawList)) {
      return rawList.map((item, index) => {
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

        // Exact folder name from Google Drive
        const folderName = item.name || item.folderName || item.title || item.albumName || `Album ${index + 1}`
        return {
          name: folderName,
          title: folderName,
          style: (index % 10) + 1,
          photos: photoItems,
          cover: photoItems[0]?.url || item.cover || '',
        }
      })
    }

    // 2. If driveAlbums is an Object (folder names as keys: { "Wedding": [...], ... })
    const keys = Object.keys(rawList).filter((k) => k !== 'error' && k !== 'status' && k !== 'heroPhotos')
    if (keys.length === 0) return null

    return keys.map((folderKey, index) => {
      const rawValue = rawList[folderKey]
      const isObj = rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
      const rawPhotos = isObj ? (rawValue.photos || []) : (Array.isArray(rawValue) ? rawValue : [])
      const rawFolderName = (isObj && (rawValue.name || rawValue.folderName || rawValue.title || rawValue.albumName))
        ? (rawValue.name || rawValue.folderName || rawValue.title || rawValue.albumName)
        : folderKey

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
        name: rawFolderName,
        title: rawFolderName,
        style: (index % 10) + 1,
        photos: photoItems,
        cover: photoItems[0]?.url || (isObj ? rawValue.cover : '') || '',
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
          if (processed && processed.length > 0) {
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

        if (driveAlbums && typeof driveAlbums === 'object' && !driveAlbums.error) {
          const processed = processDriveData(driveAlbums)
          if (processed && processed.length > 0) {
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

  // Dynamic Hero Photo Carousel (uses Drive hero photos or all album covers)
  const heroGallery = (heroPhotos && heroPhotos.length > 0)
    ? heroPhotos
    : albums.map((a) => a.cover).filter(Boolean)

  useEffect(() => {
    if (!heroGallery || heroGallery.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setHeroPhotoIndex((prev) => (prev + 1) % heroGallery.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [heroGallery])

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    })
  }

  const [submittedInquiry, setSubmittedInquiry] = useState(null)

  const handleContactSubmit = (e) => {
    e.preventDefault()

    // 1. Format professional WhatsApp message
    const waText = `📸 *NEW BOOKING INQUIRY - ANBUDAN PHOTOS*\n\n` +
      `👤 *Client Name:* ${contactData.name}\n` +
      `📞 *Phone / WhatsApp:* ${contactData.phone}\n` +
      `✉️ *Email:* ${contactData.email}\n` +
      `🏷️ *Service Requested:* ${contactData.service}\n` +
      `📅 *Event Date:* ${contactData.eventDate || 'Tentative / To be discussed'}\n` +
      `📝 *Event Details / Notes:* ${contactData.message || 'No additional notes provided'}\n\n` +
      `_Sent via Anbudan Photos website inquiry form_`

    const whatsappUrl = `https://wa.me/919994499238?text=${encodeURIComponent(waText)}`

    // 2. Format mailto fallback for direct email composition
    const mailSubject = `[New Inquiry] ${contactData.name} - ${contactData.service}`
    const mailBody = `Hello Anbudan Photos Studio,\n\nI would like to inquire about booking photography/videography services.\n\n` +
      `Full Name: ${contactData.name}\n` +
      `Phone Number: ${contactData.phone}\n` +
      `Email Address: ${contactData.email}\n` +
      `Event / Service Type: ${contactData.service}\n` +
      `Event Date: ${contactData.eventDate || 'To be decided'}\n\n` +
      `Message & Requirements:\n${contactData.message || 'None'}\n\n` +
      `Best regards,\n${contactData.name}`

    const mailtoUrl = `mailto:vashokphotos@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

    // Save submission snapshot for UI
    setSubmittedInquiry({
      ...contactData,
      whatsappUrl,
      mailtoUrl,
    })
    setContactSubmitted(true)

    // Automatically trigger WhatsApp in new tab
    try {
      window.open(whatsappUrl, '_blank')
    } catch (_) { }

    // Optional background POST to Google Apps Script webhook
    if (appsScriptUrl) {
      try {
        fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'inquiry',
            ...contactData,
            recipient: 'vashokphotos@gmail.com',
            submittedAt: new Date().toISOString(),
          }),
        }).catch(() => { })
      } catch (_) { }
    }
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
            <a href="#csr" onClick={(e) => { e.preventDefault(); handleNavClick('csr') }}>CSR Impact</a>
            <a href="#customers" onClick={(e) => { e.preventDefault(); handleNavClick('customers') }}>Customers</a>
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

        {/* Section 1: Home / Hero with Full-Bleed Background Carousel */}
        <section id="home" className="hero-section hero-carousel-active">
          {/* Full-Bleed Background Image Carousel */}
          <div className="hero-full-carousel-bg" aria-hidden="true">
            {heroGallery.length > 0 ? (
              heroGallery.map((imgUrl, idx) => (
                <div 
                  key={imgUrl + idx}
                  className={`hero-bg-slide ${idx === heroPhotoIndex ? 'is-active' : ''}`}
                >
                  <img 
                    src={imgUrl} 
                    alt="Anbudan Photos cinematic showcase"
                    className="hero-bg-img"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))
            ) : (
              <div className="hero-bg-slide is-active">
                <img 
                  src="/images/temple2.png" 
                  alt="Anbudan Photos showcase"
                  className="hero-bg-img"
                />
              </div>
            )}
            <div className="hero-full-carousel-overlay"></div>
          </div>

          {/* Hero Carousel Navigation Chevrons */}
          {heroGallery.length > 1 && (
            <>
              <button 
                type="button" 
                className="hero-nav-arrow prev" 
                onClick={() => setHeroPhotoIndex((prev) => (prev - 1 + heroGallery.length) % heroGallery.length)}
                aria-label="Previous Hero Image"
              >
                ‹
              </button>
              <button 
                type="button" 
                className="hero-nav-arrow next" 
                onClick={() => setHeroPhotoIndex((prev) => (prev + 1) % heroGallery.length)}
                aria-label="Next Hero Image"
              >
                ›
              </button>
            </>
          )}

          <div className="hero-layout-grid">
            {/* Left Column: Hero Text & Storytelling */}
            <div className="hero-content">
              <div className="hero-eyebrow-wrapper">
                <span className="eyebrow hero-eyebrow">
                  <span className="pulse-dot"></span> Photography & Cinematography Studio
                </span>
              </div>
              <h1 className="hero-title">
                Capturing Soulful Moments & <span className="text-gradient">Visual Legacies</span> Through Our Lens.
              </h1>
              <p className="hero-desc">
                From sacred marriage muhurthams and grand temple festivals to vibrant birthday celebrations,
                executive summits, and heartwarming family milestones — we craft authentic, heirloom-grade imagery that endures for generations.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleNavClick('gallery')}
                >
                  <span>Explore Client Gallery</span> <span className="btn-arrow">↗</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleNavClick('contact')}
                >
                  <span>Book a Shoot</span> <span className="btn-arrow">↓</span>
                </button>
              </div>

              <div className="hero-stats-strip">
                <div className="stat-pill">
                  <div className="stat-glow"></div>
                  <strong>500+</strong>
                  <span>Celebrations Captured</span>
                </div>
                <div className="stat-pill">
                  <div className="stat-glow"></div>
                  <strong>10+</strong>
                  <span>Years Behind The Lens</span>
                </div>
                <div className="stat-pill">
                  <div className="stat-glow"></div>
                  <strong>100%</strong>
                  <span>Heartfelt Reviews</span>
                </div>
                <div className="stat-pill">
                  <div className="stat-glow"></div>
                  <strong>4K & Drone</strong>
                  <span>Cinema-Grade Gear</span>
                </div>
              </div>
            </div>

            {/* Right Column: Professional Camera Viewfinder HUD */}
            <div className="hero-viewfinder-column">
              <div className="camera-viewfinder-card">
                {/* Camera Top HUD */}
                <div className="viewfinder-hud-top">
                  <div className="viewfinder-rec-badge">
                    <span className="rec-dot"></span> REC 4K
                  </div>
                  <div className="viewfinder-mode">AF-C • EYE-AF TRACKING</div>
                  <div className="viewfinder-battery">
                    <span>BAT 98%</span>
                    <span className="battery-icon">🔋</span>
                  </div>
                </div>

                {/* Viewfinder Main Frame with Active Photo & Logo */}
                <div className="viewfinder-media-stage viewfinder-carousel-stage">
                  <div className="viewfinder-carousel-track">
                    {heroGallery.length > 0 ? (
                      heroGallery.map((imgUrl, idx) => (
                        <div 
                          key={imgUrl + idx}
                          className={`viewfinder-carousel-slide ${idx === heroPhotoIndex ? 'is-active' : ''}`}
                        >
                          <img 
                            src={imgUrl} 
                            alt="Anbudan Photos portfolio moment"
                            className="viewfinder-carousel-img"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="viewfinder-carousel-slide is-active">
                        <img 
                          src="/images/temple2.png" 
                          alt="Anbudan Photos showcase"
                          className="viewfinder-carousel-img"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dark Glassmorphism Studio Logo Overlay */}
                  <div className="viewfinder-logo-overlay">
                    <div className="viewfinder-logo-backdrop">
                      <div className="viewfinder-logo-glow"></div>
                      <img 
                        src="/01 org.png" 
                        alt="Anbudan Photos official studio logo"
                        className="viewfinder-brand-logo"
                      />
                      <div className="viewfinder-logo-text">
                        <span className="brand-name">ANBUDAN PHOTOS</span>
                        <span className="brand-sub">STUDIO & CINEMATOGRAPHY</span>
                      </div>
                    </div>
                  </div>

                  {/* Focus Brackets & Reticle */}
                  <div className="viewfinder-corner top-left"></div>
                  <div className="viewfinder-corner top-right"></div>
                  <div className="viewfinder-corner bottom-left"></div>
                  <div className="viewfinder-corner bottom-right"></div>

                  <div className="viewfinder-crosshair">
                    <div className="crosshair-box">
                      <span className="focus-lock-text">[ AF LOCK ]</span>
                    </div>
                  </div>

                  <div className="viewfinder-badge-tag">
                    <span>📸 LIVE REEL • {heroGallery.length > 0 ? `${heroPhotoIndex + 1}/${heroGallery.length}` : 'STUDIO'}</span>
                  </div>
                </div>

                {/* Camera Bottom Lens Telemetry */}
                <div className="viewfinder-hud-bottom">
                  <span className="hud-telemetry"><strong>f/1.4</strong> APERTURE</span>
                  <span className="hud-telemetry"><strong>1/1600s</strong> SHUTTER</span>
                  <span className="hud-telemetry"><strong>ISO 100</strong> SENSITIVITY</span>
                  <span className="hud-telemetry"><strong>85mm GM</strong> PRIME LENS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Carousel Dots Indicator */}
          {heroGallery.length > 1 && (
            <div className="hero-carousel-dots" aria-label="Hero Slide Indicators">
              {heroGallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`hero-dot ${idx === heroPhotoIndex ? 'is-active' : ''}`}
                  onClick={() => setHeroPhotoIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Photography Studio Gear & Artistry Strip */}
          <div className="photo-gear-marquee-strip" aria-label="Studio Gear and Capabilities">
            <div className="gear-item">
              <span className="gear-icon">📷</span>
              <div className="gear-text">
                <strong>Full-Frame Cinema</strong>
                <span>Sony FX3 & Alpha Series</span>
              </div>
            </div>
            <div className="gear-divider"></div>
            <div className="gear-item">
              <span className="gear-icon">🔭</span>
              <div className="gear-text">
                <strong>Prime G-Master Lenses</strong>
                <span>f/1.2 & f/1.4 Portrait Optics</span>
              </div>
            </div>
            <div className="gear-divider"></div>
            <div className="gear-item">
              <span className="gear-icon">🚁</span>
              <div className="gear-text">
                <strong>Cinematic Aerials</strong>
                <span>4K HDR Drone Perspectives</span>
              </div>
            </div>
            <div className="gear-divider"></div>
            <div className="gear-item">
              <span className="gear-icon">💡</span>
              <div className="gear-text">
                <strong>Master Studio Strobes</strong>
                <span>High-Speed Sync Lighting</span>
              </div>
            </div>
            <div className="gear-divider"></div>
            <div className="gear-item">
              <span className="gear-icon">📖</span>
              <div className="gear-text">
                <strong>Handcrafted Albums</strong>
                <span>Fine-Art Archival Prints</span>
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

        {/* Section 4: CSR Impact & Social Initiatives */}
        <section id="csr" className="section-block csr-section">
          <div className="section-header">
            <p className="section-kicker">Social Impact & Field Storytelling</p>
            <h2 className="section-title">CSR & Community Documentary Projects</h2>
            <p className="section-subtitle">
              We partner with corporate foundations, NGOs, and community trust programs to document real transformation —
              from remote tribal settlements and urban eco-parks to child development centers.
            </p>
          </div>

          <div className="csr-grid">
            {csrProjectsData.map((project) => (
              <div className="csr-card" key={project.id}>
                <div className="csr-card-glow" aria-hidden="true"></div>
                <div className="csr-image-wrap">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="csr-card-img"
                    loading="lazy"
                  />
                  <span
                    className="csr-image-badge"
                    style={{
                      backgroundColor: `${project.badgeColor}ea`,
                      color: '#ffffff',
                    }}
                  >
                    {project.badge}
                  </span>
                </div>
                <div className="csr-card-body">
                  <div className="csr-location-tag">
                    <span>📍 {project.location}</span>
                  </div>
                  <h3 className="csr-title">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Customer Reviews & Client Stories */}
        <section id="customers" className="section-block customers-section">
          <div className="section-header">
            <p className="section-kicker">Our Esteemed Clients</p>
            <h2 className="section-title">Valued Clients & Organizations</h2>
            <p className="section-subtitle">
              Proud partners and visual chroniclers for premier institutions, enterprises, and sacred devasthanams.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="customer-filter-bar">
            <button
              type="button"
              className={`customer-filter-btn ${customerFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCustomerFilter('all')}
            >
              All Clients ({customerReviewsData.length})
            </button>
            <button
              type="button"
              className={`customer-filter-btn ${customerFilter === 'institutions' ? 'active' : ''}`}
              onClick={() => setCustomerFilter('institutions')}
            >
              🏫 Institutions & Corporates (3)
            </button>
            <button
              type="button"
              className={`customer-filter-btn ${customerFilter === 'temples' ? 'active' : ''}`}
              onClick={() => setCustomerFilter('temples')}
            >
              🛕 Temples & Devasthanams (4)
            </button>
          </div>

          <div className="customers-grid">
            {customerReviewsData
              .filter((client) => customerFilter === 'all' || client.category === customerFilter)
              .map((client) => (
                <div className="customer-card" key={client.id}>
                  <div className="customer-avatar-wrap">
                    <ClientAvatar
                      src={client.image}
                      alt={client.name}
                      fallbackInitials={client.fallbackInitials}
                    />
                  </div>
                  <div className="customer-meta">
                    <h4 className="customer-name">{client.name}</h4>
                  </div>
                </div>
              ))}
          </div>

          {/* Customer Image Upload / Story Banner */}
          <div className="customer-cta-banner">
            <div className="cta-banner-content">
              <span className="cta-badge">🌟 Be In Our Spotlight</span>
              <h3>Have We Photographed Your Celebration?</h3>
              <p>
                We love sharing client memories and customer photos! Send us your favorite captures or book your upcoming shoot to be featured on our wall of memories.
              </p>
            </div>
            <div className="cta-banner-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleNavClick('contact')}
              >
                <span>Share Story / Book Shoot</span> <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 6: About Us */}
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
                      <p>
                        <a href="tel:+919994499238" style={{ color: 'inherit', textDecoration: 'none' }}>+91 99944 99238</a>
                      </p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <div>
                      <strong>Email Inquiries</strong>
                      <p>
                        <a href="mailto:vashokphotos@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>vashokphotos@gmail.com</a>
                      </p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <div>
                      <strong>Studio Location</strong>
                      <p>Anbudan Photos Studio, Art District, Coimbatore & Chennai, Tamil Nadu</p>
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
                  <a
                    href="https://www.instagram.com/anbudan_photos?utm_source=qr&stkn=MXJ2Y21ib2F4NHEyeA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-pill instagram-pill"
                    title="Follow Anbudan Photos on Instagram"
                  >
                    📸 Instagram
                  </a>
                  <a
                    href="mailto:vashokphotos@gmail.com"
                    className="social-pill email-pill"
                    title="Email Anbudan Photos"
                  >
                    ✉️ vashokphotos@gmail.com
                  </a>
                  <a
                    href="https://wa.me/919994499238?text=Hello%20Anbudan%20Photos,%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-pill whatsapp-pill"
                    title="Chat on WhatsApp"
                  >
                    💬 WhatsApp (+91 99944 99238)
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-panel">
              {contactSubmitted ? (
                <div className="form-success-box" role="alert">
                  <div className="success-icon">✓</div>
                  <h3>Thank you for reaching out, {submittedInquiry?.name}!</h3>
                  <p>
                    Your booking inquiry for <strong>{submittedInquiry?.service}</strong> has been prepared and sent to WhatsApp.
                  </p>

                  <div className="success-action-buttons">
                    <a
                      href={submittedInquiry?.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-success-whatsapp"
                    >
                      💬 Open in WhatsApp (+91 99944 99238)
                    </a>
                    <a
                      href={submittedInquiry?.mailtoUrl}
                      className="btn-success-email"
                    >
                      ✉️ Send Email to vashokphotos@gmail.com
                    </a>
                  </div>

                  <button
                    type="button"
                    className="btn-send-another"
                    onClick={() => {
                      setContactSubmitted(false)
                      setSubmittedInquiry(null)
                      setContactData({
                        name: '',
                        phone: '',
                        email: '',
                        service: 'Weddings & Marriages',
                        eventDate: '',
                        message: '',
                      })
                    }}
                  >
                    ← Submit Another Inquiry
                  </button>
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
                        placeholder="e.g. Krish"
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
                        placeholder="krish@example.com"
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
              <li><a href="#csr" onClick={(e) => { e.preventDefault(); handleNavClick('csr') }}>CSR Projects</a></li>
              <li><a href="#customers" onClick={(e) => { e.preventDefault(); handleNavClick('customers') }}>Customer Stories</a></li>
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
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>CSR & Social Documentary</a></li>
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

      {/* Interactive Animated Photographer & Camera Corner Mascot */}
      <PhotographerWidget
        onBookClick={() => handleNavClick('contact')}
        onGalleryClick={() => handleNavClick('gallery')}
      />
    </div>
  )
}

export default App

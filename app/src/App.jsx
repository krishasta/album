import { useEffect, useState, useRef } from 'react'
import './App.css'
import CardAlbum from './components/cardalbum.jsx'
import MainAlbum from './components/mainalbum.jsx'
import PortfolioPage from './components/PortfolioPage.jsx'

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
    id: 'candid-photography',
    title: 'Candid Photography',
    category: 'Unscripted Moments',
    description: 'Authentic emotions, natural expressions, and beautifully unscripted moments.',
    icon: '📸',
  },
  {
    id: 'wedding-photography',
    title: 'Wedding Photography',
    category: 'Timeless Celebrations',
    description: 'Timeless imagery capturing the elegance, emotion, and grandeur of your wedding celebration.',
    icon: '💍',
  },
  {
    id: 'pre-wedding-photography',
    title: 'Pre-Wedding Photography',
    category: 'Couple Sessions',
    description: 'Romantic, artistic portraits created around your unique story and connection.',
    icon: '💐',
  },
  {
    id: 'post-wedding-photography',
    title: 'Post-Wedding Photography',
    category: 'Cinematic Storytelling',
    description: 'Elegant portraits and cinematic moments that continue your wedding story beyond the celebration.',
    icon: '✨',
  },
  {
    id: 'corporate-photography',
    title: 'Corporate Photography',
    category: 'Professional & Brand',
    description: 'Professional visual storytelling for corporate events, conferences, executives, and brand experiences.',
    icon: '🏢',
  },
  {
    id: 'maternity-photography',
    title: 'Maternity Photography',
    category: 'Motherhood & New Beginnings',
    description: 'Graceful and intimate portraits celebrating the beauty of motherhood and the beginning of a new journey.',
    icon: '🌸',
  },
  {
    id: 'birthday-photography',
    title: 'Birthday Photography',
    category: 'Joyful Milestones',
    description: 'Vibrant and heartfelt photographs preserving the joy, celebration, and unforgettable moments of every milestone.',
    icon: '🎂',
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
    name: 'Sri Gopal Naidu School',
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

function processDrivePayload(driveData) {
  if (!driveData || typeof driveData !== 'object') return null
  if (driveData.error) {
    console.warn('Google Apps Script returned an error:', driveData.error)
    return null
  }

  let portfolio = []
  if (driveData.portfolio && Array.isArray(driveData.portfolio)) {
    portfolio = driveData.portfolio
  }

  let heroPhotos = []
  if (driveData.heroPhotos && Array.isArray(driveData.heroPhotos)) {
    heroPhotos = driveData.heroPhotos
      .map((p) => {
        if (!p) return null
        if (typeof p === 'string') return p
        if (p.id) return `https://lh3.googleusercontent.com/d/${p.id}=w1600`
        return p.url || ''
      })
      .filter(Boolean)
  }

  const rawList = Array.isArray(driveData)
    ? driveData
    : driveData.albums || driveData.data || driveData

  let albums = []
  if (Array.isArray(rawList)) {
    albums = rawList.map((item, index) => {
      const rawPhotos = item.photos || (Array.isArray(item) ? item : [])
      const photoItems = (rawPhotos || [])
        .map((photo) => {
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
        })
        .filter((p) => p && p.url)

      const folderName = item.name || item.folderName || item.title || item.albumName || `Album ${index + 1}`
      return {
        name: folderName,
        title: folderName,
        style: (index % 10) + 1,
        photos: photoItems,
        cover: photoItems[0]?.url || item.cover || '',
      }
    })
  } else {
    const keys = Object.keys(rawList).filter((k) => k !== 'error' && k !== 'status' && k !== 'heroPhotos' && k !== 'portfolio')
    if (keys.length > 0) {
      albums = keys.map((folderKey, index) => {
        const rawValue = rawList[folderKey]
        const isObj = rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
        const rawPhotos = isObj ? rawValue.photos || [] : Array.isArray(rawValue) ? rawValue : []
        const rawFolderName =
          isObj && (rawValue.name || rawValue.folderName || rawValue.title || rawValue.albumName)
            ? rawValue.name || rawValue.folderName || rawValue.title || rawValue.albumName
            : folderKey

        const photoItems = (rawPhotos || [])
          .map((photo) => {
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
          })
          .filter((p) => p && p.url)

        return {
          name: rawFolderName,
          title: rawFolderName,
          style: (index % 10) + 1,
          photos: photoItems,
          cover: photoItems[0]?.url || (isObj ? rawValue.cover : '') || '',
        }
      })
    }
  }

  return {
    albums: albums.length > 0 ? albums : null,
    portfolio,
    heroPhotos,
  }
}

function getInitialDriveData() {
  if (typeof window !== 'undefined') {
    try {
      const cached = window.localStorage.getItem(driveCacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        return processDrivePayload(parsed)
      }
    } catch {}
  }
  return null
}

function App() {
  const [initialCached] = useState(() => getInitialDriveData())
  const [currentView, setCurrentView] = useState(() =>
    typeof window !== 'undefined' && window.location.hash === '#portfolio' ? 'portfolio' : 'home'
  )
  const [albums, setAlbums] = useState(() => initialCached?.albums || initialAlbums)
  const [drivePortfolio, setDrivePortfolio] = useState(() => initialCached?.portfolio || [])
  const [heroPhotos, setHeroPhotos] = useState(() => initialCached?.heroPhotos || [])
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [driveStatus, setDriveStatus] = useState(() => (initialCached?.albums ? 'connected' : 'loading'))
  const [menuOpen, setMenuOpen] = useState(false)
  const [customerFilter, setCustomerFilter] = useState('all')
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [isSendingInquiry, setIsSendingInquiry] = useState(false)
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Candid Photography',
    eventDate: '',
    message: '',
  })

  const closeAlbum = () => setActiveAlbum(null)

  // Listen to browser hash changes for seamless back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#portfolio') {
        setCurrentView('portfolio')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentView('home')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadAlbums = async () => {
      try {
        const driveAlbums = await loadDriveAlbums()
        if (cancelled) return

        if (driveAlbums && typeof driveAlbums === 'object' && !driveAlbums.error) {
          const processed = processDrivePayload(driveAlbums)
          if (processed && processed.albums && processed.albums.length > 0) {
            setAlbums(processed.albums)
            if (processed.portfolio && processed.portfolio.length > 0) {
              setDrivePortfolio(processed.portfolio)
            }
            if (processed.heroPhotos && processed.heroPhotos.length > 0) {
              setHeroPhotos(processed.heroPhotos)
            }
            setDriveStatus('connected')
            window.localStorage.setItem(driveCacheKey, JSON.stringify(driveAlbums))
            return
          }
        }
        setDriveStatus((prev) => (prev !== 'connected' ? 'fallback' : prev))
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

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSendingInquiry(true)

    const inquiryPayload = { ...contactData }

    // 1. Format professional WhatsApp message
    const waText = `📸 *NEW BOOKING INQUIRY - ANBUDAN PHOTOS*\n\n` +
      `👤 *Client Name:* ${inquiryPayload.name}\n` +
      `📞 *Phone / WhatsApp:* ${inquiryPayload.phone}\n` +
      `✉️ *Email:* ${inquiryPayload.email}\n` +
      `🏷️ *Service Requested:* ${inquiryPayload.service}\n` +
      `📅 *Event Date:* ${inquiryPayload.eventDate || 'Tentative / To be discussed'}\n` +
      `📝 *Event Details / Notes:* ${inquiryPayload.message || 'No additional notes provided'}\n\n` +
      `_Sent via Anbudan Photos website inquiry form_`

    const whatsappUrl = `https://wa.me/919994499238?text=${encodeURIComponent(waText)}`

    // 2. Format mailto fallback for direct email composition
    const mailSubject = `[New Inquiry] ${inquiryPayload.name} - ${inquiryPayload.service}`
    const mailBody = `Hello Anbudan Photos Studio,\n\nI would like to inquire about booking photography/videography services.\n\n` +
      `Full Name: ${inquiryPayload.name}\n` +
      `Phone Number: ${inquiryPayload.phone}\n` +
      `Email Address: ${inquiryPayload.email}\n` +
      `Event / Service Type: ${inquiryPayload.service}\n` +
      `Event Date: ${inquiryPayload.eventDate || 'To be decided'}\n\n` +
      `Message & Requirements:\n${inquiryPayload.message || 'None'}\n\n` +
      `Best regards,\n${inquiryPayload.name}`

    const mailtoUrl = `mailto:vashokphotos@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

    // 3. Immediately launch WhatsApp
    try {
      const waTab = window.open(whatsappUrl, '_blank')
      if (!waTab || waTab.closed || typeof waTab.closed === 'undefined') {
        window.location.assign(whatsappUrl)
      }
    } catch (_) {
      try {
        window.location.href = whatsappUrl
      } catch (__) { }
    }

    // 4. Send background POST to Google Apps Script webhook to deliver actual email to vashokphotos@gmail.com
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'inquiry',
            ...inquiryPayload,
            recipient: 'vashokphotos@gmail.com',
            submittedAt: new Date().toISOString(),
          }),
        })
      } catch (postErr) {
        console.warn('Apps Script email dispatch:', postErr)
      }
    }

    // Save submission snapshot for UI
    setSubmittedInquiry({
      ...inquiryPayload,
      whatsappUrl,
      mailtoUrl,
    })
    setContactSubmitted(true)
    setIsSendingInquiry(false)
  }

  const navigateToView = (view, targetSectionId = null) => {
    setMenuOpen(false)
    if (view === 'portfolio') {
      setCurrentView('portfolio')
      window.location.hash = '#portfolio'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setCurrentView('home')
      if (window.location.hash === '#portfolio') {
        window.location.hash = targetSectionId ? `#${targetSectionId}` : '#home'
      }
      if (targetSectionId) {
        setTimeout(() => {
          const element = document.getElementById(targetSectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 80)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleNavClick = (sectionId) => {
    setMenuOpen(false)
    if (currentView !== 'home') {
      navigateToView('home', sectionId)
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const selectServiceForInquiry = (serviceTitle) => {
    setContactData((prev) => ({ ...prev, service: serviceTitle }))
    if (currentView !== 'home') {
      navigateToView('home', 'contact')
      return
    }
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
          <a
            href="#home"
            className="nav-brand"
            onClick={(e) => {
              e.preventDefault()
              navigateToView('home', 'home')
            }}
          >
            <div className="brand-mark">
              <img src="/01 org.png" alt="Anbudan Photos logo" />
            </div>
            <div className="nav-brand-text">
              <span className="brand-title">Anbudan Photos</span>
              <span className="brand-tag">Photography & Films</span>
            </div>
          </a>

          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('portfolio')
              }}
              className={currentView === 'portfolio' ? 'active-nav-link' : ''}
            >
              Portfolio
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('home', 'gallery')
              }}
            >
              Gallery
            </a>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('home', 'home')
              }}
            >
              About
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('home', 'services')
              }}
            >
              Services
            </a>
            {/* <a href="#csr" onClick={(e) => { e.preventDefault(); navigateToView('home', 'csr') }}>CSR Impact</a> */}
            <a
              href="#customers"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('home', 'customers')
              }}
            >
              Customers
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('home', 'about')
              }}
            >
              Why Us
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                navigateToView('home', 'contact')
              }}
            >
              Contact
            </a>
            <button
              className="nav-cta-btn"
              type="button"
              onClick={() => navigateToView('home', 'contact')}
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

      {currentView === 'portfolio' ? (
        <PortfolioPage
          drivePortfolio={drivePortfolio}
          driveAlbums={albums}
          isLoading={driveStatus === 'loading'}
          onNavigateHome={() => navigateToView('home', 'home')}
          onBookClick={() => navigateToView('home', 'contact')}
          onOpenAlbum={setActiveAlbum}
        />
      ) : (
        <>
          {/* Pure Photo Showcase Carousel (Edge-to-Edge & 100% Uncropped) */}
          {heroGallery.length > 0 && (
            <section
              className="top-carousel-section"
              aria-label="Featured Photography Reel"
            >
              <div className="top-carousel-wrapper">
                <div className="top-carousel-track">
                  {heroGallery.map((imgUrl, idx) => (
                    <div
                      key={imgUrl + idx}
                      className={`top-carousel-slide ${idx === heroPhotoIndex ? 'is-active' : ''}`}
                    >
                      <div
                        className="top-carousel-slide-bg"
                        style={{ backgroundImage: `url(${imgUrl})` }}
                        aria-hidden="true"
                      />
                      <img
                        src={imgUrl}
                        alt={`Anbudan Photos showcase ${idx + 1}`}
                        className="top-carousel-img"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>

                {/* Discrete Bottom Slide Dots */}
                {heroGallery.length > 1 && (
                  <div className="top-carousel-dots-bar">
                    <div className="top-carousel-dots">
                      {heroGallery.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`top-dot ${idx === heroPhotoIndex ? 'is-active' : ''}`}
                          onClick={() => setHeroPhotoIndex(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtle Navigation Chevrons */}
                {heroGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="top-carousel-arrow prev"
                      onClick={() => setHeroPhotoIndex((prev) => (prev - 1 + heroGallery.length) % heroGallery.length)}
                      aria-label="Previous Slide"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="top-carousel-arrow next"
                      onClick={() => setHeroPhotoIndex((prev) => (prev + 1) % heroGallery.length)}
                      aria-label="Next Slide"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </section>
          )}

          <main className="app-shell">
            {/* Background Ambient Light Orbs */}
            <div className="ambient-glow glow-1" aria-hidden="true"></div>
            <div className="ambient-glow glow-2" aria-hidden="true"></div>
            <div className="ambient-glow glow-3" aria-hidden="true"></div>

            {/* Section 1: Gallery (Client Gallery Archive & Live Drive Viewer) */}
            <section id="gallery" className="section-block gallery-section">
              <div className="section-header">
                <div className="gallery-header-meta">
                  <div>
                    {/* <p className="section-kicker">Client Gallery Archive</p> */}
                    <h2 className="section-title">Moments, Beautifully Preserved.</h2>
                  </div>
                </div>
                <p className="section-subtitle">
                  Explore our curated collection of photographs and visual stories.
                  Each gallery is an invitation to relive the emotions, details, and unforgettable moments that made the occasion truly special.
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

              <div className="gallery-grid-container" aria-label="Photo albums">
                <div className="gallery-album-grid">
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

            {/* Section 2: Home / Hero Studio Overview */}
            <section id="home" className="hero-section">
              <div className="hero-layout-grid">
                {/* Left Column: Hero Text & Storytelling */}
                <div className="hero-content">
                  <div className="hero-eyebrow-wrapper">
                    <span className="eyebrow hero-eyebrow">
                      <span className="pulse-dot"></span> ANBUDAN PHOTOS • WEDDING PHOTOGRAPHY & FILMS
                    </span>
                  </div>
                  <h1 className="hero-title">
                    Your Love Story, <span className="text-gradient">Beautifully Preserved.</span>
                  </h1>
                  <div className="hero-desc-wrapper" style={{ maxWidth: '820px', margin: '0 auto 34px', textAlign: 'center' }}>
                    <p className="hero-desc-lead" style={{ margin: '0 0 12px', fontSize: 'clamp(17px, 1.8vw, 20px)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5 }}>
                      Welcome to Anbudan Photos—where extraordinary celebrations become timeless visual stories.
                    </p>
                    <p className="hero-desc" style={{ margin: '0 0 12px' }}>
                      We believe your wedding is more than a day. It is a collection of emotions, traditions, laughter, tears, and unforgettable moments shared with the people who matter most.
                    </p>
                    <p className="hero-desc" style={{ margin: '0 0 16px' }}>
                      Through our lens, we preserve these moments with elegance, artistry, and authenticity, creating photographs and films that allow you to relive your celebration for generations to come.
                    </p>
                    <p className="hero-tagline-motto" style={{ margin: '0', font: '600 14px var(--mono)', color: 'var(--accent-red)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Your moments. Your emotions. Your story.
                    </p>
                  </div>
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
              </div>

              {/* Photography Studio Gear & Artistry Strip */}
              <div className="photo-gear-marquee-strip" aria-label="Studio Gear and Capabilities">
                <div className="gear-item">
                  <span className="gear-icon">📷</span>
                  <div className="gear-text">
                    <strong>Full-Frame Cinema</strong>
                    {/* <span>Sony FX3 & Alpha Series</span> */}
                  </div>
                </div>
                <div className="gear-divider"></div>
                <div className="gear-item">
                  <span className="gear-icon">🔭</span>
                  <div className="gear-text">
                    <strong>Prime G-Master Lenses</strong>
                    {/* <span>f/1.2 & f/1.4 Portrait Optics</span> */}
                  </div>
                </div>
                <div className="gear-divider"></div>
                <div className="gear-item">
                  <span className="gear-icon">🚁</span>
                  <div className="gear-text">
                    <strong>Cinematic Aerials</strong>
                    {/* <span>4K HDR Drone Perspectives</span> */}
                  </div>
                </div>
                <div className="gear-divider"></div>
                <div className="gear-item">
                  <span className="gear-icon">💡</span>
                  <div className="gear-text">
                    <strong>Master Studio Strobes</strong>
                    {/* <span>High-Speed Sync Lighting</span> */}
                  </div>
                </div>
                <div className="gear-divider"></div>
                <div className="gear-item">
                  <span className="gear-icon">📖</span>
                  <div className="gear-text">
                    <strong>Handcrafted Albums</strong>
                    {/* <span>Fine-Art Archival Prints</span> */}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Services */}
            <section id="services" className="section-block services-section">
              <div className="section-header">
                <p className="section-kicker">What We Do</p>
                <h2 className="section-title">Bespoke Photography & Cinematic Videography</h2>
                <p className="section-subtitle">
                  Every celebration has its own story, character, and emotion. We create bespoke photography and cinematic films tailored to each occasion — from intimate family moments and elegant weddings to grand celebrations, spiritual events, and corporate experiences.
                </p>
                <p className="section-subtitle" style={{ marginTop: '12px' }}>
                  With refined visual artistry, professional-grade camera technology, cinematic lighting, and an uncompromising eye for detail, we transform fleeting moments into timeless visual legacies.
                </p>
                <p className="section-tagline-highlight" style={{ marginTop: '16px', font: '600 13.5px var(--mono)', color: 'var(--accent-red)', letterSpacing: '0.04em' }}>
                  Thoughtfully Captured. Beautifully Crafted. Timelessly Preserved.
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
                      {/* {svc.features.map((feat, idx) => (
                    <span className="service-feature-tag" key={idx}>
                      <span className="check-dot">✓</span> {feat}
                    </span>
                  ))} */}
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

            {/* Section 4: CSR Impact & Social Initiatives */}
            {/* <section id="csr" className="section-block csr-section">
          <div className="section-header">
            <p className="section-kicker">Social Impact & Field Storytelling</p>
            <h2 className="section-title">CSR & Community Documentary Projects</h2>
            <p className="section-subtitle">
              We partner with corporate foundations, NGOs, and community trust programs to document real transformation —
              from remote tribal settlements and urban eco-parks to child development centers.
            </p>
          </div>

          <div className="csr-grid">
            {csrProjectsData.map((project) => {
              // Dynamically find live matching album from Google Drive
              const matchedAlbum = albums.find((a) => {
                const name = (a.name || a.title || '').toLowerCase()
                if (project.id === 'gethaikadu-tribal' && name.includes('gethaikadu')) return true
                if (project.id === 'semmozhi-poonga' && name.includes('semmozhi')) return true
                if (project.id === 'anganwadi-model' && name.includes('anganwadi')) return true
                return false
              })

              const displayImage = matchedAlbum?.cover || 
                (matchedAlbum?.photos && matchedAlbum.photos[0] ? 
                  (typeof matchedAlbum.photos[0] === 'string' ? matchedAlbum.photos[0] : matchedAlbum.photos[0].url) 
                  : '') || project.image

              return (
                <div 
                  className="csr-card" 
                  key={project.id}
                >
                  <div className="csr-card-glow" aria-hidden="true"></div>
                  <div className="csr-image-wrap">
                    <img
                      src={displayImage}
                      alt={project.title}
                      className="csr-card-img"
                      loading="lazy"
                      referrerPolicy="no-referrer"
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
              )
            })}
          </div>
        </section> */}

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
                  <p className="section-kicker">ANBUDAN PHOTOS</p>
                  <h2 className="section-title">Capturing Life. Preserving Love.</h2>
                  <p className="about-lead">
                    Where every photograph is captured with Anbudan — with love, warmth, and genuine emotion.
                  </p>
                  <p className="about-body">
                    From sacred weddings and grand celebrations to cherished family milestones, birthdays, maternity journeys, and corporate occasions, Anbudan Photos transforms meaningful moments into timeless visual memories.
                  </p>
                  <p className="about-body" style={{ marginTop: '12px' }}>
                    With an uncompromising eye for detail, emotion, and elegance, we preserve the moments that matter most — beautifully captured today, treasured for generations.
                  </p>
                  <p className="about-motto" style={{ marginTop: '18px', font: '600 13.5px var(--mono)', color: 'var(--accent-red)', letterSpacing: '0.04em' }}>
                    With Love • With Emotion • With an Eye for Elegance
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
                          <strong>Office Location</strong>
                          <p>Anbudan Photos,  Coimbatore , Tamil Nadu</p>
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
                      <h3>Booking Inquiry Sent Automatically!</h3>
                      <p>
                        Thank you, <strong>{submittedInquiry?.name}</strong>! Your inquiry for <strong>{submittedInquiry?.service}</strong> has been automatically emailed to <strong>vashokphotos@gmail.com</strong> and dispatched to studio WhatsApp (<strong>+91 99944 99238</strong>).
                      </p>

                      <div className="success-action-buttons">
                        <a
                          href={submittedInquiry?.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-success-whatsapp"
                        >
                          💬 Re-open WhatsApp Chat
                        </a>
                        <a
                          href={submittedInquiry?.mailtoUrl}
                          className="btn-success-email"
                        >
                          ✉️ Email Copy: vashokphotos@gmail.com
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
                            service: 'Candid Photography',
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
                            placeholder="e.g. Anbudan"
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
                            placeholder="anbudan@example.com"
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

                      <button
                        type="submit"
                        className="btn-primary submit-btn"
                        disabled={isSendingInquiry}
                      >
                        {isSendingInquiry ? 'Sending Inquiry... ⏳' : 'Send Booking Inquiry →'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </main>
        </>
      )}

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
              Capturing Life. Preserving Love. Where every photograph is captured with Anbudan — with love, warmth, and genuine emotion.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateToView('home', 'home') }}>Home</a></li>
              <li><a href="#portfolio" onClick={(e) => { e.preventDefault(); navigateToView('portfolio') }}>Portfolio</a></li>
              <li><a href="#gallery" onClick={(e) => { e.preventDefault(); navigateToView('home', 'gallery') }}>Client Gallery</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); navigateToView('home', 'services') }}>Services</a></li>
              <li><a href="#customers" onClick={(e) => { e.preventDefault(); navigateToView('home', 'customers') }}>Customer Stories</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateToView('home', 'about') }}>About Studio</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateToView('home', 'contact') }}>Contact & Bookings</a></li>
            </ul>
          </div>

          <div className="footer-services-col">
            <h4>Featured Services</h4>
            <ul>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Candid Photography</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Wedding Photography</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Pre & Post-Wedding</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Corporate Photography</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services') }}>Maternity & Birthday</a></li>
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

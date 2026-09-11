import { useEffect, useState, useRef } from 'react'

function MainAlbum({ album, onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(null) // null when in grid, number when lightbox open
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [columnsCount, setColumnsCount] = useState(3) // 3 or 4 columns on desktop
  const galleryRef = useRef(null)

  const photos = album.photos || []
  const totalPhotos = photos.length
  const albumTitle = album.name || album.title || 'Client Gallery'
  const coverImage = album.cover || (photos[0] ? (typeof photos[0] === 'string' ? photos[0] : photos[0].url) : '')

  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Lightbox Navigation
  const showNext = () => {
    if (lightboxIndex === null || totalPhotos === 0) return
    setLightboxIndex((prev) => (prev + 1) % totalPhotos)
  }

  const showPrevious = () => {
    if (lightboxIndex === null || totalPhotos === 0) return
    setLightboxIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos)
  }

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setIsSlideshow(false)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    setIsSlideshow(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          closeLightbox()
        } else {
          onClose()
        }
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') showNext()
        if (e.key === 'ArrowLeft') showPrevious()
        if (e.key === ' ') {
          e.preventDefault()
          setIsSlideshow((prev) => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, totalPhotos, onClose])

  // Autoplay Slideshow
  useEffect(() => {
    if (!isSlideshow || lightboxIndex === null || totalPhotos <= 1) return

    const interval = setInterval(() => {
      setLightboxIndex((prev) => (prev + 1) % totalPhotos)
    }, 3500)

    return () => clearInterval(interval)
  }, [isSlideshow, lightboxIndex, totalPhotos])

  // Lock body scroll when album view is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const currentPhoto = lightboxIndex !== null && photos[lightboxIndex]
  const currentPhotoUrl = currentPhoto ? (typeof currentPhoto === 'string' ? currentPhoto : currentPhoto.url) : ''

  return (
    <div className="pixieset-album-page" role="dialog" aria-modal="true" aria-label={albumTitle}>
      {/* 1. HERO COVER HEADER */}
      <header className="pixieset-hero" style={{ backgroundImage: coverImage ? `url("${coverImage}")` : 'none' }}>
        <div className="pixieset-hero-overlay"></div>
        
        {/* Top Floating Action Bar */}
        <div className="pixieset-topbar">
          <button className="pixieset-back-btn" onClick={onClose} type="button" aria-label="Back to all collections">
            <span>←</span> Back to Collections
          </button>
          <div className="pixieset-brand">
            <span className="pixieset-brand-title">ANBUDAN PHOTOS</span>
          </div>
          <button className="pixieset-close-btn" onClick={onClose} type="button" aria-label="Close album">
            <span>✕</span>
          </button>
        </div>

        {/* Hero Title & View Gallery CTA */}
        <div className="pixieset-hero-center">
          <p className="pixieset-hero-eyebrow">ANBUDAN PHOTOS <span>•</span> CLIENT GALLERY</p>
          <h1 className="pixieset-hero-title">{albumTitle}</h1>
          <p className="pixieset-hero-meta">{totalPhotos} Photographs</p>
          <button className="pixieset-view-gallery-btn" onClick={scrollToGallery} type="button">
            View Gallery <span className="btn-arrow">↓</span>
          </button>
        </div>

        <div className="pixieset-hero-scroll-indicator" onClick={scrollToGallery} role="button" tabIndex={0}>
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-chevron"></div>
        </div>
      </header>

      {/* 2. STICKY SUB-BAR */}
      <nav className="pixieset-subnav" ref={galleryRef}>
        <div className="pixieset-subnav-container">
          <div className="pixieset-subnav-left">
            <button className="pixieset-subnav-back" onClick={onClose} type="button">
              <span>←</span> All Albums
            </button>
            <div className="pixieset-subnav-divider"></div>
            <h2 className="pixieset-subnav-title">{albumTitle}</h2>
          </div>

          <div className="pixieset-subnav-right">
            <span className="pixieset-photo-count-pill">{totalPhotos} Photos</span>
            
            {totalPhotos > 0 && (
              <button 
                className="pixieset-action-pill"
                type="button" 
                onClick={() => {
                  setLightboxIndex(0)
                  setIsSlideshow(true)
                }}
              >
                <span>▶</span> Slideshow
              </button>
            )}

            <div className="pixieset-column-toggles">
              <button 
                type="button" 
                className={`col-toggle-btn ${columnsCount === 3 ? 'active' : ''}`}
                onClick={() => setColumnsCount(3)}
                title="3 Columns"
              >
                |||
              </button>
              <button 
                type="button" 
                className={`col-toggle-btn ${columnsCount === 4 ? 'active' : ''}`}
                onClick={() => setColumnsCount(4)}
                title="4 Columns"
              >
                ||||
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. MASONRY PHOTO GRID */}
      <main className="pixieset-gallery-container">
        {totalPhotos === 0 ? (
          <div className="pixieset-empty-state">
            <p>No photos available in this album yet.</p>
          </div>
        ) : (
          <div className={`pixieset-masonry-grid columns-${columnsCount}`}>
            {photos.map((photo, index) => {
              const photoUrl = typeof photo === 'string' ? photo : photo.url
              const photoThumb = (typeof photo === 'object' && photo.thumbnail) ? photo.thumbnail : photoUrl

              return (
                <div 
                  className="pixieset-grid-item" 
                  key={photoUrl || index}
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                  aria-label={`Open photo ${index + 1} of ${totalPhotos}`}
                >
                  <div className="pixieset-item-inner">
                    <img 
                      src={photoThumb} 
                      alt={`${albumTitle} photograph ${index + 1}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="pixieset-item-hover-overlay">
                      <span className="pixieset-expand-icon">⤢</span>
                      <span className="pixieset-photo-num">#{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="pixieset-footer">
        <div className="pixieset-footer-brand">
          <h3>ANBUDAN PHOTOS</h3>
          <p>Photography & Cinematography Studio • Coimbatore, Tamil Nadu</p>
        </div>
        <div className="pixieset-footer-actions">
          <button 
            type="button" 
            className="pixieset-back-top-btn" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top ↑
          </button>
          <button type="button" className="pixieset-close-footer-btn" onClick={onClose}>
            Back to All Albums <span>↗</span>
          </button>
        </div>
      </footer>

      {/* 5. FULLSCREEN LIGHTBOX / SLIDESHOW MODAL */}
      {lightboxIndex !== null && (
        <div className="pixieset-lightbox-overlay" onClick={closeLightbox} role="dialog" aria-modal="true">
          <div className="pixieset-lightbox-container" onClick={(e) => e.stopPropagation()}>
            {/* Top Lightbox Controls */}
            <div className="pixieset-lightbox-topbar">
              <button className="lightbox-back-btn" onClick={closeLightbox} type="button">
                <span>←</span> Back to Gallery
              </button>

              <div className="lightbox-center-meta">
                <span className="lightbox-album-name">{albumTitle}</span>
                <span className="lightbox-counter">{lightboxIndex + 1} / {totalPhotos}</span>
              </div>

              <div className="lightbox-top-actions">
                <button 
                  className={`lightbox-tool-btn ${isSlideshow ? 'active' : ''}`}
                  onClick={() => setIsSlideshow(!isSlideshow)} 
                  type="button"
                  title={isSlideshow ? 'Pause Slideshow' : 'Play Slideshow'}
                >
                  {isSlideshow ? '⏸ Pause' : '▶ Play'}
                </button>
                <button className="lightbox-close-icon-btn" onClick={closeLightbox} type="button" aria-label="Close Lightbox">
                  ✕
                </button>
              </div>
            </div>

            {/* Main Stage Image */}
            <div className="pixieset-lightbox-stage">
              <button className="lightbox-nav-arrow prev" onClick={showPrevious} type="button" aria-label="Previous photo">
                ‹
              </button>

              <div className="lightbox-image-wrapper">
                <img 
                  src={currentPhotoUrl} 
                  alt={`${albumTitle} photograph ${lightboxIndex + 1}`}
                  referrerPolicy="no-referrer"
                />
              </div>

              <button className="lightbox-nav-arrow next" onClick={showNext} type="button" aria-label="Next photo">
                ›
              </button>
            </div>

            {/* Bottom Filmstrip Thumbnails */}
            <div className="pixieset-lightbox-filmstrip">
              <div className="filmstrip-track">
                {photos.map((p, idx) => {
                  const pUrl = typeof p === 'string' ? p : p.url
                  return (
                    <button
                      key={idx}
                      className={`filmstrip-thumb ${idx === lightboxIndex ? 'is-active' : ''}`}
                      onClick={() => {
                        setLightboxIndex(idx)
                        setIsSlideshow(false)
                      }}
                      type="button"
                      aria-label={`Jump to photo ${idx + 1}`}
                    >
                      <img src={pUrl} alt="" referrerPolicy="no-referrer" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainAlbum

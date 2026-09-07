import { useEffect, useState } from 'react'

const photosPerAlbum = 10

function MainAlbum({ album, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const showNext = () => setActivePhoto((photo) => (photo + 1) % photosPerAlbum)
  const showPrevious = () => setActivePhoto((photo) => (photo - 1 + photosPerAlbum) % photosPerAlbum)
  const getSlideOffset = (index) => {
    let offset = index - activePhoto
    if (offset > photosPerAlbum / 2) offset -= photosPerAlbum
    if (offset < -photosPerAlbum / 2) offset += photosPerAlbum
    return offset
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowLeft') showPrevious()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (isPaused) return undefined

    const timer = window.setInterval(() => {
      setActivePhoto((photo) => (photo + 1) % photosPerAlbum)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const currentPhoto = album.photos[activePhoto]
  const currentPhotoName = typeof currentPhoto === 'object' ? currentPhoto?.name : ''

  return (
    <div className="viewer-backdrop" role="dialog" aria-modal="true" aria-label={`${album.name} photo viewer`} onClick={onClose}>
      <div className={`viewer album-style-${album.style}`} onClick={(event) => event.stopPropagation()}>
        <div className="viewer-topbar">
          <div className="viewer-title-box">
            <p className="eyebrow">{album.name} <span>•</span> Photo {activePhoto + 1} of {album.photos?.length || photosPerAlbum}</p>
            <h2 className="viewer-photo-title">{currentPhotoName || `Photograph ${String(activePhoto + 1).padStart(2, '0')}`}</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close album">Close <span aria-hidden="true">×</span></button>
        </div>
        <div className="carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="carousel-stage">
            {album.photos.map((photo, index) => {
              const offset = getSlideOffset(index)
              if (Math.abs(offset) > 2) return null
              const photoUrl = typeof photo === 'string' ? photo : photo?.url
              const photoName = typeof photo === 'object' ? photo?.name : ''

              return (
                <button
                  className={`carousel-slide slide-${offset}`}
                  type="button"
                  key={(photoUrl || index) + index}
                  onClick={() => setActivePhoto(index)}
                  aria-label={`View photograph ${index + 1}${photoName ? `: ${photoName}` : ''}`}
                >
                  <img
                    src={photoUrl}
                    alt={photoName || `${album.name}, photograph ${index + 1}`}
                    referrerPolicy="no-referrer"
                  />
                  {photoName && (
                    <div className="slide-name-overlay">
                      <span>{photoName}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <button className="carousel-button previous" type="button" onClick={showPrevious} aria-label="Previous photograph">←</button>
          <button className="carousel-button next" type="button" onClick={showNext} aria-label="Next photograph">→</button>
        </div>
        <div className="viewer-controls">
          <span>{String(activePhoto + 1).padStart(2, '0')} <i>/</i> {String(album.photos?.length || photosPerAlbum).padStart(2, '0')}</span>
          <div className="progress-dots" aria-label={`Photograph ${activePhoto + 1} of ${album.photos?.length || photosPerAlbum}`}>
            {album.photos.map((_, index) => <button className={index === activePhoto ? 'is-active' : ''} type="button" key={index} onClick={() => setActivePhoto(index)} aria-label={`View photograph ${index + 1}`} />)}
          </div>
          <span className="hint">Use arrow keys to navigate</span>
        </div>
      </div>
    </div>
  )
}

export default MainAlbum

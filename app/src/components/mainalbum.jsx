import { useEffect, useState } from 'react'

function MainAlbum({ album, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const totalPhotos = album.photos && album.photos.length > 0 ? album.photos.length : 1

  const showNext = () => setActivePhoto((photo) => (photo + 1) % totalPhotos)
  const showPrevious = () => setActivePhoto((photo) => (photo - 1 + totalPhotos) % totalPhotos)

  const getSlideOffset = (index) => {
    let offset = index - activePhoto
    if (offset > totalPhotos / 2) offset -= totalPhotos
    if (offset < -totalPhotos / 2) offset += totalPhotos
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
  }, [onClose, totalPhotos])

  useEffect(() => {
    if (isPaused || totalPhotos <= 1) return undefined

    const timer = window.setInterval(() => {
      setActivePhoto((photo) => (photo + 1) % totalPhotos)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [isPaused, totalPhotos])

  // Exact Google Drive folder name
  const albumDisplayName = album.name || album.title || 'Album Gallery'

  return (
    <div className="viewer-backdrop" role="dialog" aria-modal="true" aria-label={`${albumDisplayName} photo viewer`} onClick={onClose}>
      <div className={`viewer album-style-${album.style || 1}`} onClick={(event) => event.stopPropagation()}>
        <div className="viewer-topbar">
          <div className="viewer-title-box">
            <p className="eyebrow">Client Album <span>•</span> Photo {activePhoto + 1} of {totalPhotos}</p>
            <h2 className="viewer-photo-title">{albumDisplayName}</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close album">Close <span aria-hidden="true">×</span></button>
        </div>
        <div className="carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="carousel-stage">
            {album.photos && album.photos.map((photo, index) => {
              const offset = getSlideOffset(index)
              if (Math.abs(offset) > 2) return null
              const photoUrl = typeof photo === 'string' ? photo : photo?.url

              return (
                <button
                  className={`carousel-slide slide-${offset}`}
                  type="button"
                  key={(photoUrl || index) + index}
                  onClick={() => setActivePhoto(index)}
                  aria-label={`View photograph ${index + 1} of ${totalPhotos}`}
                >
                  <img
                    src={photoUrl}
                    alt={`${albumDisplayName}, photo ${index + 1}`}
                    referrerPolicy="no-referrer"
                  />
                </button>
              )
            })}
          </div>
          {totalPhotos > 1 && (
            <>
              <button className="carousel-button previous" type="button" onClick={showPrevious} aria-label="Previous photograph">←</button>
              <button className="carousel-button next" type="button" onClick={showNext} aria-label="Next photograph">→</button>
            </>
          )}
        </div>
        <div className="viewer-controls">
          <span>{String(activePhoto + 1).padStart(2, '0')} <i>/</i> {String(totalPhotos).padStart(2, '0')}</span>
          <div className="progress-dots" aria-label={`Photograph ${activePhoto + 1} of ${totalPhotos}`}>
            {album.photos && album.photos.map((_, index) => (
              <button
                className={index === activePhoto ? 'is-active' : ''}
                type="button"
                key={index}
                onClick={() => setActivePhoto(index)}
                aria-label={`View photograph ${index + 1}`}
              />
            ))}
          </div>
          <span className="hint">Use arrow keys to navigate</span>
        </div>
      </div>
    </div>
  )
}

export default MainAlbum

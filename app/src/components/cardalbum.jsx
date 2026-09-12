function CardAlbum({ album, index, total = 10, onOpen, isLoading }) {
  const stepNumber = String(index + 1).padStart(2, '0')
  const albumName = album.name || album.title || `Album ${stepNumber}`
  const photoCount = album.photos?.length || 0

  return (
    <div
      className={`gallery-album-card ${isLoading ? 'is-loading' : ''}`}
      onClick={() => onOpen(album)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(album)
        }
      }}
      aria-label={`Open ${albumName} album with ${photoCount} photos`}
    >
      <div className="gallery-album-glow" aria-hidden="true"></div>

      <div className="gallery-album-media">
        {album.cover ? (
          <img
            src={album.cover}
            alt={`${albumName} cover`}
            className="gallery-album-img"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="gallery-album-placeholder">
            <span className="placeholder-text">{albumName}</span>
          </div>
        )}

        {/* Top Badge: Photo Count */}
        {/* <span className="gallery-album-badge">
          📸 {photoCount} Photos
        </span> */}

        {/* Hover Action Badge */}
        <div className="gallery-album-overlay">
          <span className="gallery-open-pill">
            Explore Album <span>↗</span>
          </span>
        </div>
      </div>

      <div className="gallery-album-body">
        <div className="gallery-album-meta-row">
          {/* <span className="gallery-step-badge">#{stepNumber}</span>
          <span className="gallery-curated-tag">Client Archive</span> */}
        </div>
        <h3 className="gallery-album-title" title={albumName}>{albumName}</h3>
        <div className="gallery-album-footer">
          <span className="gallery-album-action-link">
            View High-Res Photos →
          </span>
        </div>
      </div>
    </div>
  )
}

export default CardAlbum


function CardAlbum({ album, index, total = 10, onOpen, isLoading }) {
  const stepNumber = String(index + 1).padStart(2, '0')
  const stepTitle = album.title || album.name || `Album ${stepNumber}`

  return (
    <div 
      className={`curved-item-column col-${index + 1}`}
      style={{
        '--index': index,
        '--total': total
      }}
    >
      <div className="curved-card-perspective-box">
        <button 
          className={`curved-3d-card card-item-${index + 1} ${isLoading ? 'is-loading' : ''}`}
          type="button"
          onClick={() => onOpen(album)}
          aria-label={`Open ${album.name}`}
        >
          <div className="curved-card-media">
            {album.cover ? (
              <img 
                src={album.cover} 
                alt={`${album.name} cover`} 
                referrerPolicy="no-referrer"
                loading="eager"
              />
            ) : (
              <div className="curved-card-placeholder">
                <span className="placeholder-text">{album.name}</span>
              </div>
            )}
            <div className="curved-card-overlay">
              <span className="curved-open-badge">
                Open <span>↗</span>
              </span>
            </div>
          </div>
        </button>
      </div>

      <div className="curved-card-meta">
        <span className="curved-step-badge">#{stepNumber}</span>
        <strong className="curved-step-title">{stepTitle}</strong>
        <span className="curved-album-sub">{album.photos?.length ? `${album.photos.length} Photos` : album.name}</span>
      </div>
    </div>
  )
}

export default CardAlbum




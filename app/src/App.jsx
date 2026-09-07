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

function App() {
  const [albums, setAlbums] = useState(initialAlbums)
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [driveStatus, setDriveStatus] = useState('loading')

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
      return initialAlbums.map((album, index) => {
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
        if (!cancelled && driveStatus !== 'connected') {
          setDriveStatus('fallback')
        }
      }
    }

    loadAlbums()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand-mark">
          <img src="/logo.svg" alt="Anbudan Photos logo" />
        </div>
        <div>
          <p className="eyebrow">Client gallery</p>
          <h1>Anbudan Photos</h1>
        </div>
        <p className="album-count">
          {albumCount} albums <span>/</span> {albumCount * photosPerAlbum} photos
        </p>
      </header>

      {driveStatus === 'loading' && (
        <p className="drive-loading" role="status">
          Loading gallery photos<span>...</span>
        </p>
      )}
      {driveStatus === 'fallback' && (
        <p className="drive-notice">
          No Drive photos loaded. Check the Apps Script deployment and folder IDs.
        </p>
      )}

      <section className="intro">
        <p className="intro-kicker">A visual archive</p>
        <h2>Moments, carefully kept.</h2>
        <p>Select an album to explore its photographs.</p>
      </section>

      <section className="curved-gallery-section" aria-label="Photo albums">
        <div className="curved-album-track">
          {albums.map((album, index) => (
            <CardAlbum
              album={album}
              index={index}
              total={albums.length}
              onOpen={setActiveAlbum}
              isLoading={driveStatus === 'loading' && !album.cover}
              key={album.name}
            />
          ))}
        </div>
      </section>

      {activeAlbum && <MainAlbum album={activeAlbum} onClose={closeAlbum} />}
    </main>
  )
}

export default App

import { useState, useEffect } from 'react'
import './PortfolioPage.css'

const defaultPortfolioStories = [
  {
    id: 'sandeev-sujithra',
    name: 'Sandeev & Sujithra',
    title: 'Sandeev & Sujithra',
    category: 'Weddings',
    tag: 'Sacred Muhurtham & Reception',
    description: 'An elegant union filled with sacred rituals, vibrant joyous moments, and timeless couple portraiture.',
    cover: '',
    photos: [],
    folderLink: 'https://drive.google.com/drive/folders/1itWJmunwM-o949Ygd4r8h1JGYIW8tcIA',
  },
  {
    id: 'baby-shower-karunya-balaji',
    name: 'Baby Shower - Karunya & balaji',
    title: 'Baby Shower - Karunya & balaji',
    category: 'Maternity & Baby Shower',
    tag: 'Seemantham & Family Blessings',
    description: 'Celebrating the divine journey into parenthood with heartfelt traditions, warm smiles, and gentle maternity glow.',
    cover: '',
    photos: [],
    folderLink: 'https://drive.google.com/drive/folders/1itWJmunwM-o949Ygd4r8h1JGYIW8tcIA',
  },
  {
    id: '18th-birthday',
    name: '18th Birthday',
    title: '18th Birthday Milestone',
    category: 'Birthdays & Milestones',
    tag: 'Milestone Celebration',
    description: 'Lively, joyful celebration marked by vibrant family candids, laughter, and unforgettable milestone energy.',
    cover: '',
    photos: [],
    folderLink: 'https://drive.google.com/drive/folders/1itWJmunwM-o949Ygd4r8h1JGYIW8tcIA',
  },
  {
    id: 'manchester-suites',
    name: 'Manchester Suites Opening Ceremony',
    title: 'Manchester Suites Opening Ceremony',
    category: 'Corporate & Commercial',
    tag: 'Grand Commercial Inauguration',
    description: 'Executive coverage of the prestigious inauguration ceremony, distinguished guests, and architectural splendor.',
    cover: '',
    photos: [],
    folderLink: 'https://drive.google.com/drive/folders/1itWJmunwM-o949Ygd4r8h1JGYIW8tcIA',
  },
]

const categories = [
  { id: 'all', label: 'All Stories', icon: '🌟' },
  { id: 'Weddings', label: 'Weddings', icon: '💍' },
  { id: 'Maternity & Baby Shower', label: 'Maternity & Baby', icon: '👶' },
  { id: 'Birthdays & Milestones', label: 'Birthdays', icon: '🎂' },
  { id: 'Corporate & Commercial', label: 'Corporate & Events', icon: '🏢' },
]

function categorizeAlbum(name = '') {
  const lower = name.toLowerCase()
  if (/wedding|marriages|muhurtham|reception|sujithra|venkatesan|harshini|vigneswar|nicola/i.test(lower)) {
    return {
      category: 'Weddings',
      tag: 'Sacred Muhurtham & Celebration',
      description: 'An elegant union filled with sacred rituals, vibrant joyous moments, and timeless couple portraiture.',
    }
  }
  if (/baby|shower|maternity|seemantham|karunya|sriram|kavya|balaji/i.test(lower)) {
    return {
      category: 'Maternity & Baby Shower',
      tag: 'Seemantham & Family Blessings',
      description: 'Celebrating the divine journey into parenthood with heartfelt traditions, warm smiles, and gentle maternity glow.',
    }
  }
  if (/birthday|milestone|18th/i.test(lower)) {
    return {
      category: 'Birthdays & Milestones',
      tag: 'Milestone Celebration',
      description: 'Lively, joyful celebration marked by vibrant family candids, laughter, and unforgettable milestone energy.',
    }
  }
  if (/csr|anganwadi|semmozhi|gethaikadu|tribal/i.test(lower)) {
    return {
      category: 'Corporate & Commercial',
      tag: 'CSR & Community Impact',
      description: 'Dedicated field coverage capturing impactful community initiatives, sustainable welfare, and grassroots development.',
    }
  }
  if (/corporate|summit|founders|lrt|opening|ceremony|commercial|suites/i.test(lower)) {
    return {
      category: 'Corporate & Commercial',
      tag: 'Corporate Milestone & Event',
      description: 'Executive coverage of prestigious ceremonies, distinguished leadership, and institutional excellence.',
    }
  }
  return {
    category: 'Corporate & Commercial',
    tag: 'Celebration & Memories',
    description: 'Captured with genuine emotion and cinematic artistry by Anbudan Photos.',
  }
}

export default function PortfolioPage({
  drivePortfolio = [],
  driveAlbums = [],
  isLoading = false,
  onNavigateHome,
  onBookClick,
  onOpenAlbum,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeStory, setActiveStory] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Priority 1: If dedicated Portfolio folder stories exist (from Drive folder 1itWJmunwM-o949Ygd4r8h1JGYIW8tcIA), use them!
  let stories = []

  if (drivePortfolio && drivePortfolio.length > 0) {
    stories = drivePortfolio.map((dp, idx) => {
      const info = categorizeAlbum(dp.name || dp.title || '')
      return {
        id: dp.id || `portfolio-${idx}`,
        name: dp.name,
        title: dp.title || dp.name,
        category: dp.category || info.category,
        tag: dp.tag || info.tag,
        description: dp.description || info.description,
        cover: dp.cover || (dp.photos && dp.photos[0]?.url) || '',
        photos: dp.photos || [],
        photoCount: dp.photos ? dp.photos.length : 0,
        folderLink: dp.folderLink || 'https://drive.google.com/drive/folders/1itWJmunwM-o949Ygd4r8h1JGYIW8tcIA',
      }
    })
  } else {
    // Priority 2: Fallback to curated portfolio stories
    stories = defaultPortfolioStories.map((story) => {
      // Check if matching story came from Google Drive portfolio or albums
      const match = driveAlbums.find((a) =>
        a.name?.toLowerCase().includes('sujithra') && story.id === 'sandeev-sujithra' ||
        a.name?.toLowerCase().includes('karunya') && story.id === 'baby-shower-karunya-balaji' ||
        a.name?.toLowerCase().includes('birthday') && story.id === '18th-birthday' ||
        a.name?.toLowerCase().includes('suites') && story.id === 'manchester-suites'
      )

      if (match && match.photos && match.photos.length > 0) {
        return {
          ...story,
          cover: match.cover || match.photos[0]?.url || story.cover,
          photos: match.photos,
          photoCount: match.photos.length,
        }
      }

      return story
    })
  }

  const filteredStories = stories.filter((story) => {
    if (selectedCategory === 'all') return true
    return story.category?.toLowerCase() === selectedCategory.toLowerCase()
  })

  // Keyboard navigation for story lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeStory) return
      if (e.key === 'Escape') setActiveStory(null)
      if (e.key === 'ArrowRight' && activeStory.photos?.length > 0) {
        setLightboxIndex((prev) => (prev + 1) % activeStory.photos.length)
      }
      if (e.key === 'ArrowLeft' && activeStory.photos?.length > 0) {
        setLightboxIndex((prev) => (prev - 1 + activeStory.photos.length) % activeStory.photos.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStory])

  const openStory = (story) => {
    if (onOpenAlbum && story.photos && story.photos.length > 0) {
      onOpenAlbum(story)
    } else {
      setActiveStory(story)
      setLightboxIndex(0)
    }
  }

  return (
    <div className="portfolio-page">
      {/* Portfolio Header Bar / Navigation Breadcrumb */}
      <div className="portfolio-hero-header">
        <div className="portfolio-container">
          <div className="portfolio-breadcrumb">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={onNavigateHome}
            >
              ← Back to Main Page
            </button>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">Portfolio</span>
          </div>


          {/* Category Filter Bar */}
          <div className="portfolio-filter-bar">
            {categories.map((cat) => {
              const count = cat.id === 'all'
                ? stories.length
                : stories.filter((s) => s.category?.toLowerCase() === cat.id.toLowerCase()).length

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`portfolio-filter-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                  <span className="cat-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Portfolio Grid */}
      <main className="portfolio-container portfolio-main">
        {isLoading && (
          <div className="portfolio-sync-banner">
            <span className="spinner-icon">🔄</span>
            <span>Synchronizing live photographs from Google Drive cloud storage...</span>
          </div>
        )}

        <div className="portfolio-stories-grid">
          {filteredStories.map((story, idx) => {
            const hasPhotos = story.photos && story.photos.length > 0
            const photoCount = hasPhotos ? story.photos.length : 0

            return (
              <article
                className="portfolio-story-card"
                key={story.id || idx}
                onClick={() => openStory(story)}
              >
                <div className="story-card-media">
                  {story.cover ? (
                    <img
                      src={story.cover}
                      alt={story.title}
                      className="story-cover-img"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="story-cover-placeholder">
                      <span className="placeholder-icon">📸</span>
                      <strong>{story.title}</strong>
                      <span>Cloud Showcase Album</span>
                    </div>
                  )}

                  {/* Top Badge: Category */}
                  <div className="story-badges-top">
                    <span className="story-cat-badge">{story.category}</span>
                    {/* {photoCount > 0 && (
                      <span className="story-count-badge">
                        📸 {photoCount} Photos
                      </span>
                    )} */}
                  </div>

                  {/* Hover Overlay */}
                  <div className="story-card-overlay">
                    <span className="story-open-action">
                      View Story Gallery <span>↗</span>
                    </span>
                  </div>
                </div>

                <div className="story-card-body">
                  <span className="story-tag-pill">{story.tag}</span>
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-desc">{story.description}</p>
                  <div className="story-footer">
                    <span className="story-view-link">
                      Explore Story Photographs →
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

      </main>

      {/* Internal Story Modal Fallback if not using global viewer */}
      {activeStory && (
        <div className="portfolio-lightbox-overlay" onClick={() => setActiveStory(null)}>
          <div className="portfolio-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div>
                <span className="lightbox-cat">{activeStory.category}</span>
                <h3>{activeStory.title}</h3>
              </div>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setActiveStory(null)}
                aria-label="Close viewer"
              >
                ✕
              </button>
            </div>

            <div className="lightbox-main-view">
              {activeStory.photos && activeStory.photos.length > 0 ? (
                <img
                  src={activeStory.photos[lightboxIndex]?.url || activeStory.cover}
                  alt={`${activeStory.title} photo ${lightboxIndex + 1}`}
                  className="lightbox-img"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="lightbox-empty">
                  <p>Drive album is syncing photos. Please check back shortly or open in Google Drive.</p>
                  <a
                    href={activeStory.folderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Open Folder in Google Drive ↗
                  </a>
                </div>
              )}
            </div>

            {activeStory.photos && activeStory.photos.length > 1 && (
              <div className="lightbox-footer-controls">
                <button
                  type="button"
                  className="lightbox-nav-btn"
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + activeStory.photos.length) % activeStory.photos.length)}
                >
                  ‹ Prev
                </button>
                <span className="lightbox-counter">
                  {lightboxIndex + 1} / {activeStory.photos.length}
                </span>
                <button
                  type="button"
                  className="lightbox-nav-btn"
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % activeStory.photos.length)}
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

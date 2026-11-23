import { useState, useEffect } from 'react'
import './App.css'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import BookCreate from './components/BookCreate'
import BookEdit from './components/BookEdit'

function App() {
  const API_URL = 'http://localhost:3000/books'

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('전체')
  const [selectedId, setSelectedId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editBook, setEditBook] = useState(null)
  const [theme, setTheme] = useState('sage')

  // 도서 목록 조회
  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.log('도서 조회 오류:', error)
      alert('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // 도서 등록
  const handleCreate = async (newBook) => {
    const now = new Date().toISOString()

    const bookData = {
      ...newBook,
      likes: 0,
      liked: false,
      createdAt: now,
      updatedAt: now
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })

      const data = await response.json()
      setBooks([...books, data])
      setShowCreate(false)

      alert('도서가 등록되었습니다.')
    } catch (error) {
      console.log('도서 등록 오류:', error)
    }
  }

  // 도서 수정
  const handleUpdate = async (id, updateBook) => {
    const now = new Date().toISOString()

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updateBook,
          updatedAt: now
        })
      })

      if (!response.ok) {
        throw new Error('도서 수정 요청 실패')
      }

      const data = await response.json()

      setBooks((prevBooks) => prevBooks.map((book) =>
        book.id === id ? data : book
      ))
      setEditBook(null)

      alert('도서 정보가 수정되었습니다.')
    } catch (error) {
      console.log('도서 수정 오류:', error)
      alert('도서 수정에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  // 도서 삭제
  const handleDelete = async (id) => {
    const result = window.confirm('정말 삭제하시겠습니까?')

    if (!result) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('도서 삭제 요청 실패')
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
      setSelectedId(null)

      alert('도서가 삭제되었습니다.')
    } catch (error) {
      console.log('도서 삭제 오류:', error)
      alert('도서 삭제에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  // 좋아요 변경
  const handleLike = async (book) => {
    let newLikes = book.likes
    let newLiked = book.liked

    if (book.liked) {
      newLikes = book.likes - 1
      newLiked = false
    } else {
      newLikes = book.likes + 1
      newLiked = true
    }

    try {
      const response = await fetch(`${API_URL}/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: newLikes,
          liked: newLiked
        })
      })

      const data = await response.json()

      const newBooks = books.map((item) => {
        if (item.id === book.id) {
          return data
        }

        return item
      })

      setBooks(newBooks)
    } catch (error) {
      console.log('좋아요 오류:', error)
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.includes(search) ||
      book.author.includes(search)

    const matchesType =
      typeFilter === '전체' ||
      book.type === typeFilter

    return matchesSearch && matchesType
  })

  const popularBooks = [...books]

  popularBooks.sort((a, b) => {
    return b.likes - a.likes
  })

  const selectedBook = books.find((book) => {
    return book.id === selectedId
  })

  return (
    <div className="app-layout" data-theme={theme}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">B</span>
          <span>Bookworm</span>
        </div>

        <nav className="side-menu">
          <button onClick={() => setSelectedId(null)}>
            ⌂ Home
          </button>

          <button className="active">
            ▤ Library
          </button>

          <button>
            ✧ AI Integration
          </button>

          <button>
            ⚙︎ Settings
          </button>

          <div className="theme-buttons">
            <button onClick={() => setTheme('sage')}>Sage</button>
            <button onClick={() => setTheme('ivory')}>Ivory</button>
            <button onClick={() => setTheme('forest')}>Forest</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search books or authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-button"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="전체">전체 종류</option>
            <option value="로맨스">로맨스</option>
            <option value="판타지 / 무협">판타지 / 무협</option>
            <option value="추리 / 미스터리 / 스릴러">추리 / 미스터리 / 스릴러</option>
            <option value="공포 / 호러 / 오컬트">공포 / 호러 / 오컬트</option>
            <option value="자기계발">자기계발</option>
            <option value="라이트노벨">라이트노벨</option>
            <option value="에세이">에세이</option>
            <option value="경제 / 경영 / 재테크">경제 / 경영 / 재테크</option>
            <option value="인문 / 철학 / 역사">인문 / 철학 / 역사</option>
            <option value="SF">SF</option>
            <option value="과학 / 기술">과학 / 기술</option>
            <option value="사회 / 정치">사회 / 정치</option>
            <option value="예술 / 대중문화">예술 / 대중문화</option>
            <option value="실용 / 취미">실용 / 취미</option>
            <option value="시 / 희곡">시 / 희곡</option>
          </select>
        </header>

        <section className="page-title">
          <div>
            <span className="breadcrumb">My Library / Books</span>
            <h1>My Library</h1>
            <p>나만의 책을 관리하는 공간입니다.</p>
          </div>

          <span className="total-books">{books.length} Books</span>
        </section>

        <section className="popular-section">
          <div className="section-title">
            <div>
              <h2>Popular Books</h2>
              <p>좋아요가 많은 인기 도서 TOP 3</p>
            </div>

            <span className="top-label">TOP 3</span>
          </div>

          <div className="popular-list">
            {popularBooks.slice(0, 3).map((book, index) => (
              <div className="popular-card" key={book.id}>
                <span className="popular-rank">0{index + 1}</span>

                <div className="popular-cover">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} />
                  ) : (
                    <span>📖</span>
                  )}
                </div>

                <div className="popular-info">
                  <strong>{book.title}</strong>
                  <small>{book.author}</small>
                </div>

                <span className="popular-like">♥ {book.likes}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="library-section">
          <div className="section-title">
            <div>
              <h2>My Books ({filteredBooks.length})</h2>
              <p>내 서재에 등록된 도서 목록</p>
            </div>
          </div>

          {loading ? (
            <p className="empty-message">
              도서 목록을 불러오는 중입니다.
            </p>
          ) : (
            <BookList
              books={filteredBooks}
              onSelect={setSelectedId}
              onLike={handleLike}
              onAdd={() => setShowCreate(true)}
            />
          )}
        </section>
      </main>

      {showCreate && (
        <BookCreate
          onCreate={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {selectedBook && !editBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedId(null)}
          onEdit={() => setEditBook(selectedBook)}
          onDelete={() => handleDelete(selectedBook.id)}
        />
      )}

      {editBook && (
        <BookEdit
          book={editBook}
          onUpdate={handleUpdate}
          onCancel={() => setEditBook(null)}
        />
      )}
    </div>
  )
}

export default App
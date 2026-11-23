
import { useState, useEffect } from 'react'
import './App.css'

// 컴포넌트 불러오기
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import BookCreate from './components/BookCreate'
import BookEdit from './components/BookEdit'

function App() {

  // 서버 주소
  const API_URL = 'http://localhost:3000/books'

  // 도서 목록
  const [books, setBooks] = useState([])

  // 로딩 상태
  const [loading, setLoading] = useState(true)

  // 검색어
  const [search, setSearch] = useState('')

  // 장르 필터
  const [typeFilter, setTypeFilter] = useState('전체')

  // 선택한 도서 ID
  const [selectedId, setSelectedId] = useState(null)

  // 등록창 표시
  const [showCreate, setShowCreate] = useState(false)

  // 수정할 도서
  const [editBook, setEditBook] = useState(null)

  // 테마
  const [theme, setTheme] = useState('sage')


  // =========================
  // 1. 도서 목록 조회 GET
  // =========================

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

  // 처음 화면이 실행될 때 도서 목록 가져오기
  useEffect(() => {
    fetchBooks()
  }, [])


  // =========================
  // 2. 도서 등록 POST
  // =========================

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

      // 새 도서를 목록에 추가
      setBooks([...books, data])

      setShowCreate(false)

      alert('도서가 등록되었습니다.')

    } catch (error) {
      console.log('도서 등록 오류:', error)
    }
  }


  // =========================
  // 3. 도서 수정 PATCH
  // =========================

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

      const data = await response.json()

      // 수정된 도서 정보 반영
      const newBooks = books.map((book) => {
        if (book.id === id) {
          return data
        }

        return book
      })

      setBooks(newBooks)
      setEditBook(null)

      alert('도서 정보가 수정되었습니다.')

    } catch (error) {
      console.log('도서 수정 오류:', error)
    }
  }


  // =========================
  // 4. 도서 삭제 DELETE
  // =========================

  const handleDelete = async (id) => {

    const result = window.confirm('정말 삭제하시겠습니까?')

    if (!result) {
      return
    }

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      // 삭제된 도서를 목록에서 제외
      const newBooks = books.filter((book) => {
        return book.id !== id
      })

      setBooks(newBooks)
      setSelectedId(null)

      alert('도서가 삭제되었습니다.')

    } catch (error) {
      console.log('도서 삭제 오류:', error)
    }
  }


  // =========================
  // 5. 좋아요 PATCH
  // =========================

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


  // =========================
  // 6. 검색 및 장르 필터
  // =========================

  const filteredBooks = books.filter((book) => {

    const matchesSearch =
      book.title.includes(search) ||
      book.author.includes(search)

    const matchesType =
      typeFilter === '전체' ||
      book.type === typeFilter

    return matchesSearch && matchesType
  })


  // =========================
  // 7. 좋아요 순 추천 도서 TOP 3
  // =========================

  const popularBooks = [...books]

  popularBooks.sort((a, b) => {
    return b.likes - a.likes
  })


  // =========================
  // 8. 선택한 도서 찾기
  // =========================

  const selectedBook = books.find((book) => {
    return book.id === selectedId
  })


  // =========================
  // 화면 출력
  // =========================

  return (
    <div className="app-layout" data-theme={theme}>

      {/* 왼쪽 메뉴 */}
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

          {/* 테마 변경 버튼 추가 */}
      <div className="theme-buttons">
        <button onClick={() => setTheme('sage')}>Sage</button>
        <button onClick={() => setTheme('ivory')}>Ivory</button>
        <button onClick={() => setTheme('forest')}>Forest</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
      </div>

        </nav>

      </aside>


      {/* 메인 화면 */}
      <main className="main-content">

        {/* 상단 검색 */}
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


        {/* 페이지 제목 */}
        <section className="page-title">

          <div>
            <span className="breadcrumb">
              My Library / Books
            </span>

            <h1>My Library</h1>

            <p>나만의 책을 관리하는 공간입니다.</p>
          </div>

          <span className="total-books">
            {books.length} Books
          </span>

        </section>


        {/* 인기 도서 */}
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

                <span className="popular-rank">
                  0{index + 1}
                </span>

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

                <span className="popular-like">
                  ♥ {book.likes}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* 전체 도서 목록 */}
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


      {/* 도서 등록 창 */}
      {showCreate && (
        <BookCreate
          onCreate={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}


      {/* 도서 상세 창 */}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedId(null)}
          onEdit={() => setEditBook(selectedBook)}
          onDelete={() => handleDelete(selectedBook.id)}
        />
      )}


      {/* 도서 수정 창 */}
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

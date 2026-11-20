
import { useState } from 'react'
import BookForm from './BookForm'

function BookEdit({ book, onUpdate, onCancel }) {

  // 기존 도서 정보를 입력 칸에 불러오기
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [type, setType] = useState(book.type)
  const [content, setContent] = useState(book.content)
  const [coverImageUrl, setCoverImageUrl] = useState(
    book.coverImageUrl || ''
  )

  // 수정 버튼 클릭
  const handleSubmit = (e) => {
    e.preventDefault()

    if (title.trim() === '' || author.trim() === '') {
      alert('제목과 작가를 입력해주세요.')
      return
    }

    const updateBook = {
      title: title,
      author: author,
      type: type,
      content: content,
      coverImageUrl: coverImageUrl
    }

    onUpdate(book.id, updateBook)
  }

  return (
    <div className="modal-overlay">
      <div className="book-modal">

        <h2>도서 수정</h2>
        <p>도서 정보를 수정해주세요.</p>

        <form onSubmit={handleSubmit}>

          <BookForm
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            type={type}
            setType={setType}
            content={content}
            setContent={setContent}
            coverImageUrl={coverImageUrl}
            setCoverImageUrl={setCoverImageUrl}
          />

          <div className="form-buttons">

            <button type="submit" className="save-button">
              수정 완료
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              취소
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

export default BookEdit

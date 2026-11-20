
function BookDetail({ book, onClose, onEdit, onDelete }) {

  // 날짜 형식 변경
  const formatDate = (date) => {
    if (!date) {
      return '날짜 정보 없음'
    }

    return new Date(date).toLocaleString('ko-KR')
  }

  return (
    <div className="modal-overlay">
      <div className="book-modal detail-modal">

        <div className="detail-header">
          <h2>도서 상세 정보</h2>

          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        {/* 책 표지 */}
        <div className="detail-cover">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <div className="cover-placeholder">
              <strong>{book.title}</strong>
              <small>{book.author}</small>
            </div>
          )}
        </div>

        {/* 도서 정보 */}
        <div className="detail-info">

          <h3>{book.title}</h3>

          <p>작가 : {book.author}</p>
          <p>종류 : {book.type}</p>
          <p>좋아요 : ♥ {book.likes}</p>

          <div className="detail-content">
            <strong>책 내용</strong>
            <p>{book.content}</p>
          </div>

          {/* 생성 날짜 및 수정 날짜 */}
          <div className="date-info">

            <p>
              <strong>생성 날짜</strong>
              <span>{formatDate(book.createdAt)}</span>
            </p>

            <p>
              <strong>수정 날짜</strong>
              <span>{formatDate(book.updatedAt)}</span>
            </p>

          </div>

        </div>

        {/* 수정 및 삭제 버튼 */}
        <div className="form-buttons">

          <button
            className="save-button"
            onClick={onEdit}
          >
            수정
          </button>

          <button
            className="delete-button"
            onClick={onDelete}
          >
            삭제
          </button>

          <button
            className="cancel-button"
            onClick={onClose}
          >
            닫기
          </button>

        </div>

      </div>
    </div>
  )
}

export default BookDetail


function BookForm({
  title,
  setTitle,
  author,
  setAuthor,
  type,
  setType,
  content,
  setContent,
  coverImageUrl,
  setCoverImageUrl
}) {
  return (
    <div className="book-form">

      {/* 책 제목 */}
      <label>책 제목</label>
      <input
        type="text"
        placeholder="책 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 작가 */}
      <label>작가</label>
      <input
        type="text"
        placeholder="작가 이름을 입력하세요"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* 도서 종류 */}
      <label>도서 종류</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="로맨스">로맨스</option>
        <option value="판타지">판타지</option>
        <option value="에세이">에세이</option>
        <option value="소설">소설</option>
        <option value="자기계발">자기계발</option>
      </select>

      {/* 책 내용 */}
      <label>책 내용</label>
      <textarea
        placeholder="책 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 표지 이미지 주소 */}
      <label>표지 이미지 URL</label>
      <input
        type="text"
        placeholder="이미지 주소를 입력하세요"
        value={coverImageUrl}
        onChange={(e) => setCoverImageUrl(e.target.value)}
      />

    </div>
  )
}

export default BookForm

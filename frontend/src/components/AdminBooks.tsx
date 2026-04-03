import { useEffect, useState } from 'react';
import API_URL from '../config';

type Book = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
};

const emptyBook: Omit<Book, 'bookId'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState(emptyBook);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBooks = async () => {
    const response = await fetch(`${API_URL}/api/Book?pageSize=1000&pageNum=1`);
    const data = await response.json();
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await fetch(`${API_URL}/api/Book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData(emptyBook);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.bookId);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
  };

  const handleUpdate = async () => {
    await fetch(`${API_URL}/api/Book/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setEditingId(null);
    setFormData(emptyBook);
    fetchBooks();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    await fetch(`${API_URL}/api/Book/${id}`, {
      method: 'DELETE',
    });
    fetchBooks();
  };

  return (
    <div className="container mt-4">
      <h2>Admin — Manage Books</h2>

      <div className="card p-3 mb-4">
        <h5>{editingId ? 'Edit Book' : 'Add New Book'}</h5>
        <div className="row g-2">
          {(Object.keys(emptyBook) as (keyof typeof emptyBook)[]).map(
            (field) => (
              <div className="col-md-3" key={field}>
                <input
                  className="form-control"
                  name={field}
                  placeholder={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            )
          )}
        </div>
        <div className="mt-2">
          {editingId ? (
            <>
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData(emptyBook);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd}>
              Add Book
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>${book.price}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(book.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBooks;

import { useEffect, useState, useRef } from 'react';
import type { Book } from './types/Book';
import type { CartItem } from './types/CartItem';
import { Tooltip, Toast } from 'bootstrap';

interface BookListProps {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (book: Book, currentPage: number) => void;
  savedPage: number;
  onGoToCart: () => void;
}

function BookList({
  cartItems,
  cartTotal,
  addToCart,
  savedPage,
  onGoToCart,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNum, setPageNum] = useState(savedPage);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const toastRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState('');

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Initialize tooltips whenever books change
  useEffect(() => {
    const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipEls.forEach((el) => new Tooltip(el));
  }, [books]);

  // Fetch categories once
  useEffect(() => {
    fetch('https://localhost:7247/api/book/GetBookCategories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch books
  useEffect(() => {
    const categoryParams = selectedCategories
      .map((c) => `categories=${encodeURIComponent(c)}`)
      .join('&');

    const url = `https://localhost:7247/api/book?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParams ? '&' + categoryParams : ''}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalCount(data.totalNumBooks);
      });
  }, [pageNum, pageSize, sortOrder, selectedCategories]);

  const totalPages = Math.ceil(totalCount / pageSize);

  function handleCategoryChange(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPageNum(1);
  }

  function handleAddToCart(book: Book) {
    addToCart(book, pageNum);
    setToastMessage(`"${book.title}" added to cart!`);
    if (toastRef.current) {
      const toast = new Toast(toastRef.current, { delay: 2500 });
      toast.show();
    }
  }

  return (
    <div className="container mt-4">
      {/* Toast Notification */}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-success border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Bookstore</h1>
        <button className="btn btn-outline-primary" onClick={onGoToCart}>
          🛒 Cart ({cartCount} items) — ${cartTotal.toFixed(2)}
        </button>
      </div>

      <div className="row">
        {/* Sidebar - Category Filter */}
        <div className="col-md-2">
          <h5>Category</h5>
          {categories.map((c) => (
            <div key={c} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={c}
                value={c}
                checked={selectedCategories.includes(c)}
                onChange={() => handleCategoryChange(c)}
              />
              <label className="form-check-label" htmlFor={c}>
                {c}
              </label>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          {/* Controls */}
          <div className="d-flex gap-3 mb-3 align-items-center">
            <div>
              <label className="me-2">Results per page:</label>
              <select
                className="form-select d-inline-block w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNum(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div>
              <label className="me-2">Sort by title:</label>
              <select
                className="form-select d-inline-block w-auto"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPageNum(1);
                }}
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAddToCart(book)}
                      data-bs-toggle="tooltip"
                      data-bs-placement="left"
                      title={`Add "${book.title}" to your cart`}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPageNum(pageNum - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li
                  key={p}
                  className={`page-item ${p === pageNum ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setPageNum(p)}>
                    {p}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNum(pageNum + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default BookList;

import { useState } from 'react';
import BookList from './BookList';
import Cart from './Cart';
import type { CartItem } from './types/CartItem';
import type { Book } from './types/Book';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<'list' | 'cart'>('list');
  const [savedPage, setSavedPage] = useState(1);

  function addToCart(book: Book, currentPage: number) {
    setSavedPage(currentPage);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book.bookId === book.bookId);
      if (existing) {
        return prev.map((item) =>
          item.book.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  }

  function removeFromCart(bookId: number) {
    setCartItems((prev) => prev.filter((item) => item.book.bookId !== bookId));
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div>
      {view === 'list' ? (
        <BookList
          cartItems={cartItems}
          cartTotal={cartTotal}
          addToCart={addToCart}
          savedPage={savedPage}
          onGoToCart={() => setView('cart')}
        />
      ) : (
        <Cart
          cartItems={cartItems}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          onContinueShopping={() => setView('list')}
        />
      )}
    </div>
  );
}

export default App;

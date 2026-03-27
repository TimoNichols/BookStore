import type { CartItem } from './types/CartItem';

interface CartProps {
  cartItems: CartItem[];
  cartTotal: number;
  removeFromCart: (bookId: number) => void;
  onContinueShopping: () => void;
}

function Cart({
  cartItems,
  cartTotal,
  removeFromCart,
  onContinueShopping,
}: CartProps) {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.book.bookId}>
                <td>{item.book.title}</td>
                <td>${item.book.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.book.bookId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total:
              </td>
              <td colSpan={2} className="fw-bold">
                ${cartTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}

      <button className="btn btn-primary" onClick={onContinueShopping}>
        Continue Shopping
      </button>
    </div>
  );
}

export default Cart;

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Successful!</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
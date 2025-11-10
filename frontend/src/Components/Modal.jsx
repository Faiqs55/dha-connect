const Modal = ({ isOpen, onClose, imageUrl, filename }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-4 relative">
        <button
          onClick={onClose}
          className="text-red-500 font-bold text-xl absolute top-3 right-3 hover:text-red-700"
        >
          ✖
        </button>
        <img
          src={imageUrl}
          alt={filename}
          className="w-full h-auto rounded-lg border border-gray-300"
          onError={(e) => {
            e.target.src = "/dha-data/placeholder.png";
          }}
        />
      </div>
    </div>
  );
};

export default Modal;

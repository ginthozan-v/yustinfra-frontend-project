export const Item = ({ id, name, currentPage, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 border rounded w-full text-left  ${
        currentPage === id && 'border-indigo-600'
      }`}
    >
      {name}
    </button>
  );
};

import React from 'react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search tasks..." 
}) => {
  return (
    <div className="mb-6 relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {value && (
        <button 
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          onClick={() => onChange('')}
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default SearchBar;
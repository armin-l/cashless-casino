import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export default function Input({ placeholder, value, onChange, type = 'text' }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-gray-900 text-white border border-yellow-600 border-opacity-30 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
    />
  );
}

import Image from 'next/image';
import React from 'react';

const UserIcon = () => {
  return (
    <svg
      className="w-full h-full text-gray-300 bg-white"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
};

const Avatar = ({ picture, size }) => {
  const sizes = {
    large: 'w-20 h-20',
    medium: 'w-10 h-10',
    small: 'w-8 h-8',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full relative overflow-hidden border`}
    >
      {picture ? (
        <Image
          src={picture}
          fill={true}
          style={{ objectFit: 'cover' }}
          alt="User upload"
        />
      ) : (
        <UserIcon />
      )}
    </div>
  );
};

export default Avatar;

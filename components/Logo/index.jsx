import Image from 'next/image';
import React from 'react';

const Logo = ({ isWhite }) => {
  return (
    <>
      {isWhite ? (
        <Image
          src="/images/brand/logo-white.png"
          alt="logo"
          width={720}
          height={720}
          className="object-contain w-28"
        />
      ) : (
        <Image
          src="/images/brand/logo.png"
          alt="logo"
          width={720}
          height={720}
          className="object-contain w-28"
        />
      )}
    </>
  );
};

export default Logo;

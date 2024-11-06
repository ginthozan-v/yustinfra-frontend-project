import { useEffect, useState } from 'react';

const isBrowser = () => typeof window !== 'undefined';

const useCheckMobileScreen = (size) => {
  const [width, setWidth] = useState(isBrowser() && window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    if (isBrowser()) {
      window.addEventListener('resize', handleWindowSizeChange);
    }
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return width <= size;
};

export default useCheckMobileScreen;

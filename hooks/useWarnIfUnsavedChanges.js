import { useEffect } from 'react';
import Router from 'next/router';

const useWarnIfUnsavedChanges = (unsavedChanges, callback) => {
  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = callback();
        if (!ok) {
          Router.events.emit('routeChangeError');
          // tslint:disable-next-line: no-string-throw
          throw 'Abort route change. Please ignore this error.';
        }
      };
      Router.events.on('routeChangeStart', routeChangeStart);

      return () => {
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
  }, [unsavedChanges]);
};

export default useWarnIfUnsavedChanges;

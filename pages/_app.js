import ProtectedRoute from '@/components/ProtectedRoute';
import { UsersProvider } from '@/context/UsersContext';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormProvider } from '@/context/FormContext';

export default function App({ Component, pageProps, router }) {
  const Layout = Component.Layout;
  const Title = Component.Title;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ProtectedRoute router={router}>
        {Component.auth ? (
          <UsersProvider>
            <FormProvider>
              <Layout title={Title}>
                <DndProvider backend={HTML5Backend}>
                  <Component {...pageProps} />
                </DndProvider>
              </Layout>
            </FormProvider>
          </UsersProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </ProtectedRoute>
    </>
  );
}

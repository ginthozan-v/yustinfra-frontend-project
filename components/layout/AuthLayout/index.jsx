import Image from 'next/image';

const AuthLayout = ({ children }) => {
  return (
    <main className="bg-white">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="flex flex-col h-screen after:flex-1">
            {/* Header */}
            <div className="flex-1"></div>

            {children}
          </div>
        </div>

        {/* Image */}
        <div
          className="absolute top-0 bottom-0 right-0 hidden md:block md:w-1/2"
          aria-hidden="true"
        >
          <Image
            className="object-cover object-center w-full h-full"
            src={'/images/auth-image.jpg'}
            width="760"
            height="1024"
            alt="Authentication"
          />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;

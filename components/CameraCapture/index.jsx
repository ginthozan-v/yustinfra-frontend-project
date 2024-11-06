import { Transition } from '@headlessui/react';
import { CircleStackIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useRef, useState } from 'react';
import Webcam from 'react-webcam';

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [stream, setStream] = useState(false);
  const [open, setOpen] = useState(false);

  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setStream(false);
    setOpen(true);
  };

  return (
    <div className="h-full">
      {stream && (
        <>
          <div className="absolute top-0 left-0 z-50 h-full bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="h-full"
            />
          </div>
          <button
            onClick={() => {
              setImageSrc(null);
              setOpen(false);
              setStream(false);
            }}
            className="absolute z-60 top-5 left-5"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </>
      )}
      <button
        onClick={() => setStream(true)}
        className="p-2 font-semibold text-white bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-500"
      >
        Take Photo
      </button>
      {stream && (
        <div className="absolute left-0 w-full bottom-32 z-60">
          <button onClick={captureImage}>
            <div className="w-10 h-10 bg-white border border-black rounded-full ring ring-white" />
          </button>
        </div>
      )}

      <Transition
        as={Fragment}
        show={open}
        enter="transition ease duration-700 transform"
        enterFrom="opacity-0 translate-y-0"
        enterTo="opacity-100 -translate-y-10"
        leave="transition ease duration-1000 transform"
        leaveFrom="opacity-100 -translate-y-full"
        leaveTo="opacity-0 translate-y-0"
      >
        <div className="absolute left-0 z-40 w-full h-screen overflow-x-hidden overflow-y-scroll text-center border-t top-10 bg-slate-100">
          {imageSrc && (
            <div className="p-5">
              <img src={imageSrc} alt="Captured" />
            </div>
          )}
          <button
            onClick={() => setOpen(false)}
            className="absolute flex items-center justify-center bg-gray-200 rounded w-7 h-7 top-5 right-5"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </Transition>
    </div>
  );
}

export default CameraCapture;

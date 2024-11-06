import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import InputGroup from '../InputGroup';
import api from '@/api';

import Image from 'next/image';

const DropZone = ({
  name,
  label,
  accepts,
  placeholder,
  isMultiple,
  onChange,
  value,
  disabled,
}) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleImageChange = async (event) => {
    setIsLoading(true);
    try {
      const files = event.target.files;

      if (files) {
        let imageFilesArr = [];
        for (const element of files) {
          imageFilesArr.push(element);
          element['blob'] = URL.createObjectURL(element);
        }

        const formData = new FormData();

        imageFilesArr?.forEach((img) => {
          formData.append('media', img);
          formData.append('watermark', false);
        });

        const res = await api.upload.file(formData);

        setPreviewUrl(res.data[0]);

        if (res.data) {
          onChange(res.data[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragging(false);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }

    setIsLoading(true);
    try {
      const files = event.dataTransfer.files;

      if (files) {
        let imageFilesArr = [];
        for (const element of files) {
          imageFilesArr.push(element);
          element['blob'] = URL.createObjectURL(element);
        }

        const formData = new FormData();

        imageFilesArr?.forEach((img) => {
          formData.append('media', img);
          formData.append('watermark', false);
        });

        const res = await api.upload.file(formData);

        setPreviewUrl(res.data[0]);
        if (res.data) {
          onChange(res.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  return (
    <InputGroup name={name} label={label}>
      <div
        className={`w-full col-span-full ${disabled && 'opacity-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg border-gray-900/25">
          <div className="text-center">
            {previewUrl ? (
              <Image
                src={previewUrl}
                className="object-contain w-20 h-20 mx-auto text-gray-300 "
                width={720}
                height={720}
                alt="header_logo"
              />
            ) : (
              <PhotoIcon
                className="w-12 h-12 mx-auto text-gray-300"
                aria-hidden="true"
              />
            )}
            <div className="flex justify-center mt-4 text-sm leading-6 text-gray-600">
              <label
                htmlFor={name}
                className="relative font-semibold text-indigo-600 rounded-md cursor-pointer focus-within:outline-none hover:text-indigo-500"
              >
                <span>{isLoading ? 'Uploading...' : 'Upload a file'} </span>
                <input
                  id={name}
                  name={name}
                  type="file"
                  accept={'.png, .jpg, .jpeg'}
                  className="sr-only"
                  onChange={handleImageChange}
                  disabled={disabled}
                />
              </label>
              {!isLoading && <p className="pl-1">or drag and drop</p>}
            </div>
            <p className="text-xs leading-5 text-gray-600">{placeholder}</p>
          </div>
        </div>
      </div>
    </InputGroup>
  );
};

export default DropZone;

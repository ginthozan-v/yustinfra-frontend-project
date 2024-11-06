import api from '@/api';
import Toast from '@/components/Toast';
import { Field } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const FileUploadButton = ({
  label,
  name,
  accepts,
  placeholder,
  isMultiple,
  onChange,
  error,
  local,
  min,
  max,
}) => {
  const [previewUrl, setPreviewUrl] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState(null);

  const handleImageChange = (event) => {
    const files = event.target.files;

    if (min && files.length < min) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message={`Minimum ${min} files should be selected!`}
          toast={toast}
        />
      ));
      return;
    }

    if (max && files.length > max) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message={`Maximum ${max} files should be selected!`}
          toast={toast}
        />
      ));
      return;
    }

    if (files) {
      let imageFilesArr = [];
      if (local) {
        for (const element of files) {
          const imageUrl = URL.createObjectURL(element);
          imageFilesArr.push({ file: imageUrl, type: element.type });
        }
        onChange(imageFilesArr);
      } else {
        setFilename(
          files?.[0].name.slice(0, 15) + '...' + files?.[0].name.slice(-1, 4)
        );
        for (const element of files) {
          imageFilesArr.push(element);
        }
      }

      setImageFiles(imageFilesArr);
    }
  };

  const uploadMedia = async (medias) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      medias?.forEach((img) => {
        formData.append('media', img);
      });

      const res = await api.upload.file(formData);

      setPreviewUrl(res.data);
      onChange(JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (imageFiles.length > 0 && !local) {
      uploadMedia(imageFiles);
    }
  }, [imageFiles, local]);

  return (
    <>
      <div className="relative">
        {label && (
          <label
            htmlFor="cover-photo"
            className="block mb-1 text-sm text-[#475569] "
          >
            {label}
          </label>
        )}

        <div
          className={`flex items-center justify-center  p-2 font-semibold text-white bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-500 ${
            isLoading && 'bg-indigo-500 cursor-progress'
          }`}
        >
          <label htmlFor={name} className="text-center cursor-pointer ">
            <span className="truncate ">
              {isLoading ? 'Uploading...' : filename ?? placeholder}
            </span>
            <input
              id={name}
              name={name}
              type="file"
              accept={accepts}
              className="sr-only"
              multiple={isMultiple}
              onChange={handleImageChange}
              disabled={isLoading}
            />
            {/* <Field
              id={name}
              name={name}
              type="file"
              accept={accepts}
              className="sr-only"
              multiple={isMultiple}
              onChange={handleImageChange}
              disabled={isLoading}
            /> */}
          </label>
        </div>
        {error && (
          <small className="text-red-500">{error['documentURL']}</small>
        )}
      </div>
    </>
  );
};

export default FileUploadButton;

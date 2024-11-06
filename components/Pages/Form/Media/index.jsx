import Card from '@/components/Card';
import Image from 'next/image';
import React from 'react';

const Media = ({ medias }) => {
  const values = medias && JSON.parse(medias?.field_value);

  return (
    <Card>
      <div>
        <div className="p-5">
          <div className="text-sm font-semibold text-[#111827]">Form Media</div>
        </div>
        <div className="grid grid-cols-2">
          {values.slice(0, 4).map((val) => (
            <Image
              key={val}
              src={val}
              alt="image"
              width={250}
              height={150}
              className="object-cover w-32 aspect-square"
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Media;

import Card from '@/components/Card';
import React from 'react';

const FormLocation = ({ location }) => {
  const values = location && JSON.parse(location?.field_value);
  const zoomLevel = 50;
  const embeddedLink = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d${values?.longitude}!3d${values?.latitude}!2m3!1f0!2f0!3f0!3m2!1i${zoomLevel}!2i0!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQyJzA0LjQiTiAxMjLCsDU2JzMzLjYiVw!5e0!3m2!1sen!2sus!4v1625570459583!5m2!1sen!2sus`;

  return (
    <iframe
      src={embeddedLink}
      width="100%"
      height="150"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default FormLocation;

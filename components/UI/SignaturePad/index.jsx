import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import InputGroup from '../InputGroup';

const SignaturePad = ({ name, label, error, hint, required }) => {
  return (
    <InputGroup name={name} label={label} error={error} required={required}>
      <SignatureCanvas
        penColor="black"
        canvasProps={{
          className: 'w-full h-44 sigCanvas border',
        }}
      />
      {/* <button
        onClick={(e) => {
          ref.clear();
        }}
      >
        Clear
      </button> */}
    </InputGroup>
  );
};

export default SignaturePad;

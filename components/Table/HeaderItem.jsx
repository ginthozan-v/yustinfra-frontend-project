import React from "react";

const HeaderItem = ({ name }) => {
  return (
    <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
      <div className="font-semibold text-left">{name}</div>
    </th>
  );
};

export default HeaderItem;

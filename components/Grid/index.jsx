import React, { useState } from 'react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import RenderWidgets from '../Template/RenderWidgets';

const Grid = ({ items, handleDeleteUser }) => {
  const [layout, setLayout] = useState(
    items.map((item, index) => ({ i: `${index}`, x: 0, y: 0, w: 2, h: 2 }))
  );

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 2, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={100}
        width={400}
        onLayoutChange={onLayoutChange}
        isResizable
      >
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        {/* {items.map((item, index) => (
          <div key={index} data-grid={layout[index]}>
         
            {RenderWidgets({ ...item }, (v) => handleDeleteUser(v))}
          </div>
        ))} */}
      </ResponsiveGridLayout>
    </DndProvider>
  );
};

export default Grid;

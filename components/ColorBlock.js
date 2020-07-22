import React from 'react';

const ColorBlock = (props) => {
  const { color, selected, handleClick } = props;
  return (
    <div
      className={`w-3 h-3 m-1 rounded-sm bg-${color} hover:opacity-75 cursor-pointer ${
        selected && "transform scale-150 border-2 border-black border-opacity-25 shadow rounded-full"
      }`}
      key={color}
      onClick={(e) => handleClick(e, color)}
    ></div>
  );
};

export default ColorBlock;

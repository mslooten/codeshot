import React from 'react';

import ColorBlock from './ColorBlock';

const ColorPicker = (props) => {
  const { colors, setColors } = props;
  const [selected, setSelected] = React.useState(["teal-300", "pink-300"]);
  const baseColors = ["gray", "red", "orange", "yellow", "green", "teal", "blue", "indigo", "purple", "pink"];
  const intensities = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const colorIntensities = [];
  baseColors.forEach((base) => colorIntensities.push(...intensities.map((intensity) => base + "-" + intensity)));

  const handleClick = (e, color) => {
    const activeColor = window.getComputedStyle(e.target).getPropertyValue("background-color");
    if (selected.includes(color)) {
      setColors([...colors.filter((color) => color !== activeColor)]);
      setSelected([...selected.filter((selectedItem) => selectedItem !== color)]);
    } else if (selected.length === 2) {
      setSelected([color]);
      setColors([activeColor]);
    } else {
      setSelected([...selected, color]);
      setColors([...colors, activeColor]);
    }
  };
  return (
    <div className="grid">
      <div className="flex flex-wrap">
        {colorIntensities.map((color) => (
          <ColorBlock color={color} selected={selected.includes(color)} key={color} handleClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

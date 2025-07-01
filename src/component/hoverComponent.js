import React, { useState } from "react";
import "../styles/hoverComponent.css";

const HoverComponent = ({ children, tooltip }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="hover-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && tooltip && <div className="hover-tooltip">{tooltip}</div>}
    </div>
  );
};

export default HoverComponent;

import React from 'react';
import { BsDatabaseCheck, BsDatabaseFillCheck } from 'react-icons/bs';

import './DashInfoLine.css';

function DashInfoLine({ props }) {
  const {
    icon = null, // filledDB, transparentDB | null
    statusline = '',
    dataLength = null,
    isHighlited = false,
    buttonHandler = null,
  } = props;

  let iconToRender = null;

  switch (icon) {
    case 'filledDB':
      iconToRender = (
        <BsDatabaseFillCheck size={16} color="var(--primary-color)" />
      );
      break;
    case 'transparentDB':
      iconToRender = <BsDatabaseCheck size={16} color="var(--primary-color)" />;
      break;
    default:
      iconToRender = null;
  }

  return (
    <div className="dash__info">
      <div className="dash__info-icon">{iconToRender}</div>
      <p className="dash__info-statusline">
        {statusline}
        <span
          className={
            isHighlited ? 'dash__info-highlited-data' : 'dash__info-data'
          }
        >
          {dataLength}
        </span>
      </p>
      {buttonHandler && <div className="dash__info-button">Порівняти дані</div>}
    </div>
  );
}

export default DashInfoLine;

import { LuServer, LuServerOff } from 'react-icons/lu';

import './ConnectionStatusLine.css';

const CONNECTED_MSG = "З'єднання із сервером встановлено";
const DISCONNECTED_MSG = "Немає зв'язку із сервером";

const ConnectionStatusLine = ({ isConnected }) => {
  return (
    <div className="status-wrapper">
      {isConnected ? (
        <LuServer
          color="#fff"
          fontSize={27}
          // onClick={() => setToggleMenu(true)}
        />
      ) : (
        <LuServerOff
          color="#fff"
          fontSize={27}
          // onClick={() => setToggleMenu(true)}
        />
      )}

      <p
        className={
          isConnected ? 'connected-status-line' : 'disconnected-status-line'
        }
      >
        {isConnected ? CONNECTED_MSG : DISCONNECTED_MSG}
      </p>
    </div>
  );
};
export default ConnectionStatusLine;

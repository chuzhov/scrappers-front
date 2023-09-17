import { LuServer, LuServerOff } from 'react-icons/lu';

import './ConnectionStatusLine.css';
import '../../variables.css';

const CONNECTED_MSG = "З'єднання із сервером встановлено";
const DISCONNECTED_MSG = "Немає зв'язку із сервером";

const ConnectionStatusLine = ({ isConnected }) => {
  return (
    <div className="status-wrapper">
      {isConnected ? (
        <LuServer color="var(--title-color)" size={26} />
      ) : (
        <LuServerOff color="var(--error-text-color)" size={26} />
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

import { useEffect, useRef, useState } from 'react';
import './ScrappingDashboard.css';

const ScrappingDashboard = ({ user, socket, isConnected, target, data }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleGetData = () => {
    if (socket) {
      socket.emit('generateReport', { email: user, target });
      setIsFetching(true);
    }
  };

  const categorieListRef = useRef(null);
  const scrollToBottom = () => {
    categorieListRef.current.scrollTop = categorieListRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [data.data.progressMsg.length]);

  if (target !== data.target) return;

  return (
    <div className="dashboard-wrapper">
      <p className="dash__title">
        Сайт: <span className="dash__site-name">{data.target}</span>
      </p>
      <p className="dash__regular">
        Час останнього сканування: <span>2023-09-03 20:00</span>
      </p>

      <button onClick={handleGetData} disabled={isFetching}>
        ПОЧАТИ ЗБІР ДАНИХ
      </button>

      <div ref={categorieListRef} className="scraper-progress">
        <ul>
          {data.data.progressMsg.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScrappingDashboard;

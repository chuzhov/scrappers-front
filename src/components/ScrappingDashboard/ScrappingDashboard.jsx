import { useEffect, useRef } from 'react';

import ProgressButton from 'react-progress-button';

import './ScrappingDashboard.css';

const ScrappingDashboard = ({
  user,
  socket,
  isConnected,
  isFetching,
  setIsFetching,
  target,
  data,
}) => {
  const handleGetData = () => {
    if (socket) {
      socket.emit('generateReport', { email: user, target });
      setIsFetching(prevDashboardData => {
        return prevDashboardData.map(item => {
          if (item.target === target) {
            item.isFetching = true;
          }
          return item;
        });
      });
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
      {data.previousDate && (
        <>
          <p className="dash__regular">
            Час попереднього сканування: <span>{data.previousDate}</span>
          </p>
          <p className="dash__regular">
            Кількість строк в каталозі: <span>{data.previousLength}</span>
          </p>
        </>
      )}
      <div>
        <ProgressButton
          onClick={handleGetData}
          state={isFetching ? 'loading' : ''}
        >
          Стягнути дані
        </ProgressButton>
      </div>

      {/* <button onClick={handleGetData} disabled={isFetching}></button> */}
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

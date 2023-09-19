import { useEffect, useRef } from 'react';

import ProgressButton from 'react-progress-button';
import { BsDatabaseFillCheck } from 'react-icons/bs';

import './ScrappingDashboard.css';
import toShorterDate from 'utils/toShorterDate';

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
      <div className="dash__data">
        {data.previousData.length > 0 ? (
          <>
            <p className="dash__data-string">
              <BsDatabaseFillCheck size={16} color="var(--primary-color)" />
              <span>{toShorterDate(data.previousData[0].reportCreatedAt)}</span>
              <span>
                завантажено строк в каталозі{' '}
                <span>{data.previousData[0].dataLength}</span>
              </span>
            </p>
          </>
        ) : (
          <p className="dash__data-string">
            Стягуніть дані. Наступного разу їх можна буде порівняти з новими
          </p>
        )}
        {data.previousData.length > 0 ? (
          <p className="dash__data-string">
            Завантажте нові дані для порівняння
          </p>
        ) : null}
      </div>
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

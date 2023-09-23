import { useEffect, useRef } from 'react';

import ProgressButton from 'react-progress-button';

import './ScrappingDashboard.css';
// import toShorterDate from 'utils/toShorterDate';
import DashInfoLine from 'components/DashInfoLine/DashInfoLine';

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
        console.log('ScrappingDashboard');
        console.dir(typeof prevDashboardData);
        console.log(prevDashboardData[0]);
        return prevDashboardData.map(item => {
          if (item.target === target) {
            // Return new object with updated isFetching
            return {
              ...item,
              isFetching: true,
            };
          } else {
            // Return unchanged item
            return item;
          }
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

  return (
    <div className="dashboard-wrapper">
      <p className="dash__title">
        Сайт: <span className="dash__site-name">{data.target}</span>
      </p>
      <DashInfoLine
        props={{ statusLine: 'Test status line', dataLength: 100 }}
      />
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

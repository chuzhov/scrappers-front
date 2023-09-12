import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';
import ConnectionStatusLine from './ConnectionStatusLine/ConnectionStatusLine';
import ScrappingDashboard from './ScrappingDashboard/ScrappingDashboard';
import handleReportGenStatusMsg from 'utils/handleReportStatusMsg';

const USER_EMAIL = 'some-email@gmail.com';
//const SERVER_URL = 'http://127.0.0.1:4000';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const TARGETS = ['EN'];

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  /* eslint-disable */
  const INIT_DASH_STATE = TARGETS.map(t => ({
    target: t,
    isFetching: false,
    data: {
      progressMsg: [],
      dateString: '',
      report: null,
    },
    previousDate: '',
    previousLength: 0,
  }));
  /* eslint-enable */
  const [dashboardData, setDashboardData] = useState(INIT_DASH_STATE);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 2,
      query: {
        email: USER_EMAIL,
      },
    });

    newSocket.on('connect', () => {
      console.log('Соединение установлено.');
      setIsConnected(true);
    });

    newSocket.on('status', ({ target, jobStatus }) => {
      if (jobStatus === 'scrapping') {
        setDashboardData(prevDashboardData => {
          return prevDashboardData.map(item => {
            if (item.target === target) {
              item.isFetching = true;
            }
            return item;
          });
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Соединение с сервером разорвано.');
      setIsConnected(false);
    });

    newSocket.on('reportGenStatus', ({ target, msg }) => {
      const formattedMsg = handleReportGenStatusMsg(msg);
      setDashboardData(prevDashboardData => {
        return prevDashboardData.map(item => {
          if (item.target === target) {
            console.log(formattedMsg);
            item.data.progressMsg.push(formattedMsg);
          }
          return item;
        });
      });
    });

    // Move the event listener setup outside of handleGetData
    newSocket.on('reportGenerated', ({ target, success, data, dateString }) => {
      setDashboardData(prevDashboardData => {
        return prevDashboardData.map(item => {
          if (item.target === target) {
            item.isFetching = false;
            item.data.dateString = dateString;
            item.data.report = data;
          }
          return item;
        });
      });
      let msg = '';
      if (success) {
        const sheetName = target;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        const filename = `${target} ${dateString}.xlsx`;
        try {
          XLSX.writeFile(workbook, filename);
          msg = `Каталог збережен в папці завантажень в файл ${filename}`;
          newSocket.emit('setJobDone', TARGETS[0]);
        } catch (error) {
          msg = `Помилка під час збереження файлу: ${error?.message}`;
        }
      } else {
        msg = `Помилка під час стягування інформації: ${data}`;
      }
      setDashboardData(prevDashboardData => {
        return prevDashboardData.map(item => {
          if (item.target === target) {
            item.data.progressMsg.push(msg);
          }
          return item;
        });
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleRestoreConnection = () => {
    if (!isConnected) {
      socket.connect();
    }
  };

  return (
    <div>
      <h1 style={{ color: 'white', textAlign: 'center' }}>
        Збирач даних із сайтів Постачальників
      </h1>

      <ConnectionStatusLine isConnected={isConnected} />
      {isConnected ? (
        <ScrappingDashboard
          user={USER_EMAIL}
          isConnected={isConnected}
          socket={socket}
          target={TARGETS[0]}
          data={dashboardData[0]}
        />
      ) : (
        <button onClick={handleRestoreConnection}>Restore Connection</button>
      )}
    </div>
  );
}

export default App;

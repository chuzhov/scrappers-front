import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';

import handleReportGenStatusMsg from 'utils/handleReportStatusMsg';

import ConnectionStatusLine from '../../components/ConnectionStatusLine/ConnectionStatusLine';
import ScrappingDashboard from '../../components/ScrappingDashboard/ScrappingDashboard';

const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000'
    : process.env.REACT_APP_SERVER_URL;
const TARGETS = ['EN', 'EA'];

function Main({ user }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  /* eslint-disable */
  const INIT_DASH_STATE = TARGETS.map(t => ({
    target: t,
    isFetching: false,
    data: {
      jobId: null,
      progressMsg: [],
      dateString: '',
      report: [],
    },
    previousData: [
      {
        reportCreatedAt: null,
        dataLength: 0,
        report: [],
      },
    ],
  }));
  /* eslint-enable */
  const [dashboardData, setDashboardData] = useState(INIT_DASH_STATE);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 2,
      query: {
        email: user,
        targets: JSON.stringify(TARGETS),
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to my server.');
      setIsConnected(true);
    });

    newSocket.on('previousJobs', previousJobs => {
      console.log('Getting previous jobs.');
      setDashboardData(prevDashboardData => {
        return prevDashboardData.map((item, target) => {
          if (target < previousJobs.length) {
            // Create a copy of the item with the updated property
            return {
              ...item,
              previousData: previousJobs[target],
            };
          }
          return item; // No change for items beyond the length of previousJobs
        });
      });
    });

    newSocket.on('status', ({ target, jobStatus }) => {
      if (jobStatus === 'scrapping') {
        setDashboardData(prevDashboardData => {
          console.log('status PDD ', prevDashboardData);
          return prevDashboardData.map(item => {
            if (item.target === target) {
              // Create a new object with the updated isFetching property
              return {
                ...item,
                isFetching: true,
              };
            }
            return item;
          });
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from my server.');
      setIsConnected(false);
    });

    newSocket.on('reportGenStatus', ({ target, msg }) => {
      const formattedMsg = handleReportGenStatusMsg(msg);
      setDashboardData(prevDashboardData => {
        console.log('reportGenStatus', prevDashboardData);
        return prevDashboardData.map(item => {
          if (item.target === target) {
            console.log(formattedMsg);
            // Create a new object with the updated progressMsg property
            return {
              ...item,
              data: {
                ...item.data,
                progressMsg: [...item.data.progressMsg, formattedMsg],
              },
            };
          }
          return item;
        });
      });
    });

    // Move the event listener setup outside of handleGetData
    newSocket.on(
      'reportGenerated',
      ({ jobId, target, success, data, dateString }) => {
        setDashboardData(prevDashboardData => {
          console.log('reportGenerated PDD', prevDashboardData);
          return prevDashboardData.map(item => {
            if (item.target === target) {
              // Create a new object with the updated properties
              return {
                ...item,
                isFetching: false,
                data: {
                  ...item.data,
                  jobId,
                  dateString,
                  report: data,
                },
              };
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
            newSocket.emit('setJobDone', jobId);
          } catch (error) {
            msg = `Помилка під час збереження файлу: ${error?.message}`;
          }
        } else {
          msg = `Помилка під час стягування інформації: ${data}`;
        }
        setDashboardData(prevDashboardData => {
          console.log('reportGenerated PDD2', prevDashboardData);
          return prevDashboardData.map(item => {
            if (item.target === target) {
              // Create a new object with the updated progressMsg property
              return {
                ...item,
                data: {
                  ...item.data,
                  progressMsg: [...item.data.progressMsg, msg],
                },
              };
            }
            return item;
          });
        });
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const handleRestoreConnection = () => {
    if (!isConnected) {
      socket.connect();
    }
  };

  return (
    <div className="main">
      <ConnectionStatusLine isConnected={isConnected} />

      {isConnected ? (
        <ScrappingDashboard
          user={user}
          isConnected={isConnected}
          isFetching={dashboardData[0].isFetching}
          setIsFetching={setDashboardData}
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

export default Main;

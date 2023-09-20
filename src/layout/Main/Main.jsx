import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';

import handleReportGenStatusMsg from 'utils/handleReportStatusMsg';

import ConnectionStatusLine from '../../components/ConnectionStatusLine/ConnectionStatusLine';
import ScrappingDashboard from '../../components/ScrappingDashboard/ScrappingDashboard';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const TARGETS = ['EN'];

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
      previousJobs.forEach((jobs, target) => {
        console.dir(jobs);
        setDashboardData(prevDashboardData => {
          prevDashboardData[target].previousData = jobs;
          return { ...prevDashboardData };
        });
      });
    });

    // setDashboardData(prevDashboardData => {
    //   prevDashboardData.forEach(item => {
    //     item.previousData = [];
    //   });
    //   for (let i = 0; i < previousJobs.length; i++) {
    //     prevDashboardData[
    //       TARGETS.indexOf(previousJobs[i].target)
    //     ].previousData.push({
    //       reportCreatedAt: previousJobs[i].reportCreatedAt,
    //       dataLength: previousJobs[i].dataLength,
    //       report: previousJobs[i].data,
    //     });
    //   }
    //   return prevDashboardData;
    // });

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
      console.log('Disconnected from my server.');
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
    newSocket.on(
      'reportGenerated',
      ({ jobId, target, success, data, dateString }) => {
        setDashboardData(prevDashboardData => {
          return prevDashboardData.map(item => {
            if (item.target === target) {
              item.isFetching = false;
              item.data.jobId = jobId;
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
            newSocket.emit('setJobDone', jobId);
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

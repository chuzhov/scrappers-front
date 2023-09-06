import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';
import ConnectionStatusLine from './ConnectionStatusLine/ConnectionStatusLine';
import ScrappingDashboard from './ScrappingDashboard/ScrappingDashboard';

const USER_EMAIL = 'some-email@gmail.com';
//const SERVER_URL = 'http://127.0.0.1:4000';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
console.dir(process.env);
const TARGETS = ['EN'];

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [textStatus, setTextStatus] = useState([]);

  function handleReportGenStatusMsg(msg) {
    function generateIndent(branch) {
      const figureSpace = '\u2007'; // FIGURE SPACE
      const pipe = '│';
      if (branch) {
        return branch === 'last'
          ? figureSpace.repeat(3)
          : `${pipe}${figureSpace.repeat(2)}`;
      } else return '';
    }
    const { name, type, branch0 = '', branch1 = '' } = msg;
    const heading = type === 'middle' ? '├──' : '└──';
    const branch =
      generateIndent(branch0) + generateIndent(branch1) + heading + name;
    return branch;
  }

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
      if (jobStatus === 'scrapping') setIsFetching(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Соединение с сервером разорвано.');
      setIsConnected(false);
    });

    newSocket.on('reportGenStatus', ({ target, msg }) => {
      console.dir(msg);
      const formattedMsg = handleReportGenStatusMsg(msg);
      setTextStatus(prevTextStatus => [...prevTextStatus, formattedMsg]);
    });

    // Move the event listener setup outside of handleGetData
    newSocket.on('reportGenerated', ({ target, success, data, dateString }) => {
      setIsFetching(false);
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
      setTextStatus(prevTextStatus => [...prevTextStatus, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  //DEBUG ONLY
  useEffect(() => {
    console.dir(textStatus);
  }, [textStatus]);

  const handleGetData = () => {
    if (socket) {
      socket.emit('generateReport', { email: USER_EMAIL, target: TARGETS[0] });
      setIsFetching(true);
    }
  };

  const handleRestoreConnection = () => {
    if (!isConnected) {
      socket.connect();
    }
  };

  const categorieListRef = useRef(null);
  const scrollToBottom = () => {
    categorieListRef.current.scrollTop = categorieListRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [textStatus]);

  return (
    <div>
      <h1 style={{ color: 'white', textAlign: 'center' }}>
        Збирач даних із сайтів Постачальників
      </h1>

      <ConnectionStatusLine isConnected={isConnected} />

      <ScrappingDashboard />

      {isConnected ? (
        <button onClick={handleGetData} disabled={isFetching}>
          ПОЧАТИ ЗБІР ДАНИХ
        </button>
      ) : (
        <button onClick={handleRestoreConnection}>Restore Connection</button>
      )}

      <div
        ref={categorieListRef}
        style={{
          color: 'whitesmoke',
          marginTop: '8px',
          height: '300px',
          overflowY: 'auto',
          fontFamily: 'Consolas, Courier New, sans-serif',
        }}
      >
        <ul>
          {textStatus.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

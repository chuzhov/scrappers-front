import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
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
    const newSocket = io('http://127.0.0.1:4000', {
      reconnection: true,
      reconnectionAttempts: 2,
      query: {
        email: 'some-email@gmail.com',
      },
    });

    newSocket.on('connect', () => {
      console.log('Соединение установлено.');
      setIsConnected(true);
    });

    newSocket.on('status', jobStatus => {
      if (jobStatus === 'scrapping') setIsFetching(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Соединение с сервером разорвано.');
      setIsConnected(false);
    });

    newSocket.on('reportGenStatus', message => {
      console.dir(message);
      const formattedMsg = handleReportGenStatusMsg(message);
      setTextStatus(prevTextStatus => [...prevTextStatus, formattedMsg]);
    });

    // Move the event listener setup outside of handleGetData
    newSocket.on('reportGenerated', ({ success, data, dateString }) => {
      setIsFetching(false);
      let msg = '';
      if (success) {
        const sheetName = 'EN';
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        const filename = `EN ${dateString}.xlsx`;
        XLSX.writeFile(workbook, filename);
        msg = `Каталог EN збережен в папці завантажень в файл ${filename}`;
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

  useEffect(() => {
    //DEBUG ONLY
    console.dir(textStatus);
  }, [textStatus]);

  const handleGetData = () => {
    if (socket) {
      socket.emit('generateReport', {});
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
      <h1>Збирач даних із сайту Постачальника</h1>
      <p>
        Status:{' '}
        {isConnected
          ? "З'єднання із сервером встановлено"
          : "Немає зв'язку із сайтом"}
      </p>
      {isConnected ? (
        <button onClick={handleGetData} disabled={isFetching}>
          GET DATA
        </button>
      ) : (
        <button onClick={handleRestoreConnection}>Restore Connection</button>
      )}

      <div
        ref={categorieListRef}
        style={{
          marginTop: '8px',
          height: '300px',
          overflowY: 'auto',
          fontFamily: 'Consolas, Courier New, sans-serif',
        }}
      >
        <ul>
          <li>EN сайт</li>
          {Array.isArray(textStatus) ? (
            textStatus.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <p>`textStatus is not an array. {textStatus}`</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;

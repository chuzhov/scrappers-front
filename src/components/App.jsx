// App.jsx
import React from 'react';
import Header from '../layout/Header/Header';
import Footer from '../layout/Footer/Footer';
import Dashboard from '../layout/Main/Main';

const USER_EMAIL = 'some-email@gmail.com';

function App() {
  return (
    <div>
      <Header user={USER_EMAIL} />
      <Dashboard user={USER_EMAIL} />
      <Footer />
    </div>
  );
}

export default App;

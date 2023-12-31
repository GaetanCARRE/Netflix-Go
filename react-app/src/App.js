import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Alert from './components/Alert';
function App() {
  const location = useLocation();
  const [jwtToken, setJwtToken] = useState('');
  return (
    <main>
      {location.pathname !== '/login' && <Header jwtToken={jwtToken} setJwtToken={setJwtToken}/>}
      {/* <Header jwtToken={jwtToken} /> */}
      <Outlet context={{ 
        jwtToken,
        setJwtToken,
        }} 
      />
    </main>
  );
}

export default App;

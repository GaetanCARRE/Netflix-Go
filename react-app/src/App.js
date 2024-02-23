import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
function App() {
  const location = useLocation();
  const [jwtToken, setJwtToken] = useState("");

  const [tickInterval, setTickInterval] = useState();

  const toggleRefresh = useCallback((status) => {
    console.log("clicked")
    if (status) {
      console.log("turning on ticking")
      let i = setInterval(() => {
        const requestOptions = {
          method: "GET",
          credentials: "include",
        }
        fetch(`/refresh`, requestOptions)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          }).catch((error) => {
            console.log("user not logged in")
          })
      }, 600000)
      setTickInterval(i);
      console.log("setting tick inteveral to", i)
    } else {
      console.log("turning off ticking")
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      }
      fetch(`/refresh`, requestOptions)
        .then(response => response.json())
        .then((data) => {
          console.log(data)
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        }).catch((error) => {
          console.log(error)
        });
    }
  }, [jwtToken, toggleRefresh])


  return (
    <main>
      {location.pathname !== '/login' && <Header jwtToken={jwtToken} setJwtToken={setJwtToken} toggleRefresh={toggleRefresh} />}
      {/* <Header jwtToken={jwtToken} /> */}
      <Outlet context={{
        jwtToken,
        setJwtToken,
        toggleRefresh,
      }}
      />
    </main>
  );
}

export default App;

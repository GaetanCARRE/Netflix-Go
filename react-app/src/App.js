import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderProvider } from './components/HeaderContext';

function App() {
  const [jwtToken, setJwtToken] = useState("");

  const [tickInterval, setTickInterval] = useState();
  const toggleRefresh = useCallback((status) => {
    console.log("clicked")
    if (status) {
      let i = setInterval(() => {
        const requestOptions = {
          method: "GET",
          credentials: "include",
        }
        fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          }).catch(() => {
            console.log("user not logged in")
          });
      }, 600000)
      setTickInterval(i);
      console.log("setting tick interval to", i)
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
      fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
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



  console.log("Rendering App"); // Ajoutez cette console pour voir combien de fois le composant App est rendu

  return (
    <HeaderProvider>
      <main>
        {/* Passer la prop isHomePage à Header */}
        <Outlet
          context={{
            jwtToken,
            setJwtToken,
            toggleRefresh,
          }}
        />
        {/* {location.pathname !== '/login' && !moviePathRegex.test(location.pathname) && <Header/>} */}
      </main>
    </HeaderProvider>
  );
}

export default App;

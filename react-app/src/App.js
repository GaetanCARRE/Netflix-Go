import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const [jwtToken, setJwtToken] = useState("");
  const [isHomePage, setIsHomePage] = useState(false); // Nouvelle state pour déterminer si on est sur la page d'accueil ou non

  const [tickInterval, setTickInterval] = useState();
  const moviePathRegex = /^\/movies\/\d+$/;
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

  useEffect(() => {
    // Mettre à jour l'état pour indiquer si on est sur la page d'accueil ou non
    console.log("location.pathname : ", location.pathname)
    setIsHomePage(location.pathname === '/');
  }, [location.pathname]);

  console.log("Rendering App"); // Ajoutez cette console pour voir combien de fois le composant App est rendu

  return (
    <main>
      {/* Passer la prop isHomePage à Header */}
      {location.pathname !== '/login' && !moviePathRegex.test(location.pathname) && <Header jwtToken={jwtToken} setJwtToken={setJwtToken} toggleRefresh={toggleRefresh} isHomePage={isHomePage} />}
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

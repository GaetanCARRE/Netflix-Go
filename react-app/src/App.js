import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderProvider } from './components/HeaderContext';

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [tickInterval, setTickInterval] = useState();
  const toggleRefresh = useCallback((status) => {
    if (status) {
      let i = setInterval(() => {
        const requestOptions = {
          method: "GET",
          credentials: "include",
        }
        fetch(`/refresh`, requestOptions)
          .then(response => response.json())
          .then((data) => {
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          }).catch(() => {
            console.log("user not logged in")
          });
      }, 600000)
      setTickInterval(i);
    } else {
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
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        }).catch((error) => {
          console.log(error)
        });
    }
  }, [jwtToken, toggleRefresh])

  // Fetch user info including admin status
  useEffect(() => {
    if (jwtToken) {
      fetch(`/me`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setIsAdmin(data.is_admin || false);
        })
        .catch(() => {
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [jwtToken]);

  return (
    <HeaderProvider>
      <main>
        <Outlet
          context={{
            jwtToken,
            setJwtToken,
            toggleRefresh,
            isAdmin,
          }}
        />
      </main>
    </HeaderProvider>
  );
}

export default App;

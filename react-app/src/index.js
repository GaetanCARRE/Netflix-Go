import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
import Movies from './components/Movies';
import Home from './components/Home';
import Series from './components/Series';
import Admin from './components/Admin';
import MyList from './components/MyList';
import New from './components/New';
import EditMovie from './components/EditMovie';
import ManageCatalog from './components/ManageCatalog';
import Login from './components/Login';
import Movie from './components/Movie';
import Genres from './components/Genres';
import Genre from './components/Genre';
import VideoPlayer from './components/VideoPlayer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children : [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
      {
        path: '/video',
        element: <VideoPlayer
        path="DeadPool.mp4" />,
      },

      {
        path: '/movies/:id',
        element: <Movie />,
      },
      {
        path: '/contact',
        element: <Series />,
      },
      {
        path: '/admin',
        element: <Admin />,
      },
      {
        path: '/mylist',
        element: <MyList />
      },
      {
        path: '/new',
        element: <New />
      },
      {
        path:'/series',
        element: <Series />
      },
      {
        path: '/genres',
        element: <Genres />
      },
      {
        path: '/genre/:id',
        element: <Genre />
      },
      {
        path: '/admin/movie/0',
        element: <EditMovie />
      },
      {
        path: '/admin/movie/:id',
        element: <EditMovie />
      },
      {
        path: '/manage-catalog',
        element: <ManageCatalog />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
]
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



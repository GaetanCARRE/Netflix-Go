import { useState, useEffect, useRef } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import { CgMenuRightAlt, CgClose } from "react-icons/cg";
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { IoSearch } from "react-icons/io5";
import { useHeaderContext } from './HeaderContext';

export default function Header(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate();
  const { jwtToken, setJwtToken, toggleRefresh, isAdmin } = useOutletContext();
  const { searchClick, setSearchClick, prompt, setPrompt } = useHeaderContext();
  const promptInputRef = useRef(null);

  useEffect(() => {
    if (searchClick) {
      promptInputRef.current?.focus();
    }
  }, [searchClick]);

  const logout = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch(`/logout`, requestOptions)
      .catch((error) => {
        console.log("error logging out", error)
      })
      .finally(() => {
        setJwtToken("");
        toggleRefresh(false);
      })
    navigate('/login');
  }

  const searchMovie = (prompt) => {
    if (window.location.pathname !== '/search') {
      navigate('/search');
    }
    setPrompt(prompt);
    if (prompt === '') {
      navigate('/');
    }
  }

  return (
    <header className={`bg-stone-900 ${props.className}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">GoFlix</span>
            <img className="h-8 w-auto" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <CgMenuRightAlt className='text-white' />
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link to="/series" className="text-sm font-medium text-gray-300 hover:text-white transition">
            Series
          </Link>
          <Link to="/movies" className="text-sm font-medium text-gray-300 hover:text-white transition">
            Movies
          </Link>
          <Link to="/mylist" className="text-sm font-medium text-gray-300 hover:text-white transition">
            My List
          </Link>
          {isAdmin && (
            <>
              <Link to="/manage-catalog" className="text-sm font-medium text-red-500 hover:text-red-400 transition">
                Admin
              </Link>
            </>
          )}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-5">
          {searchClick ? (
            <div className='flex items-center border-2 border-gray-400 bg-transparent rounded-xl px-4 py-2'>
              <input
                type="text"
                value={prompt}
                placeholder="Search..."
                className='bg-transparent outline-none text-white w-40'
                ref={promptInputRef}
                onChange={(e) => searchMovie(e.target.value)}
              />
              <IoSearch className="text-white" />
            </div>
          ) : (
            <IoSearch
              className="text-white text-xl cursor-pointer hover:text-gray-300 transition"
              onClick={() => setSearchClick(!searchClick)}
            />
          )}

          {jwtToken === '' ? (
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Login
            </Link>
          ) : (
            <button onClick={logout} className="text-sm font-medium text-gray-300 hover:text-white transition">
              Logout
            </button>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-stone-900 px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <img className="h-8 w-auto" src={logo} alt="logo" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CgClose className='text-white text-xl' />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-700">
              <div className="space-y-2 py-6">
                <Link to="/series" onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base text-gray-300 hover:text-white hover:bg-stone-800"
                >
                  Series
                </Link>
                <Link to="/movies" onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base text-gray-300 hover:text-white hover:bg-stone-800"
                >
                  Movies
                </Link>
                <Link to="/mylist" onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base text-gray-300 hover:text-white hover:bg-stone-800"
                >
                  My List
                </Link>
                {isAdmin && (
                  <Link to="/manage-catalog" onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base text-red-500 hover:text-red-400 hover:bg-stone-800"
                  >
                    Admin
                  </Link>
                )}
              </div>
              <div className="py-6">
                {jwtToken === '' ? (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base text-gray-300 hover:text-white hover:bg-stone-800"
                  >
                    Login
                  </Link>
                ) : (
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base text-gray-300 hover:text-white hover:bg-stone-800"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

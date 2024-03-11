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
  const { jwtToken, setJwtToken, toggleRefresh } = useOutletContext();
  const { searchClick, setSearchClick, prompt, setPrompt } = useHeaderContext();
  const promptInputRef = useRef(null);
 

  useEffect(() => {
    if (searchClick) {
      promptInputRef.current.focus();
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
    console.log("searching for", prompt)
    if (window.location.pathname !== '/search') {
      navigate('/search');
    }
    setPrompt(prompt);
    if (prompt === '') {
      console.log("prompt is empty")
      // setSearchClick(false);
      navigate('/');
    }
    // check if page is already on search page
    

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
          <Link to="/series" className="text-sm leading-6">
            Series
          </Link>
          <Link to="/movies" className="text-sm leading-6">
            Movies
          </Link>
          <Link to="/new" className="text-sm leading-6">
            New
          </Link>
          <Link to="/mylist" className="text-sm leading-6">
            My list
          </Link>
          {jwtToken !== '' ? (
            <>
              <Link to="/manage-catalog" className="text-sm leading-6">
                Manage catalog
              </Link>
              <Link to="/admin/movie/0" className="text-sm leading-6">
                Add movie
              </Link>
            </>
          ) : null}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-5">
          {/* search */}
          {searchClick ? (
            <div className='flex items-center border-2 border-gray-400 bg-transparent rounded-xl px-4 py-2'>
              <input
                type="text"
                value={prompt}
                placeholder="Enter a movie"
                className='bg-transparent outline-none'
                ref={promptInputRef}
                onChange={(e) => searchMovie(e.target.value)}
              />
              <IoSearch className="text-white" />
            </div>
          ) : (
            <IoSearch
              className="text-white"
              onClick={() => setSearchClick(!searchClick)}
            />
          )}

          {/* login */}
          {jwtToken === '' ? (
            <Link to="/login" className="text-sm leading-6">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <div className="text-sm leading-6" onClick={logout}>
              Log out <span aria-hidden="true">&rarr;</span>
            </div>
          )}

        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-stone-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="#" className="-m-1.5 p-1.5">
              <span className="sr-only">GoFlix</span>
              <img
                className="h-8 w-auto"
                src={logo}
                alt="logo"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CgClose className='text-white' />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">

                <Link to="/series"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 hover:bg-gray-50"
                >
                  Series
                </Link>
                <Link to="/movies"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 hover:bg-gray-50"
                >
                  Movies
                </Link>
                <Link to="New"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 hover:bg-gray-50"
                >
                  New
                </Link>
                <Link to="/mylist"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 hover:bg-gray-50"
                >
                  My list
                </Link>
              </div>
              <div className="py-6">
                <Link to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base leading-7 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

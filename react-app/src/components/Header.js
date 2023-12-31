import { useState } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import { CgMenuRightAlt, CgClose } from "react-icons/cg";
import logo from '../assets/logo.png'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'


export default function Header({jwtToken, setJwtToken}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate();
  
  const logout = () => {
    setJwtToken('');
    navigate('/login');
  }
  return (
    <header className="bg-stone-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="#" className="-m-1.5 p-1.5">
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
          {jwtToken != '' ? (
            <>
              <Link to="/manage-catalog" className="text-sm leading-6">
                Manage catalog
              </Link>
              <Link to="/admin/movie" className="text-sm leading-6">
                Manage catalog
              </Link>
            </>
          ): null}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {jwtToken == '' ? (
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

import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Alert from './Alert';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setJwtToken } = useOutletContext();
    const [alertMesssage, setAlertMessage] = useState('');
    const [alertClass, setAlertClass] = useState('hidden');
    const navigate = useNavigate();
    // const setJwtToken = ''

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("email/pass", email, password)
        if (email === 'admin@goflix.com') {
            setJwtToken("true");
            setAlertClass('hidden');
            setAlertMessage('');
            navigate('/')
        } else {
            setAlertClass('alert alert-danger bg-white');
            setAlertMessage('Invalid email/password');
        }
    }

    return (
        <div className="bg-white h-screen">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-20 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Alert
                        message={alertMesssage}
                        class={alertClass}
                        role="alert"
                    />
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-light text-gray-500 hover:text-green-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

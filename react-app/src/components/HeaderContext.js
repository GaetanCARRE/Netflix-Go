import { createContext, useState, useContext } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [searchClick, setSearchClick] = useState(false);
  const [prompt, setPrompt] = useState('');
  return (
    <HeaderContext.Provider value={{ searchClick, setSearchClick, prompt, setPrompt }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => useContext(HeaderContext);

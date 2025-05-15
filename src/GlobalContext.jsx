// src/context/GlobalContext.jsx
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Example global state

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for easier usage
export const useGlobalContext = () => useContext(GlobalContext);

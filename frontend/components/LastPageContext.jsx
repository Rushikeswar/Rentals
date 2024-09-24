import React, { createContext, useContext, useState } from 'react';

const LastPageContext = createContext();

export const LastPageProvider = ({ children }) => {
  const [lastPage, setLastPage] = useState('/');

  return (
    <LastPageContext.Provider value={{ lastPage, setLastPage }}>
      {children}
    </LastPageContext.Provider>
  );
};

export const useLastPage = () => useContext(LastPageContext);

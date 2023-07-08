import React, { createContext, useState } from "react";

export const PagesContext = createContext({});

export function PagesContextProvider(props) {
  const [selectedSheet, setSelectedSheet] = useState(null);

  return (
    <PagesContext.Provider
      value={{
        selectedSheet, setSelectedSheet
      }}
    >
      {props.children}
    </PagesContext.Provider>
  );
}

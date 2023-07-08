import React, { createContext, useState } from "react";

export const FormsContext = createContext({});

export function FormsContextProvider(props) {
  const [selectedSheet, setSelectedSheet] = useState(null);

  return (
    <FormsContext.Provider
      value={{
        selectedSheet, setSelectedSheet
      }}
    >
      {props.children}
    </FormsContext.Provider>
  );
}

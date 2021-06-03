import React, { useEffect, useState } from "react";

const ThemeStateContext = React.createContext(undefined);
const ThemeActionsContext = React.createContext(undefined);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (theme.localeCompare("dark") === 0) {
      document.documentElement.style.setProperty("--app-color", "#111926");
      document.documentElement.style.setProperty("--canvas-color", "#182336");
      document.documentElement.style.setProperty("--text-color", "white");
      document.documentElement.style.setProperty("--secondary-color", "tomato");
    } else {
      document.documentElement.style.setProperty("--app-color", "white");
      document.documentElement.style.setProperty("--canvas-color", "white");
      document.documentElement.style.setProperty("--text-color", "#182336");
      document.documentElement.style.setProperty("--secondary-color", "tomato");
    }
  }, [theme]);
  return (
    <ThemeStateContext.Provider
      value={{
        theme,
      }}
    >
      <ThemeActionsContext.Provider
        value={{
          setTheme,
        }}
      >
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
};

const useThemeState = () => {
  const context = React.useContext(ThemeStateContext);
  if (context === undefined) {
    throw new Error("useThemeState must be used within a ThemeProvider");
  }

  return context;
};

const useThemeActions = () => {
  const context = React.useContext(ThemeActionsContext);
  if (context === undefined) {
    throw new Error("useThemeActions must be used within a ThemeProvider");
  }

  return context;
};

export { useThemeState, useThemeActions, ThemeProvider };

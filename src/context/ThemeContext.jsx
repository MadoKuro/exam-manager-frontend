import { createContext, useState, useMemo, useContext } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => { }, mode: 'light' });

export const useColorMode = () => {
    return useContext(ColorModeContext);
};

export const ColorModeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            {children}
        </ColorModeContext.Provider>
    );
};

// src/components/MegaMenuContext.jsx
import React, { createContext, useContext, useState } from 'react';

const MegaMenuContext = createContext();

export function MegaMenuProvider({ children }) {
    const [isMegaOpen, setMegaOpen] = useState(false);
    return (
        <MegaMenuContext.Provider value={{ isMegaOpen, setMegaOpen }}>
            {children}
        </MegaMenuContext.Provider>
    );
}

export function useMegaMenu() {
    return useContext(MegaMenuContext);
}

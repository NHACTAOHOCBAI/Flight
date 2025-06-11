import React, { createContext, useContext, useState } from "react";

interface TicketsContextType {
    tickets: TicketRequest;
    setTickets: (value: TicketRequest) => void
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tickets, setTickets] = useState<TicketRequest>({
        flightId: 0,
        tickets: []
    });

    return (
        <TicketsContext.Provider value={{ tickets, setTickets }}>
            {children}
        </TicketsContext.Provider>
    );
};

export const useTicketsContext = () => {
    const context = useContext(TicketsContext);
    if (!context) {
        throw new Error("useTicketsContext must be used inside a TicketsProvider");
    }
    return context;
};

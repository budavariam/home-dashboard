import { DEFAULT_READINGS } from "../../const";
import { ApiResponse } from "@/types";
import { useState, createContext, useContext } from "react";

interface MockDataContextType {
    useMock: boolean;
    toggleMock: () => void;
    setMockData: (data: ApiResponse[]) => void;
    getMockData: () => ApiResponse[];
}

export const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [useMock, setUseMock] = useState(false);

    const toggleMock = () => setUseMock((prev) => !prev);

    const setMockData = (data: ApiResponse[]) => {
        localStorage.setItem("mockSensorData", JSON.stringify(data));
    };

    const getMockData = (): ApiResponse[] => {
        const data = localStorage.getItem("mockSensorData");
        return data ? JSON.parse(data) : DEFAULT_READINGS;
    };

    return (
        <MockDataContext.Provider
            value={{ useMock, toggleMock, setMockData, getMockData }}
        >
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    const context = useContext(MockDataContext);
    if (!context) {
      throw new Error("useMockData must be used within a MockDataProvider");
    }
    return context;
  };
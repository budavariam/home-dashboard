import React, { createContext, useContext, useEffect, useState } from 'react';

interface ApiParams {
    user: string | null;
    bucket: string | null;
}

interface ParamContextType {
    token: string | null;
    mappings: Record<string, string>;
    apiParams: ApiParams;
    setToken: (token: string) => void;
    setMappings: (mappings: Record<string, string>) => void;
    setApiParams: (params: ApiParams) => void;
}

const ParamContext = createContext<ParamContextType | undefined>(undefined);

export const ParamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [mappings, setMappings] = useState<Record<string, string>>(
        JSON.parse(localStorage.getItem('mappings') || '{}')
    );
    const [apiParams, setApiParams] = useState<ApiParams>(() => {
        const storedApiParams = localStorage.getItem('apiParams');
        return storedApiParams ? JSON.parse(storedApiParams) : { user: null, bucket: null };
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
            localStorage.setItem('token', tokenParam);
        }

        const mappingsParam = params.get('mappings');
        if (mappingsParam) {
            const parsedMappings = mappingsParam.split(';').reduce((acc, item) => {
                const [key, value] = item.split(':');
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);
            setMappings(parsedMappings);
            localStorage.setItem('mappings', JSON.stringify(parsedMappings));
        }

        const userParam = params.get('user');
        const bucketParam = params.get('bucket');
        if (userParam || bucketParam) {
            const updatedApiParams = { user: userParam, bucket: bucketParam };
            setApiParams(updatedApiParams);
            localStorage.setItem('apiParams', JSON.stringify(updatedApiParams));
        }
    }, []);

    const value = {
        token,
        mappings,
        apiParams,
        setToken: (newToken: string) => {
            setToken(newToken);
            localStorage.setItem('token', newToken);
        },
        setMappings: (newMappings: Record<string, string>) => {
            setMappings(newMappings);
            localStorage.setItem('mappings', JSON.stringify(newMappings));
        },
        setApiParams: (newApiParams: ApiParams) => {
            setApiParams(newApiParams);
            localStorage.setItem('apiParams', JSON.stringify(newApiParams));
        },
    };

    return <ParamContext.Provider value={value}>{children}</ParamContext.Provider>;
};

export const useSensorParams = () => {
    const context = useContext(ParamContext);
    if (context === undefined) {
        throw new Error('useSensorParams must be used within a ParamProvider');
    }
    return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ApiParams {
    user: string | null;
    bucket: string | null;
}

interface ColorThresholds {
    temperature: { cold: number; hot: number };
    humidity: { low: number; high: number };
    battery: { low: number; medium: number };
    voltage: { low: number; medium: number };
}

interface ParamContextType {
    token: string | null;
    mappings: Record<string, string>;
    apiParams: ApiParams;
    defaultLanguage: string | null;
    latestValuesCount: number;
    colorThresholds: ColorThresholds;
    setToken: (token: string) => void;
    setMappings: (mappings: Record<string, string>) => void;
    setApiParams: (params: ApiParams) => void;
    setDefaultLanguage: (language: string | null) => void;
    setLatestValuesCount: (count: number) => void;
    setColorThresholds: (thresholds: ColorThresholds) => void;
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
    const [defaultLanguage, setDefaultLanguage] = useState<string | null>(
        localStorage.getItem('defaultLanguage')
    );
    const [latestValuesCount, setLatestValuesCount] = useState<number>(() => {
        const stored = localStorage.getItem('latestValuesCount');
        return stored ? parseInt(stored, 10) : 1;
    });
    const [colorThresholds, setColorThresholds] = useState<ColorThresholds>(() => {
        const stored = localStorage.getItem('colorThresholds');
        return stored ? JSON.parse(stored) : {
            temperature: { cold: 18, hot: 25 },
            humidity: { low: 30, high: 60 },
            battery: { low: 20, medium: 50 },
            voltage: { low: 2.5, medium: 2.8 }
        };
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

        const defaultLangParam = params.get('defaultLanguage');
        if (defaultLangParam) {
            setDefaultLanguage(defaultLangParam);
            localStorage.setItem('defaultLanguage', defaultLangParam);
        }
    }, []);

    const value = {
        token,
        mappings,
        apiParams,
        defaultLanguage,
        latestValuesCount,
        colorThresholds,
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
        setDefaultLanguage: (newLanguage: string | null) => {
            setDefaultLanguage(newLanguage);
            if (newLanguage) {
                localStorage.setItem('defaultLanguage', newLanguage);
            } else {
                localStorage.removeItem('defaultLanguage');
            }
        },
        setLatestValuesCount: (count: number) => {
            setLatestValuesCount(count);
            localStorage.setItem('latestValuesCount', count.toString());
        },
        setColorThresholds: (newThresholds: ColorThresholds) => {
            setColorThresholds(newThresholds);
            localStorage.setItem('colorThresholds', JSON.stringify(newThresholds));
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

export type { ColorThresholds };

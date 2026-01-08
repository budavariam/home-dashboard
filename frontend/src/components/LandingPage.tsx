import { useReducer, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSensorParams } from './context/ParamContext';

interface MappingEntry {
    id: string;
    key: string;
    value: string;
}

interface State {
    showToken: boolean;
    copied: boolean;
    localToken: string;
    localUser: string;
    localBucket: string;
    localDefaultLanguage: string;
    mappingEntries: MappingEntry[];
}

type Action =
    | { type: 'SET_SHOW_TOKEN'; payload: boolean }
    | { type: 'SET_COPIED'; payload: boolean }
    | { type: 'SET_LOCAL_TOKEN'; payload: string }
    | { type: 'SET_LOCAL_USER'; payload: string }
    | { type: 'SET_LOCAL_BUCKET'; payload: string }
    | { type: 'SET_LOCAL_DEFAULT_LANGUAGE'; payload: string }
    | { type: 'SET_MAPPING_ENTRIES'; payload: MappingEntry[] }
    | { type: 'UPDATE_MAPPING_KEY'; payload: { id: string; key: string } }
    | { type: 'UPDATE_MAPPING_VALUE'; payload: { id: string; value: string } }
    | { type: 'ADD_MAPPING' }
    | { type: 'REMOVE_MAPPING'; payload: string }
    | { type: 'SYNC_FROM_CONTEXT'; payload: { token: string; user: string; bucket: string; defaultLanguage: string; mappings: Record<string, string> } };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_SHOW_TOKEN':
            return { ...state, showToken: action.payload };
        case 'SET_COPIED':
            return { ...state, copied: action.payload };
        case 'SET_LOCAL_TOKEN':
            return { ...state, localToken: action.payload };
        case 'SET_LOCAL_USER':
            return { ...state, localUser: action.payload };
        case 'SET_LOCAL_BUCKET':
            return { ...state, localBucket: action.payload };
        case 'SET_LOCAL_DEFAULT_LANGUAGE':
            return { ...state, localDefaultLanguage: action.payload };
        case 'SET_MAPPING_ENTRIES':
            return { ...state, mappingEntries: action.payload };
        case 'UPDATE_MAPPING_KEY':
            return {
                ...state,
                mappingEntries: state.mappingEntries.map(entry =>
                    entry.id === action.payload.id ? { ...entry, key: action.payload.key } : entry
                )
            };
        case 'UPDATE_MAPPING_VALUE':
            return {
                ...state,
                mappingEntries: state.mappingEntries.map(entry =>
                    entry.id === action.payload.id ? { ...entry, value: action.payload.value } : entry
                )
            };
        case 'ADD_MAPPING':
            return {
                ...state,
                mappingEntries: [...state.mappingEntries, { id: Date.now().toString(), key: '', value: '' }]
            };
        case 'REMOVE_MAPPING':
            return {
                ...state,
                mappingEntries: state.mappingEntries.filter(entry => entry.id !== action.payload)
            };
        case 'SYNC_FROM_CONTEXT':
            return {
                ...state,
                localToken: action.payload.token,
                localUser: action.payload.user,
                localBucket: action.payload.bucket,
                localDefaultLanguage: action.payload.defaultLanguage,
                mappingEntries: Object.entries(action.payload.mappings).map(([key, value]) => ({
                    id: Date.now().toString() + Math.random(),
                    key,
                    value
                }))
            };
        default:
            return state;
    }
};

function LandingPage() {
    const { t } = useTranslation();
    const { token, apiParams, mappings, defaultLanguage } = useSensorParams();

    const [state, dispatch] = useReducer(reducer, {
        showToken: false,
        copied: false,
        localToken: token || '',
        localUser: apiParams.user || '',
        localBucket: apiParams.bucket || '',
        localDefaultLanguage: defaultLanguage || '',
        mappingEntries: Object.entries(mappings).length > 0
            ? Object.entries(mappings).map(([key, value]) => ({
                id: Date.now().toString() + Math.random(),
                key,
                value
            }))
            : [{ id: Date.now().toString(), key: '', value: '' }]
    });

    useEffect(() => {
        dispatch({
            type: 'SYNC_FROM_CONTEXT',
            payload: {
                token: token || '',
                user: apiParams.user || '',
                bucket: apiParams.bucket || '',
                defaultLanguage: defaultLanguage || '',
                mappings
            }
        });
    }, [token, apiParams, mappings, defaultLanguage]);

    const buildShareUrl = (maskToken = false) => {
        const url = new URL(window.location.href);
        url.search = '';
        if (state.localToken) url.searchParams.set('token', maskToken ? '********' : state.localToken);
        if (state.localUser) url.searchParams.set('user', state.localUser);
        if (state.localBucket) url.searchParams.set('bucket', state.localBucket);
        if (state.localDefaultLanguage) url.searchParams.set('defaultLanguage', state.localDefaultLanguage);

        const mappingsString = state.mappingEntries
            .filter(entry => entry.key && entry.value)
            .map(entry => `${entry.key}:${entry.value}`)
            .join(';');
        if (mappingsString) url.searchParams.set('mappings', mappingsString);

        return url.toString();
    };

    const handleUpdateUrl = () => {
        window.location.href = buildShareUrl();
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(buildShareUrl());
            dispatch({ type: 'SET_COPIED', payload: true });
            setTimeout(() => dispatch({ type: 'SET_COPIED', payload: false }), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 bg-white dark:bg-gray-900">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {t('LANDING.TITLE')}
            </h1>
            <div className="text-lg text-gray-700 dark:text-gray-300">
                {t('LANDING.DESCRIPTION.LINE1')}
                <br />{t('LANDING.DESCRIPTION.LINE2')}
                <br />{t('LANDING.DESCRIPTION.LINE3')} <em>{t('LANDING.DESCRIPTION.SENSOR_NAME')}</em>.
                <br />{t('LANDING.DESCRIPTION.LINE4')}{' '}
                <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://docs.thinger.io/features/buckets" target='_blank'>
                    {t('LANDING.DESCRIPTION.THINGER_BUCKET')}
                </a>.
            </div>
            <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                {t('LANDING.MOCK_INFO.TEXT1')}{' '}
                <NavLink to="mock" className="underline text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    {t('LANDING.MOCK_INFO.MOCK_LINK')}
                </NavLink>{' '}
                {t('LANDING.MOCK_INFO.TEXT2')} <br />{t('LANDING.MOCK_INFO.TEXT3')}{' '}
                <a
                    className="underline text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    href="https://thinger.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('LANDING.MOCK_INFO.THINGER_LINK')}
                </a>{' '}
                {t('LANDING.MOCK_INFO.TEXT4')}
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6 max-w-md w-full">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {t('LANDING.TRY_APP.TITLE')}
                </h2>
                <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    {t('LANDING.TRY_APP.SUBTITLE')}
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="token" className="block text-gray-700 dark:text-gray-300">
                            {t('LANDING.TRY_APP.TOKEN_LABEL')}
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type={state.showToken ? 'text' : 'password'}
                                id="token"
                                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder={t('LANDING.TRY_APP.TOKEN_PLACEHOLDER')}
                                value={state.localToken}
                                onChange={(e) => dispatch({ type: 'SET_LOCAL_TOKEN', payload: e.target.value })}
                            />
                            <button
                                className="text-sm text-blue-600 dark:text-blue-400 underline"
                                onClick={() => dispatch({ type: 'SET_SHOW_TOKEN', payload: !state.showToken })}
                            >
                                {state.showToken ? t('LANDING.TRY_APP.HIDE') : t('LANDING.TRY_APP.SHOW')}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="user" className="block text-gray-700 dark:text-gray-300">
                            {t('LANDING.TRY_APP.USER_LABEL')}
                        </label>
                        <input
                            type="text"
                            id="user"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('LANDING.TRY_APP.USER_PLACEHOLDER')}
                            value={state.localUser}
                            onChange={(e) => dispatch({ type: 'SET_LOCAL_USER', payload: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="bucket" className="block text-gray-700 dark:text-gray-300">
                            {t('LANDING.TRY_APP.BUCKET_LABEL')}
                        </label>
                        <input
                            type="text"
                            id="bucket"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('LANDING.TRY_APP.BUCKET_PLACEHOLDER')}
                            value={state.localBucket}
                            onChange={(e) => dispatch({ type: 'SET_LOCAL_BUCKET', payload: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="defaultLanguage" className="block text-gray-700 dark:text-gray-300">
                            {t('LANDING.TRY_APP.DEFAULT_LANGUAGE_LABEL')}
                        </label>
                        <select
                            id="defaultLanguage"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            value={state.localDefaultLanguage}
                            onChange={(e) => dispatch({ type: 'SET_LOCAL_DEFAULT_LANGUAGE', payload: e.target.value })}
                        >
                            <option value="">{t('LANDING.TRY_APP.DEFAULT_LANGUAGE_OPTION_AUTO')}</option>
                            <option value="en">{t('LANDING.TRY_APP.DEFAULT_LANGUAGE_OPTION_EN')}</option>
                            <option value="hu">{t('LANDING.TRY_APP.DEFAULT_LANGUAGE_OPTION_HU')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            {t('LANDING.TRY_APP.MAPPINGS_LABEL')}
                        </label>
                        <div className="space-y-2">
                            {state.mappingEntries.map((entry) => (
                                <div key={entry.id} className="flex items-center space-x-2 overflow-x-auto">
                                    <input
                                        type="text"
                                        className="flex-1 min-w-0 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        placeholder={t('LANDING.TRY_APP.MAPPINGS_KEY_PLACEHOLDER')}
                                        value={entry.key}
                                        onChange={(e) => dispatch({ type: 'UPDATE_MAPPING_KEY', payload: { id: entry.id, key: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 min-w-0 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        placeholder={t('LANDING.TRY_APP.MAPPINGS_VALUE_PLACEHOLDER')}
                                        value={entry.value}
                                        onChange={(e) => dispatch({ type: 'UPDATE_MAPPING_VALUE', payload: { id: entry.id, value: e.target.value } })}
                                    />
                                    <button
                                        onClick={() => dispatch({ type: 'REMOVE_MAPPING', payload: entry.id })}
                                        className="flex-shrink-0 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none dark:bg-red-500 dark:hover:bg-red-600"
                                        disabled={state.mappingEntries.length === 1}
                                    >
                                        -
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => dispatch({ type: 'ADD_MAPPING' })}
                                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none dark:bg-green-500 dark:hover:bg-green-600"
                            >
                                + {t('LANDING.TRY_APP.MAPPINGS_ADD')}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdateUrl}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {t('LANDING.TRY_APP.UPDATE_DATA')}
                        </button>
                        <button
                            onClick={handleCopyUrl}
                            className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none dark:bg-gray-500 dark:hover:bg-gray-600"
                        >
                            {state.copied ? t('LANDING.TRY_APP.COPIED') : t('LANDING.TRY_APP.COPY_URL')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
                <div className="mb-3">{t('LANDING.SHAREABLE_URL')}</div>
                <code
                    className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded break-words w-full leading-8 block"
                    style={{ wordBreak: 'break-word' }}
                >
                    {buildShareUrl(!state.showToken)}
                </code>
            </div>

        </div>
    );
}

export { LandingPage };

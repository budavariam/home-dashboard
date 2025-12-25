import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSensorParams } from './context/ParamContext';

function LandingPage() {
    const { t } = useTranslation();
    const { token, apiParams, mappings } = useSensorParams();
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);

    const [localToken, setLocalToken] = useState(token || '');
    const [localUser, setLocalUser] = useState(apiParams.user || '');
    const [localBucket, setLocalBucket] = useState(apiParams.bucket || '');
    const [localMappings, setLocalMappings] = useState(
        Object.entries(mappings).map(([key, value]) => `${key}:${value}`).join(';')
    );

    useEffect(() => {
        setLocalToken(token || '');
        setLocalUser(apiParams.user || '');
        setLocalBucket(apiParams.bucket || '');
        setLocalMappings(
            Object.entries(mappings).map(([key, value]) => `${key}:${value}`).join(';')
        );
    }, [token, apiParams, mappings]);

    const buildShareUrl = (maskToken = false) => {
        const url = new URL(window.location.href);
        url.search = '';
        if (localToken) url.searchParams.set('token', maskToken ? '********' : localToken);
        if (localUser) url.searchParams.set('user', localUser);
        if (localBucket) url.searchParams.set('bucket', localBucket);
        if (localMappings) url.searchParams.set('mappings', localMappings);
        return url.toString();
    };

    const handleUpdateUrl = () => {
        window.location.href = buildShareUrl();
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(buildShareUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                                type={showToken ? 'text' : 'password'}
                                id="token"
                                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder={t('LANDING.TRY_APP.TOKEN_PLACEHOLDER')}
                                value={localToken}
                                onChange={(e) => setLocalToken(e.target.value)}
                            />
                            <button
                                className="text-sm text-blue-600 dark:text-blue-400 underline"
                                onClick={() => setShowToken(!showToken)}
                            >
                                {showToken ? t('LANDING.TRY_APP.HIDE') : t('LANDING.TRY_APP.SHOW')}
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
                            value={localUser}
                            onChange={(e) => setLocalUser(e.target.value)}
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
                            value={localBucket}
                            onChange={(e) => setLocalBucket(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="mappings" className="block text-gray-700 dark:text-gray-300">
                            {t('LANDING.TRY_APP.MAPPINGS_LABEL')}
                        </label>
                        <input
                            type="text"
                            id="mappings"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('LANDING.TRY_APP.MAPPINGS_PLACEHOLDER')}
                            value={localMappings}
                            onChange={(e) => setLocalMappings(e.target.value)}
                        />
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
                            {copied ? t('LANDING.TRY_APP.COPIED') : t('LANDING.TRY_APP.COPY_URL')}
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
                    {buildShareUrl(!showToken)}
                </code>
            </div>

        </div>
    );
}

export { LandingPage };

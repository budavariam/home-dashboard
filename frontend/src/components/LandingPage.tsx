import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSensorParams } from './context/ParamContext';

function LandingPage() {
    const { token, apiParams, mappings } = useSensorParams();
    const [showToken, setShowToken] = useState(false);

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

    const handleUpdateUrl = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('token', localToken);
        url.searchParams.set('user', localUser);
        url.searchParams.set('bucket', localBucket);
        url.searchParams.set('mappings', localMappings);
        window.location.href = url.toString();
    };

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 bg-white dark:bg-gray-900">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">BLE Sensor Dashboard</h1>
            <div className="text-lg text-gray-700 dark:text-gray-300">
                I use this page to view historical and current readings from BLE sensors across my home.
                <br />I collect these data with an ESP32 device.
                <br />I use sensors like <em>Xiaomi Mi Temperature and Humidity Monitor 2</em>.
                <br />I store the date into <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://docs.thinger.io/features/buckets" target='_blank'>Thinger.io data buckets</a>.
            </div>
            <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                If you don't own a data bucket, you can try out this app with the{' '}
                <NavLink to="mock" className="underline text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    mock
                </NavLink>{' '}
                menu <br />and see how it would look without needing a{' '}
                <a
                    className="underline text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    href="https://thinger.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Thinger.io
                </a>{' '}
                account.
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6 max-w-md w-full">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Try the App With Your Data</h2>
                <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    You can try out the app by entering the following parameters:
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="token" className="block text-gray-700 dark:text-gray-300">Token</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type={showToken ? 'text' : 'password'}
                                id="token"
                                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder="Enter your token"
                                value={localToken}
                                onChange={(e) => setLocalToken(e.target.value)}
                            />
                            <button
                                className="text-sm text-blue-600 dark:text-blue-400 underline"
                                onClick={() => setShowToken(!showToken)}
                            >
                                {showToken ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="user" className="block text-gray-700 dark:text-gray-300">User</label>
                        <input
                            type="text"
                            id="user"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder="Enter your user"
                            value={localUser}
                            onChange={(e) => setLocalUser(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="bucket" className="block text-gray-700 dark:text-gray-300">Bucket</label>
                        <input
                            type="text"
                            id="bucket"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder="Enter your bucket"
                            value={localBucket}
                            onChange={(e) => setLocalBucket(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="mappings" className="block text-gray-700 dark:text-gray-300">Mappings</label>
                        <input
                            type="text"
                            id="mappings"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder="Enter sensor mappings (e.g., Sensor_0:Room1;Sensor_1:Room2)"
                            value={localMappings}
                            onChange={(e) => setLocalMappings(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleUpdateUrl}
                        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Update Data
                    </button>
                </div>
            </div>

            <div className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
                <div className="mb-3">Example URL format:</div>
                <code
                    className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded break-words w-full leading-8"
                    style={{ wordBreak: 'break-word' }}
                >
                    ?token=YOUR_TOKEN&user=YOUR_USER&bucket=YOUR_BUCKET&mappings=Sensor_0:Room1;Sensor_1:Room2
                </code>
            </div>

        </div>
    );
}

export { LandingPage };

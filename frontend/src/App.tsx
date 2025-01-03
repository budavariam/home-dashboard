import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiParams, DEFAULT_VALUE, SensorReading } from './types';
import { Overview } from './components/Overview';
import { ExamplePage } from './components/ExamplePage';



const App = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [mappings, setMappings] = useState<Record<string, string>>(
    JSON.parse(localStorage.getItem('mappings') || '{}')
  );
  const [apiParams, setApiParams] = useState<ApiParams>({
    user: null,
    bucket: null,
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
    if (userParam && bucketParam) {
      setApiParams({ user: userParam, bucket: bucketParam });
    }
  }, []);

  const fetchData = async (): Promise<SensorReading[]> => {
    if (!apiParams.user || !apiParams.bucket || !token) {
      throw new Error('Missing API parameters or token.');
    }

    const url = `https://api.thinger.io/v1/users/${apiParams.user}/buckets/${apiParams.bucket}/data`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Get only the last value from the bucket, which contains the array of sensor readings
    if (response.data.length == 0) {
      throw new Error('Empty bucket.');
    }

    return response.data[0]?.val?.readings ?? DEFAULT_VALUE;
  };

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['fetchData', apiParams, token],
    queryFn: fetchData,
    enabled: !!token && !!apiParams.user && !!apiParams.bucket,
    refetchInterval: 60000, // Refetch every 1 minute
  });

  if (!token || !apiParams.user || !apiParams.bucket) {
    return <ExamplePage />
  }

  return <Overview isFetching={isFetching} data={data} mappings={mappings} refetch={refetch} />;
};

export default App;
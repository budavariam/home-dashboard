import { Overview } from '../components/Overview';
import { useSensorData } from '../hooks/useSensorData';
import { useSensorParams } from '../components/context/ParamContext';
import { QueryError } from '../components/QueryError';

export const DashboardPage = () => {
    const { mappings } = useSensorParams();
    const { data, refetch, isFetching, isError, error } = useSensorData();
    if (isError) {
        return <QueryError error={error} refetch={refetch} />
    }

    return <Overview
        isFetching={isFetching}
        data={data}
        mappings={mappings}
        refetch={refetch}
    />
};

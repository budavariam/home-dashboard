interface QueryErrorProps {
    error: Error,
    refetch: () => void
}

export const QueryError = ({ error, refetch }: QueryErrorProps) => {
    return (<div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error?.message ?? "Something went wrong while fetching the data."}</span>
            &nbsp;
            <button
                onClick={() => refetch()}
                className="mt-2 text-blue-600 hover:underline"
            >
                Try Again
            </button>
        </div>
    </div>);
}
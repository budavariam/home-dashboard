import { useTranslation } from 'react-i18next';

interface QueryErrorProps {
    error: Error,
    refetch: () => void
}

export const QueryError = ({ error, refetch }: QueryErrorProps) => {
    const { t } = useTranslation();

    return (<div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">{t('ERROR.TITLE')}</strong>
            <span className="block sm:inline">{error?.message ?? t('ERROR.FETCH_FAILED')}</span>
            &nbsp;
            <button
                onClick={() => refetch()}
                className="mt-2 text-blue-600 hover:underline"
            >
                {t('ERROR.TRY_AGAIN')}
            </button>
        </div>
    </div>);
}
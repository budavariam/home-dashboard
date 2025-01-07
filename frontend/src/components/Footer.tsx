export const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4 text-center">
            <div className="container mx-auto px-4">
                <p className="text-sm">
                    Developed by <span className="font-medium text-gray-800 dark:text-gray-200">Mátyás Budavári</span>
                </p>
                <p className="text-sm">
                    Source code available on{' '}
                    <a
                        href="https://github.com/budavariam/home-dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        GitHub
                    </a>
                </p>
                <p className="text-xs mt-2">
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

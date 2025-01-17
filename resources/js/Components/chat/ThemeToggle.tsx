import { RootState } from "@/store";
import { toggleTheme } from "@/store/themeSlice";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme.theme);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
        >
            {theme === 'light' ? (
                <>
                    <MoonIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                    {/* <span className="ml-2">Switch to Dark Mode</span> */}
                </>
            ) : (
                <>
                    <SunIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                    {/* <span className="ml-2 text-white">Switch to Light Mode</span> */}
                </>
            )}
        </button>
    );
};

export default ThemeToggle;

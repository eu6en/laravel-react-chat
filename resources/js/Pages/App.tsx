import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AppRouter from '../AppRouter';
import { UserProvider } from "@/Context/UserContext";
import ErrorBoundary from "@/ErrorBoundary";
import { Provider } from 'react-redux';
import { store } from '@/store';

const App = () => {
    return (
        <Provider store={store}>
            <ErrorBoundary>
                <AuthenticatedLayout>
                    <UserProvider>
                        <AppRouter />
                    </UserProvider>
                </AuthenticatedLayout>
            </ErrorBoundary>
        </Provider>
    );
};

export default App;

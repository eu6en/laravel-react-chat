import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AppRouter from '../AppRouter';
import { UserProvider } from "@/Context/UserContext";
import ErrorBoundary from "@/ErrorBoundary";

const App = () => {
    return (
        <ErrorBoundary>
            <AuthenticatedLayout>
                <UserProvider>
                    <AppRouter />
                </UserProvider>
            </AuthenticatedLayout>
        </ErrorBoundary>
    );
};

export default App;

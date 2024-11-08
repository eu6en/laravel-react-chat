import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Chats from './Pages/Chats';
import TestReactPage from './Pages/TestReactPage';

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Chats />} />
            <Route path="/chats" element={<Navigate to="/" replace />} />
            <Route path="/test-react-page" element={<TestReactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
);

export default AppRouter;

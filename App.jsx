import { ErrorBoundary } from 'react-error-boundary'
import Layout from './components/Layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PromptDetail from './pages/PromptDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import ForgetPassword from './pages/ForgetPassword';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="/test" element={<div>Test Route Works!</div>} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Protected routes met Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/prompts/:id" element={
            <ProtectedRoute>
              <PromptDetail />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* NotFound route moet als laatste komen */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
} 
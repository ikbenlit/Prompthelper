import { ErrorBoundary } from 'react-error-boundary'
import Layout from './components/Layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PromptDetail from './pages/PromptDetail';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

// Wrap je root component
<ErrorBoundary 
  FallbackComponent={ErrorFallback}
  onReset={() => window.location.reload()}
>
  <App />
</ErrorBoundary> 

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
} 
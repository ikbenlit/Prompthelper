import { ErrorBoundary } from 'react-error-boundary'

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

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        {/* Routes */}
      </Router>
    </ErrorBoundary>
  );
} 
// ResultsPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultsDashboard } from './ResultsDashboard';

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    navigate('/');
    return null;
  }

  return (
    <ResultsDashboard 
      results={results}
      onNewAnalysis={() => navigate('/')}
      onDownload={() => {/* download logic */}}
    />
  );
};
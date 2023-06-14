import './App.css'
import AggregatedParts from './components/aggregatedParts'
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate
} from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='aggregate-parts' Component={AggregatedParts} />
          <Route path='*' element={<Navigate to='aggregate-parts' replace />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

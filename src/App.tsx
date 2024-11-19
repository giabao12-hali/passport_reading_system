import { Routes, Route } from 'react-router-dom';
import Index from './components';
import TourPassportDashboard from './components/TourPassportDashboard';
function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/passport-read' element={<TourPassportDashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
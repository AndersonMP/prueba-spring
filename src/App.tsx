import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import SpecialtyPage from './pages/SpecialtyPage';
import ConsultationPage from './pages/ConsultationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/doctores" replace />} />
          <Route path="doctores" element={<DoctorPage />} />
          <Route path="pacientes" element={<PatientPage />} />
          <Route path="especialidades" element={<SpecialtyPage />} />
          <Route path="consultas" element={<ConsultationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

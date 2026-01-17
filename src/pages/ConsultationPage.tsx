import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Consulta, Doctor, Paciente } from '../types';

const ConsultationPage = () => {
    const [consultations, setConsultations] = useState<Consulta[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Paciente[]>([]);

    const [newConsultation, setNewConsultation] = useState({
        fecha: '',
        hora: '',
        diagnostico: '',
        idDoctor: '',
        idPaciente: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchConsultations();
        fetchDoctors();
        fetchPatients();
    }, []);

    const fetchConsultations = async () => {
        try {
            const response = await api.get('/consultas');
            setConsultations(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar consultas');
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctores');
            setDoctors(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get('/pacientes');
            setPatients(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewConsultation({
            ...newConsultation,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validar campos vacíos
        if (!newConsultation.fecha.trim()) {
            setError('Debe llenar el campo Fecha antes de guardar consulta');
            setLoading(false);
            return;
        }

        if (!newConsultation.hora.trim()) {
            setError('Debe llenar el campo Hora antes de guardar consulta');
            setLoading(false);
            return;
        }

        if (!newConsultation.diagnostico.trim()) {
            setError('Debe llenar el campo Diagnóstico antes de guardar consulta');
            setLoading(false);
            return;
        }

        if (!newConsultation.idDoctor) {
            setError('Debe seleccionar un Doctor antes de guardar consulta');
            setLoading(false);
            return;
        }

        if (!newConsultation.idPaciente) {
            setError('Debe seleccionar un Paciente antes de guardar consulta');
            setLoading(false);
            return;
        }

        // Validacion
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!soloLetras.test(newConsultation.diagnostico)) {
            setError('El campo Diagnóstico solo debe contener letras');
            setLoading(false);
            return;
        }

        const payload = {
            fecha: newConsultation.fecha,
            hora: newConsultation.hora + ':00', 
            diagnostico: newConsultation.diagnostico,
            doctor: {
                idDoctor: Number(newConsultation.idDoctor)
            },
            paciente: {
                idPaciente: Number(newConsultation.idPaciente)
            }
        };

        try {
            await api.post('/consultas/registrar', payload);
            setNewConsultation({ fecha: '', hora: '', diagnostico: '', idDoctor: '', idPaciente: '' });
            fetchConsultations();
        } catch (err) {
            console.error(err);
            setError('Error al crear consulta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Gestión de Consultas</h2>

            {/* Create Form */}
            <div className="form-container" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                <h3>Nueva Consulta</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Fecha:</label>
                            <input
                                type="date"
                                name="fecha"
                                value={newConsultation.fecha}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Hora:</label>
                            <input
                                type="time"
                                name="hora"
                                value={newConsultation.hora}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Diagnóstico:</label>
                            <input
                                type="text"
                                name="diagnostico"
                                value={newConsultation.diagnostico}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Doctor:</label>
                            <select
                                name="idDoctor"
                                value={newConsultation.idDoctor}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Seleccione Doctor --</option>
                                {doctors.map(doc => (
                                    <option key={doc.idDoctor} value={doc.idDoctor}>
                                        {doc.nombre} {doc.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Paciente:</label>
                            <select
                                name="idPaciente"
                                value={newConsultation.idPaciente}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Seleccione Paciente --</option>
                                {patients.map(pat => (
                                    <option key={pat.idPaciente} value={pat.idPaciente}>
                                        {pat.nombre} {pat.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Guardando...' : 'Guardar Consulta'}
                    </button>
                </form>
            </div>

            {/* Tabla */}
            <h3>Historial de Consultas</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Diagnóstico</th>
                        <th>Doctor</th>
                        <th>Paciente</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {consultations.length === 0 ? (
                        <tr>
                            <td colSpan={6}>No hay consultas registradas.</td>
                        </tr>
                    ) : (
                        consultations.map((cons) => (
                            <tr key={cons.idConsulta}>
                                <td>{cons.idConsulta}</td>
                                <td>{cons.fecha}</td>
                                <td>{cons.hora}</td>
                                <td>{cons.diagnostico}</td>
                                <td>{cons.doctor ? `${cons.doctor.nombre} ${cons.doctor.apellido}` : 'Unknown'}</td>
                                <td>{cons.paciente ? `${cons.paciente.nombre} ${cons.paciente.apellido}` : 'Unknown'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default ConsultationPage;
import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Paciente } from '../types';

const PatientPage = () => {
    const [patients, setPatients] = useState<Paciente[]>([]);
    const [newPatient, setNewPatient] = useState<Paciente>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [telefonoError, setTelefonoError] = useState('');

    const fetchPatients = async () => {
        try {
            const response = await api.get('/pacientes');
            setPatients(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar pacientes');
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Validación especial para el campo teléfono
        if (name === 'telefono') {
            // Solo permitir números
            const soloNumeros = value.replace(/[^0-9]/g, '');
            setNewPatient({
                ...newPatient,
                [name]: soloNumeros
            });
            
            // Validar longitud en tiempo real
            if (soloNumeros.length > 0 && (soloNumeros.length < 7 || soloNumeros.length > 15)) {
                setTelefonoError('El teléfono debe tener entre 7 y 15 dígitos');
            } else {
                setTelefonoError('');
            }
        } else {
            setNewPatient({
                ...newPatient,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTelefonoError('');
        
        // Validación del teléfono antes de enviar
        const telefonoLimpio = newPatient.telefono.replace(/[^0-9]/g, '');
        if (!telefonoLimpio || telefonoLimpio.length < 7 || telefonoLimpio.length > 15) {
            setTelefonoError('El teléfono debe tener entre 7 y 15 dígitos y solo contener números');
            setLoading(false);
            return;
        }
        
        try {
            // Asegurar que el teléfono solo tenga números
            const pacienteConTelefonoLimpio = {
                ...newPatient,
                telefono: telefonoLimpio
            };
            await api.post('/pacientes/registrar', pacienteConTelefonoLimpio);
            setNewPatient({ nombre: '', apellido: '', email: '', telefono: '' });
            setTelefonoError('');
            fetchPatients();
        } catch (err: any) {
            console.error(err);
            if (err.response?.data) {
                // Si hay errores de validación del backend, mostrarlos
                const backendErrors = err.response.data;
                if (backendErrors.telefono) {
                    setTelefonoError(backendErrors.telefono);
                } else {
                    setError(err.response.data.message || 'Error al crear paciente');
                }
            } else {
                setError('Error al crear paciente');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Gestión de Pacientes</h2>

            {/* Create Form */}
            <div className="form-container" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                <h3>Nuevo Paciente</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={newPatient.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido:</label>
                            <input
                                type="text"
                                name="apellido"
                                value={newPatient.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={newPatient.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono:</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={newPatient.telefono}
                                onChange={handleChange}
                                placeholder="Solo números (7-15 dígitos)"
                                required
                                pattern="[0-9]{7,15}"
                                maxLength={15}
                            />
                            {telefonoError && (
                                <span style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                                    {telefonoError}
                                </span>
                            )}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Guardando...' : 'Guardar Paciente'}
                    </button>
                </form>
            </div>

            {/* List Table */}
            <h3>Listado</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length === 0 ? (
                        <tr>
                            <td colSpan={5}>No hay pacientes registrados.</td>
                        </tr>
                    ) : (
                        patients.map((pat) => (
                            <tr key={pat.idPaciente}>
                                <td>{pat.idPaciente}</td>
                                <td>{pat.nombre}</td>
                                <td>{pat.apellido}</td>
                                <td>{pat.email}</td>
                                <td>{pat.telefono}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default PatientPage;

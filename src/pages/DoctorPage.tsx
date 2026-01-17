import { useEffect, useState } from 'react';
import api from '../services/api';
import type{ Doctor, Especialidad } from '../types';

const DoctorPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<Especialidad[]>([]);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        idEspecialidad: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctors();
        fetchSpecialties();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctores');
            setDoctors(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar doctores');
        }
    };

    const fetchSpecialties = async () => {
        try {
            const response = await api.get('/especialidades');
            setSpecialties(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.idEspecialidad) {
            setError('Debe seleccionar una especialidad');
            setLoading(false);
            return;
        }

        const payload = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            especialidad: {
                idEspecialidad: Number(formData.idEspecialidad)
            }
        };

        try {
            if (isEditing && currentDoctorId) {
                await api.put(`/doctores/actualizar/${currentDoctorId}`, payload);
            } else {
                await api.post('/doctores/registrar', payload);
            }
            resetForm();
            fetchDoctors();
        } catch (err) {
            console.error(err);
            setError('Error al guardar doctor');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (doctor: Doctor) => {
        setIsEditing(true);
        setCurrentDoctorId(doctor.idDoctor!);
        setFormData({
            nombre: doctor.nombre,
            apellido: doctor.apellido,
            idEspecialidad: doctor.especialidad?.idEspecialidad?.toString() || ''
        });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este doctor?')) return;
        try {
            await api.delete(`/doctores/eliminar/${id}`);
            fetchDoctors();
        } catch (err) {
            console.error(err);
            setError('Error al eliminar doctor');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentDoctorId(null);
        setFormData({ nombre: '', apellido: '', idEspecialidad: '' });
    };

    return (
        <div className="page-container">
            <h2>Gestión de Doctores</h2>

            {/* Form */}
            <div className="form-container" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                <h3>{isEditing ? 'Editar Doctor' : 'Nuevo Doctor'}</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Especialidad:</label>
                        <select
                            name="idEspecialidad"
                            value={formData.idEspecialidad}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Seleccione --</option>
                            {specialties.map(spec => (
                                <option key={spec.idEspecialidad} value={spec.idEspecialidad}>
                                    {spec.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="action-buttons">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar')}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <h3>Listado</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.length === 0 ? (
                        <tr>
                            <td colSpan={5}>No hay doctores registrados.</td>
                        </tr>
                    ) : (
                        doctors.map((doc) => (
                            <tr key={doc.idDoctor}>
                                <td>{doc.idDoctor}</td>
                                <td>{doc.nombre}</td>
                                <td>{doc.apellido}</td>
                                <td>{doc.especialidad ? doc.especialidad.nombre : 'Sin especialidad'}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-secondary" onClick={() => handleEdit(doc)}>Editar</button>
                                        <button className="btn-danger" onClick={() => handleDelete(doc.idDoctor!)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default DoctorPage;

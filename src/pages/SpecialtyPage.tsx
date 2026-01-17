import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Especialidad } from '../types';

const SpecialtyPage = () => {
    const [specialties, setSpecialties] = useState<Especialidad[]>([]);
    const [newSpecialty, setNewSpecialty] = useState<Especialidad>({
        nombre: '',
        descripcion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSpecialties = async () => {
        try {
            const response = await api.get('/especialidades');
            setSpecialties(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar especialidades');
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSpecialty({
            ...newSpecialty,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/especialidades/registrar', newSpecialty);
            setNewSpecialty({ nombre: '', descripcion: '' });
            fetchSpecialties(); // Refresh list
        } catch (err) {
            console.error(err);
            setError('Error al crear especialidad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Gestión de Especialidades</h2>

            {/* Create Form */}
            <div className="form-container" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                <h3>Nueva Especialidad</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={newSpecialty.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción:</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={newSpecialty.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Especialidad'}
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
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {specialties.length === 0 ? (
                        <tr>
                            <td colSpan={3}>No hay especialidades registradas.</td>
                        </tr>
                    ) : (
                        specialties.map((spec) => (
                            <tr key={spec.idEspecialidad}>
                                <td>{spec.idEspecialidad}</td>
                                <td>{spec.nombre}</td>
                                <td>{spec.descripcion}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default SpecialtyPage;

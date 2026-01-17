import { useState, type FormEvent } from 'react';
import useDoctors from '../hooks/useDoctor';
import useSpecialties from '../hooks/useSpecialties';
import useForm from '../hooks/useForm';
import { createDoctor, updateDoctor, deleteDoctor, } from '../utils/doctorUtils';

const DoctorPage = () => {
    const { doctors, fetchDoctors } = useDoctors();
    const { specialties } = useSpecialties();
    const { formData, fieldErrors, loading, error, handleChange, validate, resetForm, setError } = useForm({
        nombre: '',
        apellido: '',
        idEspecialidad: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (validate()) return;

        const payload = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            especialidad: { idEspecialidad: Number(formData.idEspecialidad) }
        };

        try {
            if (isEditing && currentDoctorId) {
                await updateDoctor(currentDoctorId, payload);
            } else {
                await createDoctor(payload);
            }
            resetForm({ nombre: '', apellido: '', idEspecialidad: '' });
            fetchDoctors();
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        }
    };

    const handleEdit = (doctor: any) => {
        setIsEditing(true);
        setCurrentDoctorId(doctor.idDoctor);
        resetForm({
            nombre: doctor.nombre || '',
            apellido: doctor.apellido || '',
            idEspecialidad: doctor.especialidad?.idEspecialidad?.toString() || ''
        });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este doctor?')) {
            try {
                await deleteDoctor(id);
                fetchDoctors();
            } catch (err) {
                setError('Error al eliminar doctor');
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentDoctorId(null);
        resetForm({
            nombre: '',
            apellido: '',
            idEspecialidad: ''
        });
    };
    return (
        <div className="page-container">
            <h2>Gestión de Doctores</h2>

            {/* Form */}
            <div className="form-container" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                <h3>{isEditing ? 'Editar Doctor' : 'Nuevo Doctor'}</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={fieldErrors.nombre ? 'input-error' : ''}
                        />
                        {fieldErrors.nombre && <div className="error-msg">El nombre es obligatorio</div>}
                    </div>
                    <div className="form-group">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className={fieldErrors.apellido ? 'input-error' : ''}
                        />
                        {fieldErrors.apellido && <div className="error-msg">El apellido es obligatorio</div>}
                    </div>
                    <div className="form-group">
                        <label>Especialidad:</label>
                        <select
                            name="idEspecialidad"
                            value={formData.idEspecialidad}
                            onChange={handleChange}
                            className={fieldErrors.idEspecialidad ? 'input-error' : ''}
                        >
                            <option value="">-- Seleccione --</option>
                            {specialties.map(spec => (
                                <option key={spec.idEspecialidad} value={spec.idEspecialidad}>
                                    {spec.nombre}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.idEspecialidad && <div className="error-msg">Seleccione una especialidad</div>}
                    </div>
                    <div className="action-buttons">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar')}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn-secondary" onClick={handleCancel}>
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

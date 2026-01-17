import api from '../services/api';

export const createDoctor = async (doctorData: any) => {
    try {
        await api.post('/doctores/registrar', doctorData);
    } catch (err) {
        console.error(err);
        throw new Error('Error al crear doctor');
    }
};

export const updateDoctor = async (id: number, doctorData: any) => {
    try {
        await api.put(`/doctores/actualizar/${id}`, doctorData);
    } catch (err) {
        console.error(err);
        throw new Error('Error al actualizar doctor');
    }
};

export const deleteDoctor = async (id: number) => {
    try {
        await api.delete(`/doctores/eliminar/${id}`);
    } catch (err) {
        console.error(err);
        throw new Error('Error al eliminar doctor');
    }
};

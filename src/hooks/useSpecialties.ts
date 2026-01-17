import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Especialidad } from '../types';

const useSpecialties = () => {
    const [specialties, setSpecialties] = useState<Especialidad[]>([]);
    const [error, setError] = useState<string>('');

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

    return { specialties, error };
};

export default useSpecialties;

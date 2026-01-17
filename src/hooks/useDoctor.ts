import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Doctor } from '../types';

const useDoctors = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string>('');
    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctores');
            setDoctors(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar doctores');
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return { doctors, error, fetchDoctors };
};

export default useDoctors;

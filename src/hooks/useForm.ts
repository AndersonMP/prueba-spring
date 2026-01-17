import { useState, type ChangeEvent } from 'react';

const useForm = (initialState: any) => {
    const [formData, setFormData] = useState(initialState);
    const [fieldErrors, setFieldErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: false
            });
        }
    };

    const validate = () => {
        const newErrors = {
            nombre: !formData.nombre?.trim(),
            apellido: !formData.apellido?.trim(),
            idEspecialidad: !formData.idEspecialidad
        };
        setFieldErrors(newErrors);
        return Object.values(newErrors).some((error) => error);
    };

    const resetForm = (initialState: any) => {
        setFormData(initialState);
        setFieldErrors({});
    };

    return {
        formData,
        fieldErrors,
        loading,
        error,
        handleChange,
        setLoading,
        setError,
        validate,
        resetForm
    };
};

export default useForm;

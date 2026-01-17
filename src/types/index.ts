export interface Especialidad {
    idEspecialidad?: number;
    nombre: string;
    descripcion: string;
}

export interface Doctor {
    idDoctor?: number;
    nombre: string;
    apellido: string;
    especialidad: Especialidad;
}

export interface Paciente {
    idPaciente?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
}

export interface Consulta {
    idConsulta?: number;
    fecha: string; // "YYYY-MM-DD"
    hora: string;  // "HH:mm:ss"
    diagnostico: string;
    doctor: Doctor;
    paciente: Paciente;
}

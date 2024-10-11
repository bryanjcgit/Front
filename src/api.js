const API_URL = import.meta.env.VITE_API_URL; 

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: username, contraseña: password })
    });
    return response.json();
};

export const createUser = async (nombre, contraseña, rol) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, contraseña, rol })
    });
    return response.json();
};

export const changePassword = async (nombre, newPassword) => {
    const response = await fetch(`${API_URL}/users/${nombre}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contraseña: newPassword })
    });
    return response.json();
};

export const getSignos = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/signos`, {
        headers: { 
            "Content-Type": "application/json",
            "x-token": token
        }
    });
    if (!response.ok) {
        throw new Error('Error al obtener los signos'); 
    }
    return response.json();
};


export const getSignoByName = async (signo) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/signos/${signo}`, {
        headers: { 
            "Content-Type": "application/json",
            "x-token": token
        }
    });
    if (!response.ok) {
        throw new Error('Error al obtener el signo');
    }
    return response.json();
};


export const updateSigno = async (signo, descripcion) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/signos/${signo}`, {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/json",
            "x-token": token
        },
        body: JSON.stringify({ descripcion })
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el signo');
    }
    return response.json();
};
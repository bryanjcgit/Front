import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CrearUsuario({ callback }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [role, setRole] = useState("user"); // Nuevo estado para el rol
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const goTo = useNavigate();

    // Función para validar el login
    const validateUser = (event) => {
        event.preventDefault();
        fetch(`https://back-delta-three.vercel.app/signos/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(responseData => {
                if (responseData.resultado === 'user') {
                    callback("user");
                    goTo("/userHome");
                } else if (responseData.resultado === 'admin') {
                    callback("admin");
                    goTo("/adminHome");
                }
            });
    };

    // Nueva función para crear un usuario o admin
    const handleCreateUserOrAdmin = (event) => {
        event.preventDefault();

        // Validación simple
        if (!username || !password) {
            alert('Por favor, ingrese un nombre de usuario y contraseña.');
            return;
        }

        fetch(`https://back-delta-three.vercel.app/signos/create-user-or-admin`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role }) // Incluimos el rol en el body
        })
            .then(res => res.json())
            .then(responseData => {
                alert(responseData.message);
                if (role === 'admin') {
                    goTo("/adminHome");
                } else if (role === 'user') {
                    goTo("/userHome");
                }
            })
            .catch(error => {
                console.log(error);
                alert('Error al crear el usuario o admin.');
            });
    };

    const openChangePasswordModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const changePassword = () => {
        if (!newUsername || !newPassword) {
            alert('Por favor, ingrese un nombre de usuario y una nueva contraseña.');
            return;
        }

        fetch(`https://back-delta-three.vercel.app/signos/recuperar`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: newUsername, newPassword })
        })
            .then(res => res.json())
            .then(responseData => {
                alert(responseData.message);
                if (responseData.userType === 'admin') {
                    goTo("/adminHome");
                } else if (responseData.userType === 'user') {
                    goTo("/userHome");
                }
                closeModal();
            })
            .catch(error => {
                console.error(error);
                alert('Error al cambiar la contraseña.');
            });
    };

    return (
        <>
            <form onSubmit={handleCreateUserOrAdmin}>
                <h1 id="txtBienvenida">Crea tu cuenta</h1>
                <h4 className="txt">Nombre de Usuario</h4>
                <input type="text" className="entry" onChange={(e) => setUsername(e.target.value)} /><br></br>
                <h4 className="txt">Contraseña</h4>
                <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br></br>
                
                {/* Selector para elegir el rol */}
                <h4 className="txt">Rol</h4>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                </select><br></br>

                <input type="submit" value="Crear Cuenta" id="btnEnviar" />
            </form>

            <div>
                <button onClick={openChangePasswordModal}>Cambiar Contraseña</button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Cambiar Contraseña</h2>
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        /><br></br>
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        /><br></br>
                        <button onClick={changePassword}>Guardar Nueva Contraseña</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CrearUsuario;

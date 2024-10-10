import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ callback }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");   
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [role, setRole] = useState("user"); // Nuevo estado para el rol
    const [showCreateUser, setShowCreateUser] = useState(false); // Estado para el formulario de creación de usuario

    const goTo = useNavigate();

    // Función para validar el login
    const validateUser = (event) => {
        event.preventDefault();
        fetch(`https://back-delta-three.vercel.app/v1/signos/login`, {
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
                } else {
                    alert('Usuario o contraseña incorrectos.');
                }
            })
            .catch(error => {
                console.error(error);
                alert('Error al validar el usuario.');
            });
    };

    // Nueva función para crear un usuario o admin
    const handleCreateUserOrAdmin = (event) => {
        event.preventDefault();

        // Validación simple
        if (!newUsername || !newPassword) {
            alert('Por favor, ingrese un nombre de usuario y contraseña.');
            return;
        }

        fetch(`https://back-delta-three.vercel.app/v1/signos/create-user-or-admin`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: newUsername, password: newPassword, role })
        })
            .then(res => res.json())
            .then(responseData => {
                alert(responseData.message);
                if (responseData.success) {
                    closeCreateUserForm(); // Cierra el formulario de crear usuario
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

    const openCreateUserForm = () => {
        setShowCreateUser(true);
    };

    const closeCreateUserForm = () => {
        setShowCreateUser(false);
        setNewUsername(""); // Limpiar el input
        setNewPassword(""); // Limpiar el input
    };

    return (
        <>
            <form onSubmit={validateUser}>
                <h1 id="txtBienvenida">Bienvenido a nuestro portal del Zodiaco</h1>
                <h4 className="txt">Nombre de Usuario</h4>
                <input type="text" className="entry" onChange={(e) => setUsername(e.target.value)} /><br />
                <h4 className="txt">Contraseña</h4>
                <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br />
                <input type="submit" value="Ingresar" id="btnEnviar" />
            </form>

            <div>
                <button onClick={openChangePasswordModal}>Cambiar Contraseña</button>
                <button onClick={openCreateUserForm}>Crear Usuario</button>
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
                        /><br />
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        /><br />
                        <button onClick={changePassword}>Guardar Nueva Contraseña</button>
                    </div>
                </div>
            )}

            {showCreateUser && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeCreateUserForm}>&times;</span>
                        <h2>Crea tu cuenta</h2>
                        <h4 className="txt">Nombre de Usuario</h4>
                        <input type="text" className="entry" onChange={(e) => setNewUsername(e.target.value)} /><br />
                        <h4 className="txt">Contraseña</h4>
                        <input type="password" className="entry" onChange={(e) => setNewPassword(e.target.value)} /><br />
                        
                        {/* Selector para elegir el rol */}
                        <h4 className="txt">Rol</h4>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select><br />
                        
                        <button onClick={handleCreateUserOrAdmin}>Crear Cuenta</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Form;

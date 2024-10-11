import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, createUser, changePassword } from '../api';

function Form({ callback }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [role, setRole] = useState("USER_ROLE");
    const [showCreateUser, setShowCreateUser] = useState(false);

    const goTo = useNavigate();

    const validateUser = async (event) => {
        event.preventDefault();
        const responseData = await login(username, password);

        if (responseData.token) {
            localStorage.setItem("token", responseData.token);

            const rol = responseData.usuario.rol;
            if (rol === 'USER_ROLE') {
                callback("user");
                goTo("/userHome");
            } else if (rol === 'ADMIN_ROLE') {
                callback("admin");
                goTo("/adminHome");
            }
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    };

    const handleCreateUserOrAdmin = async (event) => {
        event.preventDefault();

        if (!newUsername || !newPassword) {
            alert('Por favor, ingrese un nombre de usuario y contraseña.');
            return;
        }

        const responseData = await createUser(newUsername, newPassword, role);
        if (responseData.message) {
            alert(responseData.message);
            closeCreateUserForm();
        } else {           
            alert(`${responseData.msg}`);
        }
    };


    const openChangePasswordModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (!newUsername || !newPassword) {
            alert('Por favor, ingrese un nombre de usuario y una nueva contraseña.');
            return;
        }

        try {
            const responseData = await changePassword(newUsername, newPassword);

            if (responseData.msg) {
                alert(responseData.msg);
                closeModal(); 
            } else {
                alert('Error al cambiar la contraseña.');
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            alert('Error al cambiar la contraseña.');
        }
    };

    const openCreateUserForm = () => {
        setShowCreateUser(true);
    };

    const closeCreateUserForm = () => {
        setShowCreateUser(false);
        setNewUsername("");
        setNewPassword("");
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
                        <button onClick={handleChangePassword}>Guardar Nueva Contraseña</button>
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

                        <h4 className="txt">Rol</h4>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="USER_ROLE">Usuario</option>
                            <option value="ADMIN_ROLE">Administrador</option>
                        </select><br />

                        <button onClick={handleCreateUserOrAdmin}>Crear Cuenta</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Form;

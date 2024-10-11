import { Navigate, useNavigate } from "react-router-dom";
import './styles/AdminHome.css';
import { useState, useEffect } from "react";
import { getSignos, getSignoByName, updateSigno } from '../api'; 

function AdminHome({ user }) {
    if (user !== 'admin' || !user) {
        return <Navigate to="/" />;
    }

    const home = useNavigate();
    const [signos, setSignos] = useState([]);  
    const [textoEditar, setTextoEditar] = useState("");
    const [signoEditar, setSignoEditar] = useState("");

   
    useEffect(() => {
        const fetchSignos = async () => {
            try {
                const response = await getSignos();
                setSignos(response); 
            } catch (error) {
                console.error("Error al cargar los signos:", error);
                alert("Error al cargar los signos");
            }
        };
        fetchSignos();
    }, []);

   
    const handleSelect = async (event) => {
        const signo = event.target.value;
        if (signo !== "0") {
            setSignoEditar(signo);

            try {
                const responseData = await getSignoByName(signo);  
                setTextoEditar(responseData.descripcion || ""); 
            } catch (error) {
                console.error("Error al obtener el signo:", error);
                alert("Error al obtener el signo");
            }
        } else {
            setTextoEditar("");  
        }
    };

    
    const handleClick = async (e) => {
        e.preventDefault();
        if (signoEditar && textoEditar) {
            try {
                await updateSigno(signoEditar, textoEditar);  
                alert('Descripción actualizada con éxito');
            } catch (error) {
                console.error("Error al actualizar el signo:", error);
                alert("Error al actualizar el signo");
            }
        } else {
            alert('Por favor, selecciona un signo y edita la descripción antes de guardar.');
        }
    };

    const goHome = () => {
        home("/");
        localStorage.removeItem('token')
    };

    return (
        <div className="container">
            <h2 id="textoAdmin">Edita un Signo Zodiacal</h2>

          
            <select id="editSignos" onChange={handleSelect}>
                <option value="0">Selecciona un signo zodiacal</option>
                {signos && signos.length > 0 && signos.map((signo) => (
                    <option key={signo.nombre} value={signo.nombre}>
                        {signo.nombre}
                    </option>
                ))}
            </select>

         
            <textarea
                id="textoEditar"
                cols="50"
                rows="10"
                value={textoEditar} 
                onChange={(e) => setTextoEditar(e.target.value)} 
            />

          
            <button id="btnEditar" onClick={handleClick}>Guardar Modificación</button>

        
            <button id="btnHomeAdmin" onClick={goHome}>Home</button>
        </div>
    );
}

export default AdminHome;

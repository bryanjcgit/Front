import { Navigate, useNavigate } from "react-router-dom";
import './styles/UserHome.css';
import TextSigno from "./TextSigno.jsx";
import { useState, useEffect } from "react";
import { getSignoByName, getSignos } from "../api"; 

function UserHome({ user }) {
    if (user !== "user" || !user) {
        return <Navigate to="/" />;
    }

    const home = useNavigate();
    const [textoSigno, setTextoSigno] = useState('');
    const [signos, setSignos] = useState([]); 
    const [selectedType, setSelectedType] = useState('');

    
    useEffect(() => {
        const loadSignos = async () => {
            try {
                const responseData = await getSignos(); 
                setSignos(responseData);  
            } catch (error) {
                console.error('Error al cargar los signos:', error);
                alert('Error al cargar los signos');
            }
        };
        loadSignos();
    }, []);

    const goHome = () => {
        home("/");
        localStorage.removeItem('token')
    }

    const handleSelect = async (event) => {
        const signo = event.target.value;
        if (signo !== "0") {
            try {
                const responseData = await getSignoByName(signo); 
                setTextoSigno(responseData.descripcion || '');  
            } catch (error) {
                console.error('Error al cargar la descripción del signo:', error);
                alert('Error al cargar la descripción del signo');
            }
        } else {
            setTextoSigno('');
        }
    }

    const handleTypeSelect = (event) => {
        setSelectedType(event.target.value);
    }

    return (
        <div className="container">
            <div id="txtSeleccionPage"><h3>Selecciona tu signo zodiacal</h3></div>

            <select id="selectSignos" onChange={handleSelect}>
                <option value="0">Selecciona un signo zodiacal</option>
                {signos.map(signo => (
                    <option key={signo.nombre} value={signo.nombre}>
                        {signo.nombre}
                    </option>
                ))}
            </select>

          
            <TextSigno texto={textoSigno} />

          
            <div style={{ marginTop: 80 }}>
                <h3>Selecciona una opción</h3>
                <select id="selectType" onChange={handleTypeSelect}>
                    <option value="">Selecciona una opción</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Niño">Niño</option>
                </select>

                {selectedType && <p>Has seleccionado: {selectedType}</p>}
            </div>

         
            <button id="btnHome" onClick={goHome}>Home</button>
        </div>
    )
}

export default UserHome;

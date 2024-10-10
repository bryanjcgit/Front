import { Navigate, useNavigate } from "react-router-dom";
import './styles/UserHome.css';
import TextSigno from "./TextSigno.jsx";
import { useState } from "react";

function UserHome({ user }) {
    if (user !== "user" || !user) {
        return <Navigate to="/" />
    }
    const home = useNavigate();
    const [textoSigno, setTextoSigno] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const goHome = () => {
        home("/");
    }

    const handleSelect = async (event) => {
        const signo = event.target.value;
        if (signo !== "0") {
            fetch(`https://back-blond-nine.vercel.app/signos/${signo}`)
                .then(response => response.json())
                .then(responseData => {
                    setTextoSigno(responseData);
                })
                .catch(err => console.error('Error al cargar la descripción del signo:', err));
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
                <option value="0">Seleciona un signo zodiacal</option>
                <option value="Aries">Aries</option>
                <option value="Geminis">Géminis</option>
                <option value="Cancer">Cáncer</option>
                <option value="Leo">Leo</option>
                <option value="Virgo">Virgo</option>
                <option value="Libra">Libra</option>
                <option value="Escorpio">Escorpio</option>
                <option value="Sagitario">Sagitario</option>
                <option value="Capricornio">Capricornio</option>
                <option value="Acuario">Acuario</option>
                <option value="Piscis">Piscis</option>
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
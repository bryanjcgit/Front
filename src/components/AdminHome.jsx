import { Navigate, useNavigate } from "react-router-dom";
import './styles/AdminHome.css';
import { useState } from "react";

function AdminHome({ user }) {
    if (user !== 'admin' || !user) {
        return <Navigate to="/" />;
    }

    const home = useNavigate();
    const [textoEditar, setTextoEditar] = useState("");
    const [signoEditar, setSignoEditar] = useState("");

   
    const handleSelect = (event) => {
        const signo = event.target.value;
        if (signo !== "0") {
            setSignoEditar(signo);
          
            fetch(`https://back-blond-nine.vercel.app/signos/${signo}`)
                .then(response => response.json())
                .then(responseData => setTextoEditar(responseData))  
                .catch(error => console.error('Error al cargar el signo:', error));
        } else {
            setTextoEditar(""); 
        }
    }

    const goHome = () => {
        home("/");
    }

   
    const handleClick = (e) => {
        e.preventDefault();
        if (signoEditar && textoEditar) {
            fetch(`https://back-blond-nine.vercel.app/signos/${signoEditar}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "textoEditar": textoEditar })  
            })
            .then(() => alert('Descripción actualizada con éxito'))
            .catch(error => console.error('Error al actualizar la descripción:', error));
        } else {
            alert('Por favor, selecciona un signo y edita la descripción antes de guardar.');
        }
    }

    return (
        <div className="container">
            <h2 id="textoAdmin">Edita un Signo Zodiacal</h2>
            <select id="editSignos" onChange={handleSelect}> 
                <option value="0">Selecciona un signo zodiacal</option>
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

            <textarea
                id="textoEditar"
                cols="50"
                rows="10"
                value={textoEditar} 
                onChange={(e) => setTextoEditar(e.target.value)}  
            />

            <button id="btnEditar" onClick={handleClick}>Editar</button>
            <button id="btnHomeAdmin" onClick={goHome}>Home</button>
        </div>
    );
}

export default AdminHome;

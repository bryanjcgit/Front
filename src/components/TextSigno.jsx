import './styles/TextSigno.css';

function TextSigno({ texto }) {
    return (
        <textarea id="textoSigno" value={texto} readOnly={true} cols="50" rows="10" />
    );
}

export default TextSigno;
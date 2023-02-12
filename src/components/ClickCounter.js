import { html, useState } from "../assets/ucjs.js";
function ClickCounter() {
    const [count, setCount] = useState(0);
    const [msg, setMsg] = useState("");
    const handleChange = (event) => {
        setMsg(event.target.value);
    };
    return html/*html*/ `
        <div>
            <button onClick=${() => setCount(count + 1)}>Clicked ${count} times</button>
            <input type="text" value=${msg} onChange=${handleChange} />
            <input type="text" defaultValue=${msg} />
            <span>${msg}</span>
        </div>
    `;
}

export default ClickCounter;

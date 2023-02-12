import { html, useState } from "../assets/ucjs.js";
const InputClick = (props) => {
    // This is a functional component has one text input and a button next to it. When the button is clicked, the text input's value is sent to the parent component.
    const [msg, setMsg] = useState(props.value);
    const handleChange = (event) => {
        setMsg(event.target.value);
    };
    const onClick = () => {
        props.onClick(msg);
        if (props.clearOnSubmit) {
            setMsg("");
        }
    };
    return html/*html*/ `
        <div class="row">
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                <input type="text" value=${msg} onChange=${handleChange} />
            </div>
            <div class="col-md-2 col-lg-2 col-sm-2 col-xs-2">
                <button onClick=${onClick}>Add</button>
            </div>
        </div>
    `;
};

export default InputClick;

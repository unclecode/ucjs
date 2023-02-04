import { h, registerStyle } from "../assets/ucjs.js";
export default function TodoList({ state }) {
    let addTodo = () => {
        state.items.push(state.text);
        state.text = "";
    };
    let setText = (e) => {
        state.text = e.target.value;
    };

    let style = /*css*/ `
                    .container h1 {
                        font-size: 10rem;
                        font-weight: 900;
                        margin: 0;
                    }
                
                    .container p {
                        margin: 0;
                        text-align: center;
                        font-weight: 100;
                        font-size: 3rem;
                    }`;

    let render = () => {
        registerStyle("counter", style);

        return h/*html*/ `<div class="container">
                                <form onSubmit=${addTodo} action="javascript:">
                                    <label>
                                    <span>Add Todo</span>
                                    <input value=${state.text} onInput=${setText} />
                                    </label>
                                    <button type="submit">Add</button>
                                    <ul>
                                        ${state.items.map((todo) => h`<li>${todo}</li>`)}
                                    </ul>
                                </form>
                        </div>`;
    };

    return {
        render,
        style,
    };
}


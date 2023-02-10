import { h, h_preact, h_default, registerStyle } from "../assets/ucjs.js";
import GridLayout from "./GridLayout.js";
export default function TodoList({ state }) {
    let addTodo = () => {
        state.items.push(state.text);
        state.text = "";
    };
    let setText = (e) => {
        state.text = e.target.value;
    };

    let style = /*css*/ `
                    
    `;
    // style = "";

    let render = () => {
        registerStyle("todolist", style);

        return h/*html*/ `<div class="container">
                                <form onSubmit=${addTodo} action="javascript:">
                                    <div class="row">
                                        <div class="col-md-10">
                                                <input value=${state.text} onInput=${setText} />
                                        </div>
                                        <div class="col-md-2">
                                                <button type="submit">Add</button>
                                        </div>
                                    </div>
                                    <ul class="list-strip list-grid">
                                        ${state.items.map((item) => {
                                            return h/*html*/ `<li>${item}</li>`;
                                        })}
                                    </ul>
                                </form>
                        </div>`;
    };

    return {
        render,
        style,
    };
}

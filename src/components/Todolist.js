import { html, useState, useEffect } from "../assets/ucjs.js";
import InputClick from "./InputClick.js";
export default function TodoList() {
    const [state, setState, updateState] = useState({
        loading: true,
        items: ["Task 1", "Task 2"],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                // Make the API call
                const response = await fetch("http://127.0.0.1:5050/v1/examples/tasks");
                const json = await response.json();
                // Sleep 1 second
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Update the state with that data
                setState({ loading: false, items: json.items });
            } catch (e) {
                updateState({ loading: false });
            }
        }

        // Call the function
        fetchData();
    }, []);

    let addTodo = (task) => {
        updateState({
            items: state.items.concat(task),
        });
    };

    return html/*html*/ `<div class="container">
        ${state.loading && html/*html*/ `<div>Loading...</div>`}
        ${!state.loading &&
        html/*html*/ `<div>
            <${InputClick} onClick=${addTodo} clearOnSubmit="true" />
            <div id="tasks">
                <pre>${state.result}</pre>
            </div>
            <ul class="list-strip list-grid">
                ${state.items.map((item) => {
                    return html/*html*/ `<li>${item}</li>`;
                })}
            </ul>
        </div> `}
    </div>`;
}

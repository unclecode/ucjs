import { h, Observer } from "../assets/ucjs.js";
import TodoList from "./Todolist.js";

export default function App(state) {
    let todolist = new TodoList({ state });
    this.render = function () {
        return h`
            <header class="container">Header</header>
            <main class="container">
                ${todolist.render()}
            </main>
            <footer class="container">Footer</footer>`;
    };
}

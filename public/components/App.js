import { h, Observer } from "../assets/ucjs.js";
import TodoList from "./Todolist.js";
import Nav from "./Nav.js";

export default function App(state) {
    let todolist = new TodoList({ state });
    let navbar = new Nav({
        navClass : "pv2"
    });
    this.render = function () {
        return h`
        <main class="container">
            ${navbar.render()}
            ${todolist.render()}
        </main>
        <footer class="container">Footer</footer>
        `
    };
}

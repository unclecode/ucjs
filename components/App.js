import { h, Observer } from "../assets/ucjs.js";
import TodoList from "./Todolist.js";

export default function App(state) {
    let todolist = new TodoList({ state });
    this.render = function () {
        return h`
            <div>
                ${todolist.render()}
            </div>`;
    };
}

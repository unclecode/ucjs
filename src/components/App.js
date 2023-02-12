import { html, render, useState } from "../assets/ucjs.js";
import Nav from "./Nav.js";
import TodoList from "./TodoList.js";
export default function App(state, $el) {
    const app = html/*html*/ `
        <main class="container">
            <${Nav} navClass="pv2" />
            <${TodoList} />
        </main>
        <footer class="container">Footer</footer>
    `;
    render(app, $el);
}

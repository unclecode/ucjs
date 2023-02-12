import { html, render, useState } from "../assets/ucjs.js";

export default function Nav(props) {
    return html/*html*/ `<nav class="${props.navClass || ""}">
        <ul>
            <li><strong>Brand</strong></li>
        </ul>
        <ul>
            <li><a href="#">Link</a></li>
            <li><a href="#">Link</a></li>
            <li><a href="#" role="button">Button</a></li>
        </ul>
    </nav>`;
}

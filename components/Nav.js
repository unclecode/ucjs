import { h } from "../assets/ucjs.js";

export default function App(state) {
    this.render = function () {
        return h`<nav class="${state.navClass || ''}">
        <ul>
          <li><strong>Brand</strong></li>
        </ul>
        <ul>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#" role="button">Button</a></li>
        </ul>
      </nav>`;
    };
}

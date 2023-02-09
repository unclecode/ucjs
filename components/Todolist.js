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
    style = "";

    let GridLayout = function (rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid_cells = [];
        // Each row in rows indicates the width of each cell in that row. Use that to generate proper class for each ro following flexboxgrid.
        this.rows_classe = this.rows.map((row) => {
            let _classes = {
                "xs": `col-xs-${row['xs'] || 12}`,
                "sm": `col-sm-${row['sm'] || 12}`,
                "md": `col-md-${row['md'] || 12}`,
                "lg": `col-lg-${row['lg'] || 12}`,
            };
            // return the joined classes
            return Object.values(_classes).join(" ");
        });

        this.render = function (cells) {
            // cells is 2 dimensional array contains html elements for each cell. Use it to render the grid. Add appropriate classes to each cell. based on the column order.
            this.grid_cells = cells;
            let grid_html = ``;
            for (let i = 0; i < cells.length; i++) {
                let cols = cells[i];
                grid_html += `<div class="row">`;
                for (let j = 0; j < cols.length; j++) {
                    let cell = cols[j];
                    let cell_class = this.rows_classe[j];
                    grid_html += `<div class="${cell_class}">${cell}</div>`;
                }
                grid_html += `</div>`;
            }

            return h`${grid_html}`;
        };
    };

    let render = () => {
        registerStyle("todolist", style);

        let grid = new GridLayout([
            {"md": 2},
            {"md": 8},
            {"md": 2}
        ], []);
        let cells = [
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
        ];
        let grid_html = grid.render(cells);
        

        return h/*html*/ `<div class="">
                                ${grid_html}
                        </div>`;
        // return h/*html*/ `<div class="container">
        //                         <form onSubmit=${addTodo} action="javascript:">
        //                             <label>
        //                                 <span>Add Todo</span>
        //                                 <input value=${state.text} onInput=${setText} />
        //                             </label>
        //                             <button type="submit">Add</button>
        //                             <ul>
        //                                 ${state.items.map((todo) => h`<li>${todo}</li>`)}
        //                             </ul>
        //                         </form>
        //                 </div>`;
    };

    return {
        render,
        style,
    };
}

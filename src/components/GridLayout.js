import { h, h_preact, h_default, registerStyle } from "../assets/ucjs.js";
import {render as rn } from "https://unpkg.com/htm/preact/standalone.module.js";
export default function GridLayout(rows, cols = []) {
    this.rows = rows;
    // Check of first element of rows is integer. If yes, then the row should change to object with xs, sm, md, lg keys.
    if (typeof this.rows[0] === "number") {
        this.rows = this.rows.map((row) => {
            return {
                "xs": 12,
                "sm": 12,
                "md": row,
                "lg": row,
            };
        });
    }

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
        let grid_html = [];
        
        for (let i = 0; i < cells.length; i++) {
            let cols = cells[i];
            let row = `<div class="row">`;
            for (let j = 0; j < cols.length; j++) {
                let cell = cols[j];
                let cell_class = this.rows_classe[j];
                let wrapper = document.createElement("div");
                rn(cell, wrapper)
                row += `<div class="${cell_class}">${wrapper.innerHTML}</div>`
            }
            row += `</div>`;
            grid_html.push(row);
       }

        return h([grid_html.join("")]);
    };
};
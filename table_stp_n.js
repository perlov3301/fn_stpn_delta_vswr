class table_stp_n {
  /**
   * Renders one block of two rows (line 1 and line 2) per stage.
   * Input ids are <prefix><stage><line>, e.g. Rmin12 = stage 1, line 2,
   * the same scheme as Ids.ids_stp_n().
   * @param {string} id - tbody id
   * @param {number} stp_n - number of stages to render
   */
  static addRows(
    id="stpTableBody",
    stp_n,
    base_rmin="Rmin",
    base_rmax="Rmax",
    base_lmin="Lmin",
    base_lmax="Lmax"
  ) {
      const tbody= document.getElementById(id);
      const n= Number.isInteger(stp_n) && stp_n > 0 ? stp_n : 0;
      const cell= (prefix, stage, line)=>
        `<td><input type="number" onwheel="this.blur()"
          id="${prefix}${stage}${line}" step="any" required> </td>`;
      const line_cells= (stage, line)=>
        cell(base_rmin, stage, line) +
        cell(base_rmax, stage, line) +
        cell(base_lmin, stage, line) +
        cell(base_lmax, stage, line);

      let rowHTML= "";
      for (let stage=1; stage<=n; stage++) {
        rowHTML+= `
      <tr>
        <td rowspan="2">${stage}</td>
        <td>1</td>
        ${line_cells(stage, 1)}
      </tr>
      <tr>
        <td>2</td>
        ${line_cells(stage, 2)}
      </tr>`;
      }
      tbody.insertAdjacentHTML('beforeend', rowHTML);
      return { stages: n };
    }

}

export { table_stp_n };
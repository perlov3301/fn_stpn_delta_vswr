class table_stp_n {
    static addRows(
      id="stpTableBody",
      stp_n,
      base_rmin,
      base_rmax,
      base_lmin,
      base_lmax
    ) {
        const tbody= document.getElementById(id);
        let rowHTML= "";
        for (let i=1; i<=stp_n; i++) {
          rowHTML+=`
            <tr>
              <td rowspan="2">${i}</td>
          `;
          for (let j=1; j<=2; j++) {
            rowHTML+=`
              <td>${j}</td>
              <td><input type="number" onwheel="this.blur()"
                id="${base_rmin}${i}${j}" step="any" required> </td>
              <td><input type="number" onwheel="this.blur()"
                id="${base_rmax}${i}${j}" step="any" required> </td>
              <td><input type="number" onwheel="this.blur()"
                id="${base_lmin}${i}${j}" step="any" required> </td>
              <td><input type="number" onwheel="this.blur()"
                id="${base_lmax}${i}${j}" step="any" required> </td>
            </tr>
            `;
          }
        }
        // const rowHTML= `
        // <tr>
        //   <td rowspan="2">1</td>
        //   <td>1</td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Rmin11" step="any" required> </td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Rmax11" step="any" required> </td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Lmin11" step="any" required> </td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Lmax11" step="any" required> </td>
        // </tr>
        // <tr>
        //   <td>2</td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Rmin12" step="any" required> </td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Rmax12" step="any" required> </td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Lmin12" step="any" required> </td>
        //   <td><input type="number" onwheel="this.blur()"
        //     id="Lmax12" step="any" required> </td>
        // </tr>
        // <tr>
        //   <td rowspan="2">2</td>
        //   <td>1</td>
        //   <td><input type="number" id="Rmin21" step="any" required> </td>
        //   <td><input type="number" id="Rmax21" step="any" required> </td>
        //   <td><input type="number" id="Lmin21" step="any" required> </td>
        //   <td><input type="number" id="Lmax21" step="any" required> </td>
        // </tr>
        // <tr>
        //   <td>2</td>
        //   <td><input type="number" id="Rmin22" step="any" required> </td>
        //   <td><input type="number" id="Rmax22" step="any" required> </td>
        //   <td><input type="number" id="Lmin22" step="any" required> </td>
        //   <td><input type="number" id="Lmax22" step="any" required> </td>
        // </tr>
        // `;
        tbody.insertAdjacentHTML('beforeend', rowHTML);
          return { };
      }

}
    
  
  
  export { table_stp_n };
  
  
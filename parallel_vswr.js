import { timenow } from './timenow.js';
import { f1 } from './vswr1_db1.js'
import { table_f_n }   from './table_f_n.js';
import { format1 } from './format1.js';
import { table_stp_n } from './table_stp_n.js';
// import  { mutation } from './mutation1.js';
document.addEventListener("readystatechange", () => {
    console.log("document.readyState:", document.readyState);
    const explanationArea= document.getElementById("explanation");
    explanationArea.value = `Current readyState: ${document.readyState}\n`;
    explanationArea.value += `time: ${timenow()}\n`;
  
    const myForm = document.getElementById("vswrForm");
    window.addEventListener('keydown',function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
    const vf=1; // Eeff =1 
    
    let inputIds_f= [];
    let inputIds_ZL2_real= [];
    let inputIds_ZL2_imag= [];
    let ZL2_real_array= [];
    let ZL2_imag_array= [];
    let Zin_r_array= [];
    let Zin_x_array= [];
    let vswr_array= [];
    let db_array= [];
    let g_array= [];
    
    const form= document.getElementById("vswrForm");
    const generatorR= document.getElementById("generatorR");
    
    const tbody = document.getElementById("frequencyTableBody");
    const frequency_n_input= document.getElementById("frequency_n");
    frequency_n_input.addEventListener("input", ()=>{
      tbody.replaceChildren(""); 
    });
    
    let f_n=1; // number of f
    const button_f_n= document.getElementById("button_f_n_table");
    button_f_n.addEventListener("click", ()=>{
      tbody.replaceChildren(""); 
      f_n= parseInt(frequency_n_input.value,10);
      console.log("button_f was clicked; f_n=", f_n);
// ids frequency table base names
      const frequency= "frequency";
      const load_real= "load_real";
      const load_imag= "load_imag";
      const table_ids=table_f_n.addRows(
          "frequencyTableBody", 
          f_n, 
          frequency, 
          load_real, load_imag);
      inputIds_f= table_ids.id_array_f;
      inputIds_ZL2_real= table_ids.id_array_r;
      inputIds_ZL2_imag= table_ids.id_array_x;
    });//end of frequences table
    
    const stp_tbody= document.getElementById("stpTableBody");
    const stp_n_input= document.getElementById("stp_n_input");
    stp_n_input.addEventListener("input", ()=> {
      stp_tbody.replaceChildren("");
    });
    let stp_n=1;
// ids stp_table base names
    const Rmin= "Rmin";
    const Rmax= "Rmax";
    const Lmin= "Lmin";
    const Lmax= "Lmax";
    const button_stp_n= document.getElementById("table_stp");
    button_stp_n.addEventListener("click", ()=> {
      stp_tbody.replaceChildren("");
      stp_n= parseInt(stp_n_input.value, 10); 
      console.log("button_stp_n was clicked; stp_n=", stp_n); 
      table_stp_n.addRows(
        "stpTableBody",
        stp_n, 
        Rmin, Rmax,
        Lmin, Lmax
      );
    });

    const result_vswr= document.getElementById("result_vswr");
    const statusIndicator= document.getElementById("statusIndicator");

    statusIndicator.replaceChildren("ready");
    let currentState= "ready";
    
    function formatNumber(value) {
      return Number.isFinite(value) ? 
          +value.toFixed(3): "NaN";
    }
    // const n_l= 2;
    // let id_rmin=[];
    // let id_rmax=[];
    // let id_lmin=[];
    // let id_lmax=[];
    // let r_min= [];
    // let r_max= [];
    // let l_min= [];
    // let l_max= [];
    // // r_min = Array.from({ length: stp_n }, ()=> Array(n_l).fill(0)); 
    // // console.log("array r_min:", r_min);
    // for (let i= 0; i< stp_n; i++) { 
    //   id_rmin[i]= [];
    //   id_rmax[i]= [];
    //   id_lmin[i]= [];
    //   id_lmax[i]= [];
    //   r_min[i]= [];
    //   r_max[i]= [];
    //   l_min[i]= [];
    //   l_max[i]= [];
    //   for (let j=0; j< 2; j++) {
    //     id_rmin[i][j]="Rmin"+(i+1).toString()+(j+1).toString();
    //     id_rmax[i][j]="Rmax"+(i+1).toString()+(j+1).toString();
    //     id_lmin[i][j]="Lmin"+(i+1).toString()+(j+1).toString();
    //     id_lmax[i][j]="Lmax"+(i+1).toString()+(j+1).toString();
    //   }
    // }
    
    // console.log("id_rmin11",id_rmin[0][0]," id_lmin11=",id_lmin[0][0]);
    // console.log("id_rmin12",id_lmin[0][1]," id_lmin12=",id_lmin[0][1]);
   
    function updateResult() 
    {
      // console.log("id_rmin11",id_rmin[0][0]," id_lmin11=",id_lmin[0][0]);
      // console.log("id_rmin12",id_lmin[0][1]," id_lmin12=",id_lmin[0][1]);
      try 
      {
        const Z0=  parseFloat(generatorR.value);
        console.log("updateResult; Z0:", Z0, " f_n:", f_n);

        result_vswr.textContent= "";
        explanationArea.value= "";
        for (let i=0; i< f_n; i++) 
          {
            const frequencyInput= document.getElementById(inputIds_f[i]);
            const frequency= parseFloat(frequencyInput.value);
            const load_real= document.getElementById(inputIds_ZL2_real[i]);
            const ZL2_real= parseFloat(load_real.value);
            const load_imag= document.getElementById(inputIds_ZL2_imag[i]);
            const ZL2_imag= parseFloat(load_imag.value);
            
            console.log("updateResult; frequency:", frequency);
            console.log("updateResult; ZL2_real:", ZL2_real," ZL2_imag:", ZL2_imag);
    
            const vswrData= f1.vswr1_db1(
                Z0, 
                frequency, ZL2_real, ZL2_imag,
                // id_rmin, id_rmax, id_lmin, id_lmax,
                // Z01, Z02, length1, length2,
                vf ,
                stp_n
            );
            if (!vswrData || vswrData.vswr === Infinity || vswrData.vswr<1. || vswrData.db > 0) {
              throw new Error("updateResult;Invalid vswrData returned from vswr1_db1.");
            }
            vswr_array[i]=  format1.fvswr(vswrData.vswr);
            db_array[i]=    format1.fdb(vswrData.db);
            g_array[i]=     format1.fg(vswrData.gamma);
            Zin_r_array[i]= format1.fzin_r(vswrData.Zin_parallel.real);
            Zin_x_array[i]= format1.fzin_x(vswrData.Zin_parallel.imag);

            const spaces = " ".repeat(3);
            result_vswr.textContent+= 
            `f= ${frequency}MHz${spaces}vswr: ${vswr_array[i]}${spaces}`+ 
              ` db= ${db_array[i]}dB${spaces}(|Γ| = ${g_array[i]})\n`;
            console.log("updateResult; vswr:", vswr_array[i]," |Γ|:",g_array[i]," db:", db_array[i]);
            explanationArea.value+= `f= ${frequency}MHz${spaces}Zin_r=${Zin_r_array[i]}` +
              `${spaces}Zin_x=${Zin_x_array[i]} Ω\n`;
          } //end of for loop over f_n
        
      } //end of try
      catch (error) {
        result_vswr.textContent = "parallel_vswr;Error of calculations .";
        explanationArea.value = error.message;
      }
    } //end of updateResult
    
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateResult();
    });

});


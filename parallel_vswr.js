import { timenow } from './timenow.js';
import { f1 } from './vswr1_db1.js'
import { table_f_n }   from './table_f_n.js';
import { format1 } from './format1.js';
import { table_stp_n } from './table_stp_n.js';
import { RandomSearch } from './random_search.js';
import { Ids } from './ids_stp_n.js';
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
      const table_ids=table_f_n.addRows(
          "frequencyTableBody", 
          f_n, 
          "frequency", 
          "load_real", 
          "load_imag");
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
    const button_stp_n= document.getElementById("table_stp");
    button_stp_n.addEventListener("click", ()=> {
      stp_tbody.replaceChildren("");
      stp_n= parseInt(stp_n_input.value, 10); 
      console.log("button_stp_n was clicked; stp_n=", stp_n); 
      const table_stp_ids= table_stp_n.addRows(
        "stpTableBody",
        stp_n, 
        "Rmin",
        "Rmax",
        "Lmin",
        "Lmax"
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
    
    // random search: one set of lines for ALL frequencies, minimise worst VSWR
    const button_search= document.getElementById("button_search");
    const iterations_input= document.getElementById("search_iterations");
    function writeStageValues(stp_ids, stages) {
      stages.forEach((s, i)=> {
        for (let j=0; j<2; j++) {
          const z= j===0 ? s.Z01 : s.Z02;
          const l= j===0 ? s.length1 : s.length2;
          // collapse min=max=best so "calculate" reproduces the found network
          document.getElementById(stp_ids.id_rmin[i][j]).value= +z.toFixed(3);
          document.getElementById(stp_ids.id_rmax[i][j]).value= +z.toFixed(3);
          document.getElementById(stp_ids.id_lmin[i][j]).value= +l.toFixed(3);
          document.getElementById(stp_ids.id_lmax[i][j]).value= +l.toFixed(3);
        }
      });
    }
    button_search.addEventListener("click", ()=> {
      try {
        const Z0= parseFloat(generatorR.value);
        const iterations= parseInt(iterations_input.value, 10);
        if (!(iterations>=1)) throw new Error("enter iterations >= 1.");
        if (!inputIds_f.length) throw new Error("load the frequency table first.");
        const freqs= [];
        for (let i=0; i< f_n; i++) {
          freqs.push({
            f: parseFloat(document.getElementById(inputIds_f[i]).value),
            r: parseFloat(document.getElementById(inputIds_ZL2_real[i]).value),
            x: parseFloat(document.getElementById(inputIds_ZL2_imag[i]).value),
          });
        }
        if (freqs.some(p=> Number.isNaN(p.f)||Number.isNaN(p.r)||Number.isNaN(p.x))) {
          throw new Error("enter numeric frequency and load for every row.");
        }
        const stp_ids= Ids.ids_stp_n(stp_n);
        const ranges= RandomSearch.readRanges(stp_n, stp_ids);
        statusIndicator.replaceChildren("searching...");
        const best= RandomSearch.run({ Z0, freqs, ranges, iterations, vf });
        if (!best) throw new Error("no valid candidate found; widen the min/max ranges.");

        result_vswr.textContent= "";
        explanationArea.value= "";
        const sp= " ".repeat(3);
        best.perFreq.forEach((r, i)=> {
          result_vswr.textContent+=
            `f= ${freqs[i].f}MHz${sp}vswr: ${format1.fvswr(r.vswr)}${sp}`+
            ` db= ${format1.fdb(r.db)}dB${sp}(|Γ| = ${format1.fg(r.gamma)})\n`;
          explanationArea.value+= `f= ${freqs[i].f}MHz${sp}Zin_r=${format1.fzin_r(r.Zin.real)}`+
            `${sp}Zin_x=${format1.fzin_x(r.Zin.imag)} Ω\n`;
        });
        best.stages.forEach((s, i)=> {
          explanationArea.value+= `stage ${i+1}: Z01=${s.Z01.toFixed(2)}Ω l1=${s.length1.toFixed(2)}mm`+
            `${sp}Z02=${s.Z02.toFixed(2)}Ω l2=${s.length2.toFixed(2)}mm\n`;
        });
        explanationArea.value+= `worst vswr=${format1.fvswr(best.score)} `+
          `(found at iteration ${best.iteration} of ${iterations})\n`;
        writeStageValues(stp_ids, best.stages);
        statusIndicator.replaceChildren("search done");
      } catch (error) {
        statusIndicator.replaceChildren("ready");
        result_vswr.textContent= "parallel_vswr;random search error.";
        explanationArea.value= error.message;
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateResult();
    });

});
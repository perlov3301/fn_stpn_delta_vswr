class LineLR {
   getrandom(max) {
        return Math.random() * (max - 1) + 1;
   }
   static line1_lr (id_rmin, id_rmax, id_lmin, id_lmax,i) {
        const d_n=100;
        let d_1r=0;
        let d_2r=0;
        let d_1l=0;
        let d_2l=0;
        console.log("line_rl;id_r00 min:",id_rmin[i][0]," max:", id_rmax[i][0]);
        console.log("line_rl;id_l00 min:",id_lmin[i][0]," max:", id_lmax[i][0]);
        console.log("line_rl;id_r01 min:",id_rmin[i][1]," max:", id_rmax[i][1]);
        console.log("line_rl;id_l00 min:",id_lmin[i][1]," max:", id_lmax[i][1]);
        const line1_R= document.getElementById(id_rmin[i][0]);
        const line1_Rmax= document.getElementById(id_rmax[i][0]);
        const line1_L= document.getElementById(id_lmin[i][0]);
        const line1_Lmax= document.getElementById(id_lmax[i][0]);
        const line2_R= document.getElementById(id_rmin[i][1]);
        const line2_Rmax= document.getElementById(id_rmax[i][1]);
        const line2_L= document.getElementById(id_lmin[i][1]);
        const line2_Lmax= document.getElementById(id_lmax[i][1]);
        let Z01= parseFloat(line1_R.value);
        const Z01max=parseFloat(line1_Rmax.value);
        let Z02= parseFloat(line2_R.value);
        const Z02max= parseFloat(line2_Rmax.value);
        let length1= parseFloat(line1_L.value);
        const length1max= parseFloat(line1_Lmax.value);
        let length2= parseFloat(line2_L.value);
        const length2max= parseFloat(line2_Lmax.value);
        
        if (Number.isNaN(Z01) || Number.isNaN(Z02) ||
            Number.isNaN(length1) || Number.isNaN(length2) ) {
            throw new Error( "line_rljs;enter valid numeric values for all line inputs.");
       }
       d_1r= (Z01max-Z01)/d_n;
       d_1l= (length1max-length1)/d_n;
       d_2r= (Z02max-Z02)/d_n;
       d_2l= (length2max-length2)/d_n;
       Z01= (Math.random() * (d_n - 1) + 1)*d_1r+Z01;
       Z02= (Math.random() * (d_n - 1) + 1)*d_2r+Z02;
       length1= (Math.random() * (d_n - 1) + 1)*d_1l+length1;
       length2= (Math.random() * (d_n - 1) + 1)*d_2l+length2;
       console.log("line_rljs; Z01:", Z01, " length1:", length1);
       console.log("line_rljs; Z02:", Z02, " length2:", length2);
       return {
        Z01, Z02, length1, length2,
       };
   }
 }
 export { LineLR };
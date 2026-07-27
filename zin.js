import { inputZ } from './parallel_zin.js';

class zin_f1 {
/**
  *  @param {number} Z0
   * @param {number} frequency - Frequency (Hz)
 *   @param {number} ZL2_real - real part of Load impedance  of branch 2 (ohms)
   * @param {number} ZL2_imag - imag part of Load impedance  of branch 2 (ohms)
     @param {number} Z01 - Characteristic impedance of transmission line 1 (ohms)
   * @param {number} Z02 - Characteristic impedance of transmission line 2 (ohms)
   * @param {number} length1(m) - Length of branch 1 (short circuit branch) (meters)
   * @param {number} length2(m) - Length of branch 2 (complex load branch) (meters)
   * @param {number} vf =1
   * @returns {object} Zin_parallel, Zin1, Zin2 for one frequency point
 */
   static zin_parallel(
     Z0, 
      frequency, ZL2_real, ZL2_imag,
      Z01, Z02, length1, length2,
        vf = 1.0
   ) {
       if (Number.isNaN(Z0) || Number.isNaN(frequency) || 
            Number.isNaN(Z01) || Number.isNaN(Z02) || 
            Number.isNaN(length1) || Number.isNaN(length2) || 
            Number.isNaN(ZL2_real) || Number.isNaN(ZL2_imag) ) {
            throw new Error( "zinjs;enter valid numeric values for all inputs.");
       }
       const data = inputZ.parallelBranchesImpedance( // mm, MHz, load
          Z01,Z02, //ro of lines
          length1, length2, //mm length of lines
          ZL2_real, ZL2_imag, // Load for branch 2
          frequency, vf
        );
        
        return data;
   }
//    static data = inputZ.parallelBranchesImpedance( // mm, MHz, load
//           Z01,Z02, //ro of lines
//           length1, length2, //mm length of lines
//           ZL2_real, ZL2_imag, // Load for branch 2
//           frequency, vf
//         );
}
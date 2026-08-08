
document.addEventListener("readystatechange",()=> {
    console.log("document.readyState:", document.readyState);

    function fline(vctx,xb, yb, xe, ye){
        vctx.beginPath();
        vctx.moveTo(xb,yb);
        vctx.lineTo(xe, ye);
        vctx.strokeStyle='black';
        vctx.lineWidth= 3;
        vctx.stroke();
    }
    function z_vert(vctx,x_0, y_0) {
        vctx.beginPath();
        vctx.moveTo(x_0, y_0); // from top
        vctx.lineTo(x_0+9, y_0);
        vctx.lineTo(x_0+9, y_0+30);
        vctx.lineTo(x_0-9, y_0+30);
        vctx.lineTo(x_0-9, y_0);
        vctx.lineTo(x_0, y_0);
        vctx.closePath();
        vctx.strokeStyle= 'black';
        vctx.lineWidth= 3;
        vctx.stroke();
    }
    function base(x_0, y_0) {
        ctx1.beginPath();
        ctx1.moveTo(x_0+12, y_0);
        ctx1.lineTo(x_0-12, y_0);
        ctx1.strokeStyle='black';
        ctx1.lineWidth= 5;
        ctx1.stroke();
    }
    function rotatedText (vctx,text, x, y, degrees, vfont) {
        let vspace= " ".repeat(1);
        vctx.save(); // save current canvas state
        vctx.translate(x, y); // move origin to text placement point
        vctx.rotate((degrees*Math.PI)/180); //rotate canvas context
        // vctx.font= 'bold 12px sans-serif';
        vctx.font= 'bold ' +vspace + vfont +vspace+ ' sans-serif';
        vctx.textAlign= "center";
        vctx.textBaseline= "middle";
        vctx.fillText(text,0, 0);//draw at local origin
        vctx.restore();// restore original canvas
    }
    const canvas1= document.getElementById("structure1");
    const ctx1= canvas1.getContext("2d");
    function renderDraw1() {// clear and draw
        ctx1.clearRect(0,0, canvas1.widht, canvas1.height);
        ctx1.translate(0,-360);
    //  outlined line
        fline(ctx1, 60, 420, 710, 420);
        fline(ctx1, 60, 420, 60, 485);
        z_vert(ctx1, 60, 485);
        fline(ctx1, 60, 515, 60, 575);
        base(60, 575);
        fline(ctx1, 710, 420, 710, 450);
        z_vert(ctx1, 710, 450);
        fline(ctx1, 710, 480, 710, 515);
        z_vert(ctx1, 710, 516);
        fline(ctx1, 710, 545, 710, 575);
        base(710, 575);
        rotatedText(ctx1, "generator R", 
            40, // x local origin
            510, //y local origin
            -90,  // degrees
            "12px" // font
       );
        rotatedText(ctx1, "R_load", // text
            740, // x local origin
            464, //y local origin
            -90,  // degrees
            "12px" // font
        );
        rotatedText(ctx1, "j*X_load", // text
            740, // x local origin
            533, //y local origin
            -90,  // degrees
            "12px" // font
        );
    }
    renderDraw1();
});
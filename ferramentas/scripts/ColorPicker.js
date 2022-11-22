let colorP;

class ColorPicker{
    constructor(root){
        this.root = root;
        this.colorjoe = colorjoe.rgb(this.root.querySelector(".colorjoe"));
        this.selectedColor = null;
        this.savedColors = this.getSavedColors();

        this.colorjoe.show();
        this.setSelectedColor("#000000")

        this.colorjoe.on("change", color => {
            this.setSelectedColor(color.hex(), true);
        });

        this.root.querySelectorAll(".saved-color").forEach((el, i) => {
            this.showSavedColor(el, this.savedColors[i]);

            el.addEventListener("mouseup", e => {
                if (e.button == 2){
                    this.saveColor(this.selectedColor, i);
                    this.showSavedColor(el, this.selectedColor);
                }

                this.setSelectedColor(el.dataset.color);
            });
        });
    }

    setSelectedColor(color, skipCjUpdate = false){
        this.selectedColor = color;
        this.root.querySelector(".selected-color-text").textContent = color;
        this.root.querySelector(".selected-color").style.background = color;
        colorP = color;

        if(!skipCjUpdate){
            this.colorjoe.set(color);
        }
    }

    getSavedColors(){
        const saved = JSON.parse(localStorage.getItem("colorpicker-saved") || "[]")

        return new Array(5).fill("#fffff").map((defaultColor, i) => {
            return saved[i] || defaultColor;
        })
    }
    showSavedColor(element, color){
        element.style.background = color;
        element.dataset.color = color;
    }
    saveColor(color, i){
        this.savedColors[i] = color;
        localStorage.setItem("colorpicker-saved", JSON.stringify(this.savedColors));
    }
}

const cp = new ColorPicker(document.querySelector(".container-colowheel"));

document.addEventListener('DOMContentLoaded',()=>{

    const pincel ={
        ativo:false,
        movendo: false,
        pos: { x: 0, y: 0 },
        posAnterior: null
    }
    const tela = document.querySelector("#tela");
    const contexto = tela.getContext('2d');

    const altura = window.screen.height;
    const largura = window.screen.width;

    if(largura >= 1920 || altura >= 1080){
        tela.width = 600;
        tela.height = 600;
    }
    else if(largura >= 1366 || altura >= 768){
        tela.width = 600;
        tela.height = 600;
    }
    else{
        
    }
    // desfazer

    let restore_array = [];
    let index = -1;

    //opções
    
    contexto.lineCap = "round";
    contexto.lineWidth = 50;
    contexto.lineHeight = 50;
    contexto.strokeStyle = colorP;

    const butt = document.querySelector("#butt-button");
    butt.onclick = function(){
        contexto.lineCap = "butt";
    }

    const round = document.querySelector("#round-button");
    round.onclick = function(){
        contexto.lineCap = "round";
    }

    const square = document.querySelector("#square-button");
    square.onclick = function(){
        contexto.lineCap = "square";
    }

    const undo = document.querySelector("#undo-Button");
    undo.onclick = function(){
        if(index >= 1){
        index -=1;
        restore_array.pop();
        contexto.putImageData(restore_array[index], 0, 0);
        }
        else{
            contexto.clearRect(0, 0, tela.width, tela.height);
        }
    }

    const exps = document.querySelector("#customRange1").addEventListener
    ('change',function(){
        contexto.lineWidth = document.querySelector
        ("#customRange1").value;
    }, false);

    const clearButton = document.querySelector("#clear-button");
    clearButton.onclick = function(){
        contexto.clearRect(0, 0, tela.width, tela.height);
    };
    let dropdownMenuButton2 = document.querySelector("#dropdownbuttonimage2");

    let imagems = new Image();
    const putImg = document.querySelector("#put-clothes");
    putImg.onclick = function(){
        imagems.src="../imagens/blusa-1.png";
        contexto.drawImage(imagems, 120, 100, 350, 430);
    };

    const oColor = document.querySelector("#o-color");
    oColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor10.png")
        contexto.strokeStyle = "black";
        colorP = "black";
    };

    const hColor = document.querySelector("#th-color");
    hColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor2.png")
        contexto.strokeStyle = "red";
        colorP = "red";
    };

    const fColor = document.querySelector("#fo-color");
    fColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor3.png")
        contexto.strokeStyle = "orange";
        colorP = "orange";
    };

    const fiColor = document.querySelector("#fi-color");
    fiColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor4.png")
        contexto.strokeStyle = "yellow";
        colorP = "yellow";
    };

    const sColor = document.querySelector("#si-color");
    sColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor5.png")
        contexto.strokeStyle = "#89ff00";
        colorP = "#89ff00";
    };

    const seColor = document.querySelector("#se-color");
    seColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor6.png")
        contexto.strokeStyle = "green";
        colorP = "green";
    };

    const eColor = document.querySelector("#ei-color");
    eColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor7.png")
        contexto.strokeStyle = "#009cff";
        colorP = "#009cff"
    };

    const nColor = document.querySelector("#ni-color");
    nColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor8.png")
        contexto.strokeStyle = "blue";
        colorP = "blue";
    };

    const tenColor = document.querySelector("#te-color");
    tenColor.onclick = function(){
        dropdownMenuButton2.setAttribute("src", "../imagens/cor9.png")
        contexto.strokeStyle = "pink";
        colorP = "pink";
    };


     //opções f

    const desenharLinha = (linha)=> {

        contexto.beginPath();
        contexto.moveTo(linha.posAnterior.x, linha.posAnterior.y);
        contexto.lineTo(linha.pos.x, linha.pos.y);
        contexto.stroke();
    }

    tela.onmousedown = (evento)=>{pincel.ativo = true};
    tela.onmouseup = (evento)=>{pincel.ativo = false};
    tela.onmouseout = (evento)=>{pincel.ativo = false};
    tela.onmousemove = (evento)=>{
        pincel.pos.x = evento.clientX-(tela.offsetLeft + scrollX)
        pincel.pos.y = evento.clientY-(tela.offsetTop + scrollY)
        pincel.movendo = true;
    }

    document.getElementById("save-model").onclick = function(){
            var dataURL = document.getElementById("tela").toDataURL("image/png");
            let image = document.getElementById('canvasImg').src = dataURL
            let input64 = document.getElementById("input64").value = dataURL
            
    }
    

    /*document.getElementById("save-model").onclick = function onSave() {
        tela.toBlob((blob) => {
          const timestamp = Date.now().toString();
          const a = document.createElement('a');
          document.body.append(a);
          a.download = `export-${timestamp}.png`;
          a.href = URL.createObjectURL(blob);
          a.click();
          a.remove();
        });
      }
      */
    const ciclo = ()=>{
        if(pincel.ativo && pincel.movendo && pincel.posAnterior){
            if(contexto.strokeStyle != colorP)
            contexto.strokeStyle = colorP;
            desenharLinha({pos:pincel.pos, posAnterior: pincel.posAnterior})
            pincel.movendo = false;
            restore_array.push(contexto.getImageData(0, 0, tela.width, tela.height));
            index += 1;
            //console.log(restore_array)
        }
        pincel.posAnterior = {x:pincel.pos.x, y:pincel.pos.y}

        requestAnimationFrame(ciclo, 1);
    }
    ciclo()
  })
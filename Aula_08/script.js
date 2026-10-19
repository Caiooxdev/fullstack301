let idades = [18,19];
console.log(idades);

idades.push(20);
console.log(idades);

idades.pop();
console.log(idades);


 //let retangulo = {
  //x:10,
  //y:10,
  //l:50,
  //a:50,
  //cor1: "blue",
  //cor2: "red"
  
class rect{
    constructor(x, y, l, a, cor1, cor2){
       this.x = x;
       this.y = y;
       this.l = l;
       this.a = a;
       this.cor1 = cor1;
       this.cor2 = cor2;
    }

    desenha(){
    ctx.beginPath();
    ctx.lineWidth = 2; 
    ctx.fillStyle = this.cor1;
    ctx.strokeRect(this.x, this.y, this.l, this.a);
    ctx.strokeRect (this.x, this.y, this.l, this.a);
    ctx.fillRect(this.x, this.y, this.l, this.a);
    ctx.closePath(); 
    }   
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let r1 = new rect(10, 10, 50, 50, "blue", "red");
let r2 = new rect(350, 10, 50, 50, "green", "blue");
let r3 = new rect(10, 350, 50, 50, "yellow", "purple");


r1.desenha();
r2.desenha();
r3.desenha();
 let aux = 1;   
function animação(){
   // apaga canvas
   ctx.clearRect(0, 0, 400, 400);
   // move objetos
   if (r1.x == 350) {
     aux = -1;
   }
   if (r1.x == 0) {
     aux = 1;
   }

    r1.x += aux;
   // desenha objetos
   r1.desenha();

   requestAnimationFrame(animação);


}

animação();
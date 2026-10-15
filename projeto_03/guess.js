
let numeroSecreto = Math.floor(Math.random() * 100);

function adivinhar() {
    let numero = document.getElementById("numero").value;
    let resultado = document.getElementById("resultado");

    if (numero === "") {
        resultado.innerHTML = "Digite um número!";
        return;
    }

    numero = Number(numero);

    if (numero < 0 || numero > 99) {
        resultado.innerHTML = "Digite um número entre 0 e 99!";
        return;
    }

    if (numero < numeroSecreto) {
        resultado.innerHTML = "O número secreto é MAIOR!";
        resultado.style.setProperty("background-color", "red");
    } else if (numero > numeroSecreto) {
        resultado.innerHTML = "O número secreto é MENOR!";
        resultado.style.setProperty("background-color", "red");
    } else {
        resultado.innerHTML = "Parabéns! Você acertou!";
        resultado.style.setProperty("background-color", "lightgreen");
    }
}

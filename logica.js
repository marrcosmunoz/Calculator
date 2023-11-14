//Definir y obtiene las variables del documento HTML 
const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const voiceButton = document.getElementById("voiceButton");
const cientificaButton = document.getElementById("Cientifica");
const cero = document.getElementById("cero");

let currentInput = "";
let isCientifica = false;

//Funcion update display para definir el display
function updateDisplay() {
    display.value = currentInput;
}



//Funcion para detectar la entrada de voz
function handleVoiceInput(voiceInput) {
    console.log("Entrada de voz:", voiceInput);

    // Definir operaciones básicas y raíz
    const basicOperations = ["+", "-", "*", "/", "sqrt"];

    // Buscar operaciones básicas y raíz en la entrada de voz
    const operation = basicOperations.find(op => voiceInput.toLowerCase().includes(op));

    if (operation) {
        // Si se encuentra una operación básica o raíz, evaluar la expresión
        try {
            currentInput = eval(voiceInput).toString();
            updateDisplay();
        } catch (error) {
            console.log("Error:", error);
            currentInput = "Error al evaluar la expresión";
            updateDisplay();
        }
    } else {
        // Si no es una operación básica ni raíz, continuar como antes
        // Definir operaciones científicas
        const scientificFunctions = ["sin", "cos", "tan", "log"];

        // Buscar operaciones científicas en la entrada de voz
        const scientificOperation = scientificFunctions.find(func => voiceInput.toLowerCase().includes(func));

        if (scientificOperation) {
            // Si se encuentra una operación científica, extraer el número y evaluar la operación
            const numberPattern = /\d+(\.\d+)?/; // Expresión regular para extraer números
            const numberMatch = voiceInput.match(numberPattern);

            if (numberMatch) {
                const number = parseFloat(numberMatch[0]);
                switch (scientificOperation) {
                    case "sin":
                        currentInput = Math.sin(number).toString();
                        break;
                    case "cos":
                        currentInput = Math.cos(number).toString();
                        break;
                    case "tan":
                        currentInput = Math.tan(number).toString();
                        break;
                    case "log":
                        currentInput = Math.log10(number).toString();
                        break;
                    default:
                        break;
                }
                updateDisplay();
            } else {
                currentInput = "Error: Ingresa un número para la operación científica";
                updateDisplay();
            }
        } else {
            // Si no hay operación científica ni básica, agregar la entrada de voz a la expresión actual
            currentInput += voiceInput;
            updateDisplay();
        }
    }
}



//Funcion para empezar a grabar voz al hacer click en el boton
voiceButton.addEventListener("click", function () {
    if (annyang) {
        startSpeechRecognition();
    }
});

//Muestra en el input el resultado de la operacion por voz 
annyang.addCallback('result', function (phrases) {
    const voiceInput = phrases[0];
    handleVoiceInput(voiceInput);
});

//Segun el boton precionado de operacion, se activa un evento

buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
        const buttonValue = event.target.value;

        if (!isNaN(buttonValue) || buttonValue === ".") {
            currentInput += buttonValue;
            updateDisplay();
        } else if (buttonValue === "add") { //Operacion de suma
            currentInput += "+";
            updateDisplay();
        } else if (buttonValue === "subtract") { //Operacion de resta
            currentInput += "-";
            updateDisplay();
        } else if (buttonValue === "multiply") { //Operacion de multiplicacion
            currentInput += "*";
            updateDisplay();
        } else if (buttonValue === "divide") { //Operacion de division 
            currentInput += "/";
            updateDisplay();
        } else if (buttonValue === "sqrt") { // Operacion de Raiz
            // Mostrar la raíz en el input como los demás operadores
            currentInput += "sqrt(";
            updateDisplay(); // Actualiza el display con el resultado
        } else if (buttonValue === "pow") { //Operacion de potencia
            currentInput += "**";
            updateDisplay();
        } else if (buttonValue === "equals") { //Boton igual  
            try {
                // Evaluar la expresión en el display
                currentInput = eval(currentInput);
                updateDisplay(); 
            } catch (error) {
                console.log("Error:", error);
                currentInput = "Error al evaluar la expresión";
                updateDisplay();
            }
        } else if (buttonValue === "clear") {
            clearCalculator();
        } else if (isCientifica && (buttonValue === "sin" || buttonValue === "cos" || buttonValue === "tan" || buttonValue === "log")) {
            handleScientificOperation(buttonValue);
        }
    });
});

//Funcion para limpiar la calculadora
function clearCalculator() {
    currentInput = "";
    updateDisplay();
}

//Funcion para escuchar la voz
function startSpeechRecognition() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

    recognition.lang = "es-ES"; //Idioma de la voz
    recognition.interimResults = false;

    recognition.onresult = function (event) {
        const result = event.results[0][0].transcript;
        handleVoiceInput(result);
    };

    recognition.start();
}

//Operaciones cientificas
function handleScientificOperation(operation) {
    // Evaluar la operación científica y actualizar el display
    try {
        switch (operation) {
            case "sin":
                currentInput = Math.sin(parseFloat(currentInput)).toString();
                break;
            case "cos":
                currentInput = Math.cos(parseFloat(currentInput)).toString();
                break;
            case "tan":
                currentInput = Math.tan(parseFloat(currentInput)).toString();
                break;
            case "log":
                currentInput = Math.log10(parseFloat(currentInput)).toString();
                break;
            default:
                break;
        }
        updateDisplay();
    } catch (error) {
        console.log("Error al realizar la operación científica:", error);
        currentInput = "Error al evaluar la expresión";
        updateDisplay();
    }
}

//Crear las Operaciones cientificas 
function addScientificOperations() {
    const scientificButtons = [
        { id: "sin", text: "sin" },
        { id: "cos", text: "cos" },
        { id: "tan", text: "tan" },
        { id: "log", text: "log" },
        // Agrega más operaciones científicas aquí
    ];

    // Elimina botones numéricos existentes
    document.querySelectorAll(".number").forEach((button) => {
        button.style.display = "grid"; // Cambia "none" a "grid"
    });

    // Oculta botones científicos
    document.querySelectorAll(".scientific").forEach((button) => {
        button.style.display = "none";
    });

    // Agrega botones científicos
    const buttonsContainer = document.querySelector(".buttons");
    scientificButtons.forEach((sciButton) => {
        const button = document.createElement("button");
        button.id = sciButton.id;
        button.textContent = sciButton.text;
        button.className = "scientific";
        buttonsContainer.appendChild(button);
    });
}



//Funcion para cambiar entre las calculadora normal y cientifica 
cientificaButton.addEventListener("click", function () {
    isCientifica = !isCientifica;
    const scientificButtons = document.querySelectorAll(".calculator .buttons .scientific");
    const cuatro = document.getElementById("4");
    // Cambiar entre vistas
    if (isCientifica) {
        var style = document.createElement('style');
        style.innerHTML='#vacio{display:none;} #nueve{grid-row: 4;} #ocho{grid-row: 4;} #siete{grid-row: 4;} #seis{grid-row: 3;} #cinco{grid-row: 3;} #cuatro{grid-row: 3;} #cero{grid-row: 5; grid-column: span 4; width: 140px; margin-left: 17%; border-radius: 40px;}  .buttons{ display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(5, 1fr); gap: 5px; position: relative;margin-top: 20px; padding: 15px; top: 35%; left: 50%;transform: translate(-50%, -50%);}';
       document.head.appendChild(style);
        const display = document.getElementById("display");
        const calculator = document.querySelector(".calculator");
        calculator.style.width = "700px"; // Cambiar el ancho
        calculator.style.height = "450px";
        calculator.style.position ="relative"; // Cambiar la altura
        display.style.marginTop ="10px";
        display.style.marginLeft ="30px";
        display.style.width ="500px";
        cientificaButton.textContent = "Comun"; // Cambiar el texto del botón

        // Reemplazar operaciones básicas por operaciones científicas
        scientificButtons.forEach(button => {
            button.style.display = "block";
        });
        const buttonsContainer = document.querySelector(".calculator .buttons");
        buttonsContainer.classList.add("cientifica");
        // Agregar más operaciones científicas aquí

        // Puedes ajustar los estilos según sea necesario
    } else {
        // Cambiar a la vista común (revertir los cambios anteriores)
        var style = document.createElement('style');
        style.innerHTML=`body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }
        
        .calculator {
            background-color: lightgreen;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            padding: 20px;
            width: 310px;
            height: 550px;
            text-align: center;
            position: relative;
        }
        
        .display input {
            background-color: gray;
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 24px;
            grid-column: span 4;
            padding: 20px;
            margin-bottom: 40px;
            width: 250px;
            margin: 10px;
            margin-top: 30px;
            margin-bottom: 15px;
            position: relative;
        }
        
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(5, 1fr);
            gap: 25px;
            position: relative;
            margin-top: 60px;
            padding: 15px;
            top: 27%;
            left: 47%;
            transform: translate(-50%, -50%);
        }
        
        button {
            border: none;
            border-radius: 50%;
            font-size: 20px;
            padding: 15px;
            cursor: pointer;
        }
        
        .Cientifica {
            margin-top: 0px;
            position: absolute;
            display: grid;
            grid-column: 2;
            width: 80px;
            background-color: white;
            color: black;
            padding: 5px;
            font-size: 12px;
            border-radius: 10px;
        }
        .calculator .buttons .scientific {
            display: none; /* Oculta los botones científicos por defecto */
        }
        #voiceButton {
            display: grid;
            grid-column: 1;
            width: 80px;
            background-color: white;
            color: black;
            padding: 5px;
            font-size: 12px;
            border-radius: 10px;
            margin-left: 75%;
        }
        
        .operator {
            width: 55px;
            font-weight: bold;
            border-radius: 50%;
            font-size: 20px;
            padding: 15px;
        }
        
        #clear {
            background-color: white;
            color: black;
        }
        
        #sqrt {
            background-color: white;
            color: black;
        }
        
        #pow {
            background-color: white;
            color: black;
        }
        
        #divide {
            background-color: white;
            color: black;
        }
        
        .number {
            background-color: gray;
            color: white;
        }
        
        #add {
            background-color: white;
            color: black;
        }
        
        #subtract {
            background-color: white;
            color: black;
            font-size: 25px;
            font-weight: bold;
        }
        
        #multiply {
            background-color: white;
            color: black;
            font-weight: 900;
        }
        
        #cero {
            grid-row: 5;
            grid-column: 1 / span 2;
            width: 140px;
            border-radius: 40px;
        }
        
        #equals {
            background-color: white;
            color: black;
            font-weight: 900;
        }
        
        .calculator .buttons.scientifica {
            grid-template-columns: repeat(7, 1fr); /* 7 columnas para los botones científicos */
            gap: 10px; /* Espacio entre los botones */
            margin-top: 20px;
        }
        
        .calculator .buttons.scientifica .scientific {
            background-color: lightblue;
            color: black;
            width: 55px;
            font-weight: bold;
            border: none;
            border-radius: 50%;
            font-size: 14px; /* Ajusta el tamaño del texto según sea necesario */
            padding: 15px;
            cursor: pointer;
            margin-bottom: 10px; /* Espacio entre los botones científicos */
        }
        
        .calculator .buttons.scientifica .scientific {
            display: block; /* Asegura que los botones científicos se muestren en la vista científica */
        }
        
        button#sin {
            grid-row: 1;
            grid-column: 5;
        }
        button#cos {
            grid-column: 6;
            grid-row: 1;
        }
        button#tan {
            grid-column: 7;
            grid-row: 1;
        }
        button#log {
            grid-column: 8;
            grid-row: 1;
        }
        #vacio{
            display:block;
        }
        `
        ;
       document.head.appendChild(style);
        const calculator = document.querySelector(".calculator");
        calculator.style.width = "310px"; // Ancho original
        calculator.style.height = "550px"; // Altura original
        display.style.marginTop ="30px";
        display.style.marginLeft ="0px";
        display.style.width ="250px";
        cientificaButton.textContent = "Científica"; // Texto original del botón
        scientificButtons.forEach(button => {
            button.style.display = "none";
        });

        // Revertir otros cambios necesarios

        // Puedes ajustar los estilos nuevamente si es necesario
    }
});

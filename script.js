const buttons = document.querySelector(".button-wrapper");
let display = document.querySelector("#display");
let isOn;
let firstInput;
let secondInput;
let output;
let operator;
let operatorUsed;
let decimalUsed;
let isNegative;

// Listens for all button clicks and delegates events to appropriate functions
buttons.addEventListener('click', (e) => {
  let buttonClassList = e.target.classList;
  let buttonId = e.target.id;
  let buttonValue = e.target.value;
  if (buttonId === "onC") {
    onClear();
  } else if (isOn) {
    if (buttonClassList.contains("number")) {
      numberInput(buttonValue);
    } else if (buttonClassList.contains("operator")) {
      operatorInput(buttonValue);
    } else if (buttonClassList.contains("negative")) {
      negativeInput();
    } else if (buttonClassList.contains("decimal")) {
      decimalInput();
    }
  }
});

// Turns on calculator if off, otherwise clears all relevant variables and resets calculator
const onClear = () => {
  if (!isOn) {
    isOn = true;
  }
  firstInput = "0";
  secondInput = "";
  operator = "";
  operatorUsed = false;
  decimalUsed = false;
  isNegative = false;
  displayOutput(firstInput);
};

// Prints to calculator screen from parameter 'toDisplay'
const displayOutput = (toDisplay) => {
  display.innerHTML = toDisplay;
};

// Accepts all number button click events, uses value from button press in parameter,
// determines whether to put value in firstInput or secondInput based on whether an operator has
// been input yet, sends current value to display
const numberInput = (buttonPushed) => {
  if (!operatorUsed) {
    if (firstInput === "0" && buttonPushed !== ".") {
      firstInput = "";
    } else if (firstInput === "0" && buttonPushed === ".") {
      firstInput = "0";
    }
    //determine if calculation was just performed to prevent input from being concatenated to the output display
    //but allow a decimal to be concatenated onto a zero if decimal is pushed
    if (output && buttonPushed !== ".") {
      firstInput = "";
      output = "";
    } else if (output && buttonPushed === ".") {
      output = "";
    }
    if (firstInput.length < 8) {
      firstInput += buttonPushed;
    }
    displayOutput(firstInput);
  } else {
    if(secondInput === "" && buttonPushed === ".") {
      secondInput = "0";
    }
    if (secondInput.length < 8) {
      secondInput += buttonPushed;
    }
    displayOutput(secondInput);
  }
};

//Passes a decimal to numberInput to be inserted into an input number variable only
//if a decimal hasn't been used yet in the current input number
const decimalInput = () => {
  if (!decimalUsed) {
    decimalUsed = true;
    numberInput(".");
  }
};

//Accepts operator button pushes, accepts button value as parameter, if value is "="
//calls calculate funcion and passes input variables, determines if user is trying to do back-to-back
//calculations without pushing equals, passes calculation to allow secondInput to be available again
const operatorInput = (buttonPushed) => {
  if (buttonPushed === "=") {
    calculate(firstInput, secondInput, operator);
  } else {
    if (operatorUsed && secondInput) { //allows back-to-back calculations without pushing equals
      calculate(firstInput, secondInput, operator);
    }
    operator = buttonPushed;
    operatorUsed = true; // so next input number will  be assigned to secondInput variable
    decimalUsed = false; //allows decimal to be used on secondInput
    isNegative = false;
  }
};

//Allows use of negative numbers, checks status of isNegative, then checks which input variable is current
//Checks if the value of the input variable is 0 or null or already negative to prevent -0 and multiple negative operators
//assignes negative operator to the input variable, or removes the negative operator and reassigns isNegative
const negativeInput = () => {
  if(!isNegative) {
    if(!operatorUsed) {
      if(firstInput !== "0" && !firstInput.startsWith("-")) {
        firstInput = `-${firstInput}`;
        displayOutput(firstInput);
        isNegative = true;
      }
    } else {
      if(secondInput !== "0" && secondInput !== "" && !secondInput.startsWith("-")) {
        secondInput = `-${secondInput}`;
        displayOutput(secondInput);
        isNegative = true;
      }
    }
  } else {
    if(!operatorUsed) {
      if(firstInput !== "0" && firstInput.startsWith("-")) {
        firstInput = firstInput.replace("-", "");
        displayOutput(firstInput);
        isNegative = false;
      }
    } else {
      if(secondInput !== "0" && secondInput !== "") {
        secondInput = secondInput.replace("-", "");
        displayOutput(secondInput);
        isNegative = false;
      }
    }
  }
};

//Performs math calculations accepts parameters of firstInput, secondInput and operator
const calculate = (firstIn, secondIn, operate) => {
  //parse input variables to float
  let first = parseFloat(firstIn);
  let second = parseFloat(secondIn);
  //perform eval if second input is available
  if (secondIn) {
    output = eval(`${first} ${operate} ${second}`);
    //prevent divide by zero
    if(output !== Infinity){
      //check if character length exceeds screen size then round to certain precision
      let outString = output.toString();
      if (outString.length > 8 && !outString.startsWith("-") && outString.includes(".")) {
        output = output.toPrecision(5);
      } else if (outString.length > 8 && outString.startsWith("-") && outString.includes(".")) {
        output = output.toPrecision(5);
      } else if (outString.length > 8 && !outString.includes(".")) {
        output = output.toPrecision(5);
      }
      displayOutput(output);
      //determines if result is negative to set isNegative for use in subsequent calculation if the output is used again
      if(output < 0) {
        isNegative = true;
      } else {
        isNegative = false;
      }
      //turns output back into a string for string concatenation if the value is used in the next calcuation
      firstInput = output.toString();
    } else { //if divide by zero, gives error message and resets variabls
      displayOutput("ERROR");
      firstInput = "0";
      isFirstNegative = false;
      isNegative = false;
    }
  }
  //resets variables for next calcuation
  secondInput = "";
  operator = "";
  operatorUsed = false;
};

const V = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l","m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const BOP = ["&", "|", "!", "-", "<", ">"];
const BFC = ["&", "|", "-", "<", ">"];
const P = ["(", ")"];

// Defines order of operation of boolean operators            
function order(op1, op2){
    if (op1 === "!"){
        return 1;
    }
    else if (op1 === "&" && op2 !== "!"){
        return 1;
    }
    else if (op1 === "|" && op2 !== "!" && op2 !== "&"){
        return 1;
    }
    else if ((op1 === "<" || op1 === "-") && (op2 === "<" || op2 === "-")){
        return 1;
    }
    else{
        return 0;
    }
}

// Computes binary function
function compute(op1, op2, bop){
    switch(bop){
        case "|":
            return Math.max(op1, op2);
        case "&":
            return (op1 * op2);
        case "-":
            return (Number(op1 <= op2));
        case "<":
            return (Number(op1 === op2));
    }
}


// Check if string has balanced parentheses or includes undefined characters
function isBalanced(str){
    let stack = [];

    for (let i = 0; i < str.length; i++) {     
        if (str[i] === "(") {
            stack.push(str[i]);
        }
        else if (str[i] === ")") {
            if (stack.length === 0) return false;
            else stack.pop();
        }
        else if (!V.includes(str[i]) && !BOP.includes(str[i]) && !P.includes(str[i])) {
            return false;
        }
        else continue;
    }
    return (stack.length === 0);
}

// Crop string, if invalid then return empty string
function crop(str){
    str = str.replaceAll(" ", "");
    if(!isBalanced(str)) return "";

    return str;
}

// Checking if input string has valid syntax
function isValidSyntax(input){

    // Base case
    if (input === ""){
        return true;
    }

    else {
        let char = input[0];
        if (char === "!"){
            if ( input.length < 1 || input[1] === "&" || input[1] === "|" || input[1] === "-" || input[1] === "<" || input[1] === ">" || input[1] === ")"){
                return false;
            }

            let followedByVar = false;
            for (let i = 0; i < V.length; i++){
                if (input.slice(1).includes(V[i])){
                    followedByVar = true;
                    break
                }
            }
            if (!followedByVar) return false;
            
            return isValidSyntax(input.slice(1));
        }
        else if (char === "<"){
            if (input.length < 3 || (input[1] !== "-" && input[2] !== ">")) return false;

            return isValidSyntax(input.slice(1));
        }
        else if (char === "-"){
            if (input.length < 2 || input[1] !== ">") return false;

            return isValidSyntax(input.slice(1));
        }
        else if (BFC.includes(char)){
            if (input.length < 1 || BOP.includes(input[1]) || input[1] === ")") return false;

            return isValidSyntax(input.slice(1));
        }
        else if (V.includes(char)){
            if (input.length < 1 || V.includes(input[1]) || input[1] === "(" || input[1] === "!"){
                return false;
            }
            
            return isValidSyntax(input.slice(1));
        }
        else if (char === "("){
            if (input.length < 1 || input[1] === ")") return false;
           
            return isValidSyntax(input.slice(1));
        }
        else if (char === ")"){
            if (input.length > 1 && (input[1] === "!" || input[1] === ">" || V.includes(input[1]))){
                return false;
            }
    
            return isValidSyntax(input.slice(1));
        }
    }
}

// This parser is an implementation of the Shunting Yard Algorithm
function scanner(input) {

    let str = input;
    let output = [];
    let stack = [];
    let i = 0;

    if (str === "") return [];

    while(i < str.length){

        if ((str[i] === "-" && str[i-1] === "<") || (str[i] === ">")){
            i++;
            continue;
        }

        else if (V.includes(str[i])){
            output.push(str[i]);
        }

        else if (str[i] === "("){
            stack.push(str[i]);
        }

        else if (str[i] === ")"){
            while(stack[stack.length - 1] !== "("){
                if (stack.length === 0){
                    return [];
                }
                output.push(stack.pop());
            }
            if (stack[stack.length - 1] !== "("){
                return [];
            }
            stack.pop();
        }

        else {
            while(stack.length !== 0 && stack[stack.length - 1] !== "(" && order(stack[stack.length - 1], str[i]) === 1){
                output.push(stack.pop());
            }
            stack.push(str[i]);
        }

        i++;
    }

    let len = stack.length;
    while (len !== 0){
        if (stack[stack.length - 1] === "("){
            return [];
        }
        output.push(stack.pop());
        len = stack.length;
    }
    return output;
}


function eval(input) {
    // Checking if input is valid 
    let str = crop(input);
    if (str === "" || !isValidSyntax(str)) return [];

    let evalTree = scanner(str);

    // Getting number of variables
    let varCount = 0;
    let vars = [];
    for (let i = 0; i < evalTree.length; i++){
        if (V.includes(evalTree[i])) {
            varCount++;
            vars.push(evalTree[i]);
        }
    }

    // Creating array of all possible of truth assignments
    let truthAssignments = [];
    let assgn;

    for (let i = 0; i < 2 ** varCount; i++){
        // Convert to binary then append 0s at the start when necessary
        assgn = i.toString(2);
        assgn = new Array(varCount + 1 - assgn.length).join("0") + assgn;
        
        let val = [];
        for (let j = 0; j < assgn.length; j++){
            val.push(parseInt(assgn[j]));
        }

        truthAssignments.push(val);
    }
    
    // Creating full table with value of formula
    let result = [];
    let firstRow = [vars, input];
    result.push(firstRow);

    truthAssignments.forEach((assgn) => {
        let row = [assgn];
        
        // Evaluate expression
        let stack = [];
        for (let i = 0; i < evalTree.length; i++) {
            if (V.includes(evalTree[i])) {
                let index = vars.indexOf(evalTree[i]);
                stack.push(assgn[index]);
            }
            else if (evalTree[i] === "!") {
                let value = stack.pop();
                stack.push(1 - value);
            }
            else {
                let op2 = stack.pop();
                let op1 = stack.pop();
                stack.push(compute(op1, op2, evalTree[i]));
            }
        }

        row.push(stack.pop());
        result.push(row);
    });

    return result;
}

console.log(eval("(p | q) <-> r"));
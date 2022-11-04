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

function isBalanced(str){
    let stack = [];
    for(let i = 0; i < str.length; i++){
        
        let x = str[i];
        if (!V.includes(x) && !BOP.includes(x) && !P.includes(x)){
            return false;
        }
        if (x === "(") {
            stack.push(x);
            continue;
        }
        if (stack.length === 0) return false;
        stack.pop();
    }
    
    return (stack.length === 0);
}

function crop(str){
    if(!isBalanced(str)) return "";

    return str.replaceAll(" ", "");
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

    let str = isValidSyntax(input);
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

let tokens = isValidSyntax(crop("c | (q & r) -> f <-> (!g)"));

console.log(tokens);
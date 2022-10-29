const V = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l","m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const BOP = ["&", "|", "!", "-", "<", ">"];
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

function preprocess(input){
    str = input.replaceAll(" ", "");

    if (str.length === 0 || BOP.includes(str[0]) || BOP.includes(str[str.length - 1][0])) {
        return "";
    }

    for (let i = 0; i < str.length - 1; i++){
        if (!V.includes(str[i]) && !BOP.includes(str[i]) && !P.includes(str[i])){
            return "";
        }
        if ((str[i] === "-" && str[i+1] !== ">") || (str[i] === "<" && str[i+1] !== "-")){
            return "";
        }
        if (i !== str.length - 1  && V.includes(str[i]) && V.includes(str[i+1])){
            return "";
        }
    }
    return str;
}

// This parser is an implementation of the Shunting Yard Algorithm
function scanner(input) {

    let str = preprocess(input);
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

// "((p | q -> l) & r)"

let tokens = scanner(preprocess("p | (q -> r) -> t <-> f (r & s)"));
console.log(tokens);
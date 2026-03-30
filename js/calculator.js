
let operation=""

function add(v){
operation+=v
document.getElementById("operation").innerText=operation
}

function calculate(){
try{
let r=eval(operation)
document.getElementById("result").innerText=r
operation=r.toString()
}catch{
document.getElementById("result").innerText="Error"
}
}

function clearDisplay(){
operation=""
document.getElementById("operation").innerText="0"
document.getElementById("result").innerText="0"
}

function del(){
operation=operation.slice(0,-1)
document.getElementById("operation").innerText=operation
}

function sqrt(){
let v=parseFloat(operation)
let r=Math.sqrt(v)
document.getElementById("result").innerText=r
operation=r.toString()
}

function percent(){
let v=parseFloat(operation)
let r=v/100
document.getElementById("result").innerText=r
operation=r.toString()
}

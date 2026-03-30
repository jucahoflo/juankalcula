
function microToNano(v){

let uf=parseFloat(v)

let nf=uf*1000

let pf=nf*1000

return uf+" µF = "+nf+" nF = "+pf+" pF"

}

function nanoToMicro(v){

let nf=parseFloat(v)

let uf=nf/1000

return nf+" nF = "+uf+" µF"

}

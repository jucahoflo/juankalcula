
function decodeResistor(c){

if(/^\d{3}$/.test(c)){
let v=c.substring(0,2)*Math.pow(10,c[2])
return v+" Ω"
}

if(/^\d{4}$/.test(c)){
let v=c.substring(0,3)*Math.pow(10,c[3])
return v+" Ω"
}

c=c.toUpperCase()

if(c.includes("R")) return c.replace("R",".")+" Ω"
if(c.includes("K")) return c.replace("K",".")+" kΩ"
if(c.includes("M")) return c.replace("M",".")+" MΩ"

return "RES ERROR"

}

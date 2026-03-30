
function decodeAlphaCapacitor(c){

c=c.toLowerCase()

if(c.includes("p")) return c.replace("p",".")+" pF"

if(c.includes("n")) return c.replace("n",".")+" nF"

if(c.includes("u")) return c.replace("u",".")+" µF"

return "Código capacitor inválido"

}


function decodeAlphaResistor(c){

c=c.toUpperCase()

if(c.includes("R")) return c.replace("R",".")+" Ω"

if(c.includes("K")) return c.replace("K",".")+" kΩ"

if(c.includes("M")) return c.replace("M",".")+" MΩ"

return "Código resistencia inválido"

}

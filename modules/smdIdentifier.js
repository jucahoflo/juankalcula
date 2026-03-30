
function identify(c){

if(/[RKM]/i.test(c)) return "RES "+decodeResistor(c)

if(/^\d{3}[JKMZ]?$/.test(c)) return "CAP "+decodeCapacitor(c)

return "NO ID"

}

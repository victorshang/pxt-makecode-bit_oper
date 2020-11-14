basic.forever(function () {
    serial.writeString("A:")
    for (let index = 0; index <= 7; index++) {
        serial.writeNumber(bitoperation.getBit(midea_ir.getOpenCodeA(), 7 - index))
    }
    for (let index2 = 0; index2 <= 7; index2++) {
        serial.writeNumber(bitoperation.getBit(bitoperation.getInverse(midea_ir.getOpenCodeA()), 7 - index2))
    }
    serial.writeString("B:")
    for (let index3 = 0; index3 <= 7; index3++) {
        serial.writeNumber(bitoperation.getBit(midea_ir.getOpenCodeB(wind_code.自动风), 7 - index3))
    }
    for (let index4 = 0; index4 <= 7; index4++) {
        serial.writeNumber(bitoperation.getBit(bitoperation.getInverse(midea_ir.getOpenCodeB(wind_code.自动风)), 7 - index4))
    }
    serial.writeString("C:")
    for (let index5 = 0; index5 <= 7; index5++) {
        serial.writeNumber(bitoperation.getBit(midea_ir.getOpenCodeC(tmp_code.tmp_17, mode_code.自动模式), 7 - index5))
    }
    for (let index6 = 0; index6 <= 7; index6++) {
        serial.writeNumber(bitoperation.getBit(bitoperation.getInverse(midea_ir.getOpenCodeC(tmp_code.tmp_17, mode_code.自动模式)), 7 - index6))
    }
    basic.pause(2000)
    serial.writeLine("")
})

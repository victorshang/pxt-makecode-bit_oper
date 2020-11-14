basic.forever(function () {
    serial.writeString("A:")
    serial.writeString(midea_ir.getOpenCode(mode_code.Heat_mode, tmp_code.Tmp_25, wind_code.Mid_wind))
    basic.pause(2000)
    serial.writeLine("")
})

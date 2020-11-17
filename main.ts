input.onButtonPressed(Button.A, function () {
    meidea_ir.sendCode(meidea_ir.getOpenCode(mode_code.Auto, tmp_code.T17, wind_code.Auto))
})
input.onButtonPressed(Button.B, function () {
    meidea_ir.sendCode(meidea_ir.getCloseCode())
})
meidea_ir.initIR(AnalogPin.P2)
airmate_ir.initIR(AnalogPin.P0)
airmate_ir.sendCode(fan_code.Minus)

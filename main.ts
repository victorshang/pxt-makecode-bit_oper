input.onButtonPressed(Button.A, function () {
    midea_ir.sendCode(midea_ir.getOpenCode(mode_code.Cold, tmp_code.T23, wind_code.Low))
})
midea_ir.initIR(AnalogPin.P1)

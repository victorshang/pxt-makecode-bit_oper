input.onButtonPressed(Button.A, function () {
    midea_ir.sendCode(midea_ir.getCloseCode())
})
input.onButtonPressed(Button.B, function () {
    midea_ir.sendCode(midea_ir.getOpenCode(mode_code.Heat_mode, tmp_code.Tmp_27, wind_code.Low_wind))
})
midea_ir.setIrPin(DigitalPin.P2)

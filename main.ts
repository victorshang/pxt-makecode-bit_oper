input.onButtonPressed(Button.A, function () {
    midea_ir.sendCode(midea_ir.getTimeingCloseCode(
    hour_code.h_8,
    minute_code.m_30,
    mode_code.Heat,
    tmp_code.T25,
    wind_code.Mid
    ))
})
midea_ir.setIrPin(DigitalPin.P2)

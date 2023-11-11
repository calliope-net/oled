input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint.clearBuffer(206)
    OLEDpaint.writeSegment(0, 0, 109)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLED16x8.clearScreen(0, 7, 68)
})
let OLEDpaint: oledssd1315.oledpaint = null
let OLED16x8: oledssd1315.oledclass = null
basic.showIcon(IconNames.Surprised)
OLED16x8 = oledssd1315.beimStart(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3D))
OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3C))

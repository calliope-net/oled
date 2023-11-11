input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint.writeSegment(0, 0, 84)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLED16x8.writeText16x8(2, 3, 10, oledssd1315.oledssd1315_text("QWE"))
})
let OLED16x8: oledssd1315.oledclass = null
let OLEDpaint: oledssd1315.oledpaint = null
basic.showIcon(IconNames.Surprised)
OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3D))
OLED16x8 = OLEDpaint.return_oledclass()

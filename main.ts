input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint.clearBuffer(4)
    OLEDpaint.writeSegment(0, 0, 130)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLEDpaint.clearScreen(0, 7, 31)
})
let OLEDpaint: oledssd1315.oledpaint = null
basic.showIcon(IconNames.Meh)
OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3C))

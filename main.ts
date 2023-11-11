input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3C))
    OLEDpaint.clearBuffer(0)
    OLEDpaint.writeSegment(0, 0, 0)
})
let OLEDpaint: oledssd1315.oledpaint = null
basic.showIcon(IconNames.Meh)

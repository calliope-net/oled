input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint.writeSegment(1, 100, 255)
    OLEDpaint.writeSegment(5, 28, 101)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLEDpaint.writeText16x8(0, 0, 15, oledssd1315.oledssd1315_text("QWER"))
})
let OLEDpaint: oledssd1315.oledpaint = null
basic.showIcon(IconNames.Meh)
OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3C), false, false, false)
let OLED16x8 = OLEDpaint.return_oledclass()

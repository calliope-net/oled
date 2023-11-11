input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint.drawnum(0, 1)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    OLEDpaint.zeigeZahl(1234)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLEDpaint.writeImageOLED(oledssd1315.matrix8x8(`
        . . . . . . . .
        . . . . # # . .
        . . # . . . . .
        . . # . . . . .
        . . . # . . . .
        . . . . . . . .
        # # . . . . # .
        . . . . . . . #
        `), 0, 0)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
    OLEDpaint.writeSegment(0, 0, 84)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
    OLED16x8.writeText16x8(2, 3, 10, oledssd1315.oledssd1315_text("QWE"))
})
let OLED16x8: oledssd1315.oledclass = null
let OLEDpaint: oledssd1315.oledpaint = null
basic.showIcon(IconNames.Surprised)
OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3D))
OLED16x8 = OLEDpaint.return_oledclass()

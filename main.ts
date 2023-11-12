input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDtext.zeichenDrehen(oled.eZeichenDrehen.links)
    OLEDtext.writeText16x8(0, 0, 15, oled.oled_text("QWER"))
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    OLEDpaint.drawnum(7, 3)
    OLEDpaint.drawnum(3, 1)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLEDpaint.writeImageOLED(oled.matrix8x8(`
        # . . . . . . #
        . . . . . . . .
        . . # # # # . .
        . . # . . # . .
        . . # . . # . .
        . . # # # # . .
        . . . . . . . .
        # . . . . . . #
        `), 119, 55)
    OLEDpaint.sendBuffer()
})
let OLEDtext: oled.oledclass = null
let OLEDpaint: oled.oledpaint = null
OLEDpaint = oled.new_oledpaint(oled.oled_eADDR_OLED(oled.eADDR_OLED.OLED_16x8_x3C))
OLEDtext = OLEDpaint.return_oledclass()
OLEDtext.set_oledarrays_8x8(oled.new_oledarrays_8x8())
basic.showIcon(IconNames.House)

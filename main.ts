input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDtext.zeichenDrehen(oled.eZeichenDrehen.links)
    OLEDtext.writeText16x8(0, 0, 15, oled.oled_text("QWER"))
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    OLEDpaint.drawsegment(oled.eSegment.A, 32)
    OLEDpaint.drawsegment(oled.eSegment.B, 0)
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
let OLEDpaint2 = oled.new_oledpaint(oled.oled_eADDR_OLED(oled.eADDR_OLED.OLED_16x8_x3D))
let OLEDtext2 = OLEDpaint2.return_oledclass()
OLEDtext2.set_oledarrays_8x8(oled.new_oledarrays_8x8())

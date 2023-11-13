input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDtext.writeText16x8(5, 2, 15, oled.oled_text("ÄÖÜäöüß€°"))
    OLEDtext.writeText25x8(6, 2, 15, oled.oled_text("ABC abc"), oled.eAlign.rechts)
    OLEDtext.writeText25x8(7, 0, 24, oled.oled_text("Hallo" + "Welt" + String.fromCharCode(127) + String.fromCharCode(127) + String.fromCharCode(127) + "ÄÖÜoiuzt" + "09876543"))
})
let OLEDtext: oled.oledclass = null
OLEDtext = oled.new_oledclass(oled.oled_eADDR_OLED(oled.eADDR_OLED.OLED_16x8_x3C))
OLEDtext.set_oledarrays_8x8(oled.new_oledarrays_8x8())
OLEDtext.set_oledarrays_5x5(oled.new_oledarrays_5x5())
basic.showIcon(IconNames.House)

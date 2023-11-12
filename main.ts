input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDtext.zeichenDrehen(oled.eZeichenDrehen.links)
    OLEDtext.writeText16x8(0, 0, 15, oled.oled_text("QWER"))
})
let OLEDtext: oled.oledclass = null
OLEDtext = oled.new_oledclass(oled.oled_eADDR_OLED(oled.eADDR_OLED.OLED_16x8_x3C))
basic.showIcon(IconNames.House)

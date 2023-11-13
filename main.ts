input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDtext.writeText25x8(0, 0, 24, oled.oled_text("ABC abc"))
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
	
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
	
})
let OLEDtext: oled.oledclass = null
OLEDtext = oled.new_oledclass(oled.oled_eADDR_OLED(oled.eADDR_OLED.OLED_16x8_x3C))
OLEDtext.set_oledarrays_8x8(oled.new_oledarrays_8x8())
OLEDtext.set_oledarrays_5x5(oled.new_oledarrays_5x5())
basic.showIcon(IconNames.House)

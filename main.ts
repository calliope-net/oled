input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
	
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    OLED16x8.writeText16x8(0, 0, 15, oledssd1315.oledssd1315_text("QWER"))
})
let OLED16x8: oledssd1315.oledclass = null
basic.showIcon(IconNames.Meh)
OLED16x8 = oledssd1315.beimStart(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3C), false, false, false)

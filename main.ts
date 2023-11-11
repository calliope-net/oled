input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    OLEDpaint.drawnum(0, 1)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    OLEDpaint.zeigeZahl(1234)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
	
})
input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
    OLEDpaint.writeSegment(0, 0, 84)
    OLEDpaint.sendBuffer()
})
input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
	
})
let OLEDpaint: oledssd1315.oledpaint = null
basic.showIcon(IconNames.Surprised)
OLEDpaint = oledssd1315.new_oledpaint(oledssd1315.oledssd1315_eADDR(oledssd1315.eADDR.OLED_16x8_x3D))
let OLED16x8 = OLEDpaint.return_oledclass()

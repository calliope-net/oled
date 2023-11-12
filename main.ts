let OLEDpaint = oled.new_oledpaint(oled.oled_eADDR_OLED(oled.eADDR_OLED.OLED_16x8_x3C), false, false, true, oled.oled_eEEPROM_Startadresse(oled.eEEPROM_Startadresse.F800), oled.oled_eEEPROM_Startadresse(oled.eEEPROM_Startadresse.EC00), oled.oled_eADDR_EEPROM(oled.eADDR_EEPROM.EEPROM_x50))
let OLED16x8 = OLEDpaint.return_oledclass()
OLED16x8.set_oledarrays(oled.new_oledarrays())

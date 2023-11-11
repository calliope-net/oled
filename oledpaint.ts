
namespace oledssd1315
/*

*/ {

    //% group="OLED Display 0.96" subcategory=zeichnen
    //% block="i2c %pADDR || i2c-Check %ck EEPROM: Zeichensatz %pEEPROM_Startadresse i2c %pEEPROM_i2cADDR"
    //% pADDR.shadow="oledssd1315_eADDR"
    //% ck.shadow="toggleOnOff" ck.defl=1
    //% inlineInputMode=inline
    //% blockSetVariable=OLEDpaint
    export function new_oledpaint(pADDR: number, ck?: boolean): oledpaint {

        return new oledpaint(pADDR, (ck ? true : false))
        //    (pEEPROM_Startadresse == undefined ? eEEPROM_Startadresse.F800 : pEEPROM_Startadresse),
        //    (pEEPROM_i2cADDR == undefined ? eADDR_EEPROM.EEPROM_x50 : pEEPROM_i2cADDR))
        // optionaler Parameter kann undefined sein
    }

    // ========== class oledpaint

    export class oledpaint extends oledclass {
        private readonly qOffset = 5
        private readonly qScreen: Buffer[]

        constructor(pADDR: number, ck: boolean) {
            super(pADDR, false, false, ck, 0, 0)

            this.qScreen = [
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128)
            ]

            //this.i2cADDR_OLED = pADDR
            //this.i2cCheck = ck
            //this.qEEPROM_Startadresse = pEEPROM_Startadresse
            //this.i2cADDR_EEPROM = pEEPROM_i2cADDR
            //this.i2cError_OLED = 0 // Reset Fehlercode
            //this.i2cError_EEPROM = 0 // Reset Fehlercode
        }

    }

}
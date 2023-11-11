
namespace oledssd1315
/*

*/ {

    //% group="OLED Display 0.96" subcategory=zeichnen
    //% block="i2c %pADDR || invert %pInvert flip %pFlip i2c-Check %ck EEPROM: Zeichen 8x8 %pEEPROM_Startadresse Zeichen 5x5 %pEEPROM_Startadresse_5x5 i2c %pEEPROM_i2cADDR"
    //% pADDR.shadow="oledssd1315_eADDR"
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% ck.shadow="toggleOnOff" ck.defl=1
    //% pEEPROM_Startadresse.shadow="oledssd1315_eEEPROM_Startadresse"
    //% pEEPROM_Startadresse_5x5.shadow="oledssd1315_eEEPROM_Startadresse"
    //% pEEPROM_i2cADDR.shadow="oledssd1315_eADDR_EEPROM"
    //% inlineInputMode=inline
    //% blockSetVariable=OLEDpaint
    export function new_oledpaint(pADDR: number, pInvert?: boolean, pFlip?: boolean, ck?: boolean,
        pEEPROM_Startadresse?: number, pEEPROM_Startadresse_5x5?: number, pEEPROM_i2cADDR?: number): oledpaint {

        return new oledpaint(pADDR, (pInvert ? true : false), (pFlip ? true : false), (ck ? true : false),
            (pEEPROM_Startadresse == undefined ? eEEPROM_Startadresse.F800 : pEEPROM_Startadresse),
            (pEEPROM_Startadresse_5x5 == undefined ? eEEPROM_Startadresse.F400 : pEEPROM_Startadresse_5x5),
            (pEEPROM_i2cADDR == undefined ? eADDR_EEPROM.EEPROM_x50 : pEEPROM_i2cADDR))
        // optionaler Parameter kann undefined sein
    }

    // ========== class oledpaint extends oledclass

    export class oledpaint extends oledclass {
        private readonly qOffset = 5 // Anzahl der Bytes zur Cursor Positionierung vor den Daten
        private readonly qScreen: Buffer[] // Array von 8 Buffern je (qOffset + 128) Byte

        constructor(pADDR: number, pInvert: boolean, pFlip: boolean, ck: boolean,
            pEEPROM_Startadresse: number, pEEPROM_Startadresse_5x5: number, pEEPROM_i2cADDR: number) {

            super(pADDR, pInvert, pFlip, ck, pEEPROM_Startadresse, pEEPROM_i2cADDR)

            this.qScreen = [
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128)
            ]
        }
    }



}
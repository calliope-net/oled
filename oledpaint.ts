
namespace oledssd1315
/*
Weiterentwicklung der Idee von M.Klein:
    https://github.com/MKleinSB/pxt-OLEDpaint
    "pxt-oledpaint": "github:MKleinSB/pxt-OLEDpaint#v1.2.1",

neu programmiert von Lutz Elßner im November 2023
*/ {

    //% group="OLED Display 0.96 (32 KB RAM ab Calliope 2.x)" subcategory=zeichnen
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
        private readonly qBuffer: Buffer[] // Array von 8 Buffern je (qOffset + 128) Byte

        constructor(pADDR: number, pInvert: boolean, pFlip: boolean, ck: boolean,
            pEEPROM_Startadresse: number, pEEPROM_Startadresse_5x5: number, pEEPROM_i2cADDR: number) {

            super(pADDR, pInvert, pFlip, ck, pEEPROM_Startadresse, pEEPROM_i2cADDR)

            this.qBuffer = [
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128)
            ]
        }

        //% group="Buffer" subcategory=zeichnen
        //% block="löschen %OLEDpaint || mit Bitmuster 0↓255 %byte" weight=4
        //% byte.min=0 byte.max=255 byte.defl=0
        clearBuffer(byte?: number) {
            for (let i = 0; i < this.qBuffer.length; i++)
                this.qBuffer.get(i).fill(byte & 0xFF)
        }

        //% group="Buffer" subcategory=zeichnen
        //% block="zeichnen %OLEDpaint Zeile 0↓7 %page Segment 0→127 %seg Bitmuster 0↓255 %byte" weight=2
        //% byte.min=0 byte.max=255 byte.defl=0
        writeSegment(page: number, seg: number, byte: number) {
            if (this.between(page, 0, 7) && this.between(seg, 0, 127) && this.between(byte, 0, 255)) {
                this.qBuffer.get(page).setUint8(seg,byte)
            }
        }

    }

}
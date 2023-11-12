
namespace oled
/*
neu programmiert von Lutz Elßner im November 2023
*/ {

    export class oledeeprom {
        private readonly i2cADDR_EEPROM: number
        private readonly i2cCheck: boolean // i2c-Check
        private i2cError_EEPROM: number = 0

        public qEEPROM_Startadresse_8x8 = eEEPROM_Startadresse.F800
        public qEEPROM_Startadresse_5x5 = eEEPROM_Startadresse.EC00


        constructor(pADDR = eADDR_EEPROM.EEPROM_x50, ck: boolean = true) {
            this.i2cADDR_EEPROM = pADDR
            this.i2cError_EEPROM = 0 // Reset Fehlercode
        }

        getPixel_8x8(pCharCode: number): Buffer {
            let bu = Buffer.create(2)
            bu.setNumber(NumberFormat.UInt16BE, 0, this.qEEPROM_Startadresse_8x8 + pCharCode * 8)
            this.i2cWriteBuffer(bu, true)
            return this.i2cReadBuffer(8)
        }


        // ========== i2cWriteBuffer i2cReadBuffer

        i2cWriteBuffer(buf: Buffer, repeat: boolean = false) {
            if (this.i2cError_EEPROM == 0) { // vorher kein Fehler
                this.i2cError_EEPROM = pins.i2cWriteBuffer(this.i2cADDR_EEPROM, buf, repeat)
                if (this.i2cCheck && this.i2cError_EEPROM != 0)  // vorher kein Fehler, wenn (n_i2cCheck=true): beim 1. Fehler anzeigen
                    basic.showString(Buffer.fromArray([this.i2cADDR_EEPROM]).toHex()) // zeige fehlerhafte i2c-Adresse als HEX
            } else if (!this.i2cCheck)  // vorher Fehler, aber ignorieren (n_i2cCheck=false): i2c weiter versuchen
                this.i2cError_EEPROM = pins.i2cWriteBuffer(this.i2cADDR_EEPROM, buf, repeat)
        }

        i2cReadBuffer(size: number, repeat: boolean = false): Buffer {
            if (!this.i2cCheck || this.i2cError_EEPROM == 0)
                return pins.i2cReadBuffer(this.i2cADDR_EEPROM, size, repeat)
            else
                return Buffer.create(size)
        }



    } // class oledeeprom

    /* export function new_oledeeprom() {
        return new oledeeprom()
    } */

} // oledeeprom.ts

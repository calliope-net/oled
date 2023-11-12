
namespace oled
/*
Weiterentwicklung der Idee von M.Klein:
    https://github.com/MKleinSB/pxt-OLEDpaint
    "pxt-oledpaint": "github:MKleinSB/pxt-OLEDpaint#v1.2.1",

neu programmiert von Lutz Elßner im November 2023
*/ {

    //% group="OLED Display 0.96 (32 KB RAM ab Calliope 2.x)" subcategory=zeichnen
    //% block="i2c %pADDR || invert %pInvert flip %pFlip i2c-Check %ck EEPROM: Zeichen 8x8 %pEEPROM_Startadresse Zeichen 5x5 %pEEPROM_Startadresse_5x5 i2c %pEEPROM_i2cADDR"
    //% weight=4
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
        private readonly qOffset = 7 // 6 Bytes zur Cursor Positionierung vor den Daten + 1 Byte 0x40 Display Data
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

        //% group="OLED Display 0.96 (32 KB RAM ab Calliope 2.x)" subcategory=zeichnen
        //% block="OLED16x8 %OLEDpaint" weight=2
        //% blockSetVariable=OLED16x8 
        return_oledclass(): oledclass { return this }


        // ========== group="Buffer"

        //% group="Buffer" subcategory=zeichnen
        //% block="löschen %OLEDpaint || mit Bitmuster 0↓255 %byte" weight=6
        //% byte.min=0 byte.max=255 byte.defl=0
        clearBuffer(byte?: number) {
            for (let page = 0; page < this.qBuffer.length; page++)
                this.qBuffer.get(page).fill(byte)// & 0xFF, this.qOffset)
        }

        //% group="Buffer" subcategory=zeichnen
        //% block="zeichnen %OLEDpaint Zeile 0↓7 %page Segment 0→127 %seg Bitmuster 0↓255 %byte" weight=4
        //% page.min=0 page.max=7 page.defl=0
        //% seg.min=0 seg.max=127 seg.defl=0
        //% byte.min=0 byte.max=255 byte.defl=0
        writeSegment(page: number, seg: number, byte: number) {
            if (between(page, 0, 7) && between(seg, 0, 127) && between(byte, 0, 255)) {
                this.qBuffer.get(page).setUint8(this.qOffset + seg, byte)
            }
        }

        //% group="Buffer" subcategory=zeichnen
        //% block="lesen %OLEDpaint Zeile 0↓7 %page Segment 0→127 %seg " weight=2
        //% page.min=0 page.max=7 page.defl=0
        //% seg.min=0 seg.max=127 seg.defl=0
        readSegment(page: number, seg: number) {
            if (between(page, 0, 7) && between(seg, 0, 127))
                return this.qBuffer.get(page).getUint8(this.qOffset + seg)
            else
                return 0
        }

        //% group="Buffer" subcategory=zeichnen
        //% block="schreiben %OLEDpaint Pixel an x %x y %y" weight=1
        //% x.min=0, x.max=127
        //% y.min=0, y.max=63
        setPixelbuffer(x: number, y: number) {
            let page = y >> 3                                // 64/8 = 0..7
            let bu: Buffer = this.qBuffer.get(page)
            let shift_page = y % 8                           //calculate the page to write to
            //let ind = x + page * 128 + 1                     //calculate which register in the page to write to.
            let seg = this.qOffset + x
            let screenPixel = (bu[seg] | (1 << shift_page))  //set the screen data byte
            bu[seg] = screenPixel                            //store data in screen buffer
        }


        //% group="Image" subcategory=zeichnen
        //% block="schreiben %OLEDpaint Matrix %im x %xpos y %ypos" weight=8
        writeImageOLED(im: Image, xpos: number, ypos: number) {
            for (let y = 0; y <= im.height() - 1; y++) {
                for (let x = 0; x <= im.width() - 1; x++) {
                    if ((im.pixel(x, y) ? 1 : 0)) {
                        this.setPixelbuffer(x + xpos, y + ypos)
                    }
                }
            }
        }

        //% group="Image" subcategory=zeichnen
        //% block="zeichne %OLEDpaint Segment %seg an Position %pos" weight=7
        drawsegment(seg: string, pos: number) {
            switch (seg) {
                case "A": {
                    this.writeImageOLED(quer, pos + 4, 0)
                    break
                }
                case "F": {
                    this.writeImageOLED(hoch, pos, 4)
                    break
                }
                case "E": {
                    this.writeImageOLED(hoch, pos, 29)
                    break
                }
                case "G": {
                    this.writeImageOLED(quer, pos + 4, 25)
                    break
                }
                case "B": {
                    this.writeImageOLED(hoch, pos + 24, 4)
                    break
                }
                case "C": {
                    this.writeImageOLED(hoch, pos + 24, 29)
                    break
                }
                case "D": {
                    this.writeImageOLED(quer, pos + 4, 50)
                    break
                }
            }
        }


        //% group="Image" subcategory=zeichnen
        //% block="zeichne %OLEDpaint Ziffer %num an Position %pos" weight=6
        drawnum(num: number, pos: number) {
            switch (pos) {
                case 0: {
                    pos = 0
                    break
                }
                case 1: {
                    pos = 32
                    break
                }
                case 2: {
                    pos = 64
                    break
                }
                case 3: {
                    pos = 96
                    break
                }
            }
            switch (num) {
                case 0: {
                    this.drawsegment("A", pos)
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("D", pos)
                    this.drawsegment("E", pos)
                    this.drawsegment("F", pos)
                    break
                }
                case 1: {
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    break
                }
                case 2: {
                    this.drawsegment("A", pos)
                    this.drawsegment("B", pos)
                    this.drawsegment("G", pos)
                    this.drawsegment("E", pos)
                    this.drawsegment("D", pos)
                    break
                }
                case 3: {
                    this.drawsegment("A", pos)
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("D", pos)
                    this.drawsegment("G", pos)
                    break
                }
                case 4: {
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("F", pos)
                    this.drawsegment("G", pos)
                    break
                }
                case 5: {
                    this.drawsegment("A", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("D", pos)
                    this.drawsegment("F", pos)
                    this.drawsegment("G", pos)
                    break
                }
                case 6: {
                    this.drawsegment("A", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("D", pos)
                    this.drawsegment("E", pos)
                    this.drawsegment("F", pos)
                    this.drawsegment("G", pos)
                    break
                }
                case 7: {
                    this.drawsegment("A", pos)
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    break
                }
                case 8: {
                    this.drawsegment("A", pos)
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("D", pos)
                    this.drawsegment("E", pos)
                    this.drawsegment("F", pos)
                    this.drawsegment("G", pos)
                    break
                }
                case 9: {
                    this.drawsegment("A", pos)
                    this.drawsegment("B", pos)
                    this.drawsegment("C", pos)
                    this.drawsegment("D", pos)
                    this.drawsegment("F", pos)
                    this.drawsegment("G", pos)
                    break
                }
            }
        }

        //% group="Image" subcategory=zeichnen
        //% block="zeige %OLEDpaint 7-Segment Zahl %num" weight=5
        zeigeZahl(num: number) {
            let zahlAlsText = ""
            //screenBuf.fill(0)       //Puffer löschen
            //screenBuf[0] = 0x40
            //set_pos()               // auf Start setzen
            if (num < 10000 && num >= 0) {
                zahlAlsText = convertToText(num)
                for (let Index = 0; Index <= zahlAlsText.length - 1; Index++) {
                    this.drawnum(parseFloat(zahlAlsText.substr(Index, 1)), Index + 4 - zahlAlsText.length)
                }
            } else { //Errormessage
                this.drawsegment("A", 0)
                this.drawsegment("D", 0)
                this.drawsegment("E", 0)
                this.drawsegment("F", 0)
                this.drawsegment("G", 0)
                this.drawsegment("E", 32)
                this.drawsegment("G", 32)
                this.drawsegment("E", 64)
                this.drawsegment("G", 64)
            }
            this.sendBuffer() //Puffer anzeigen
        }


        // ========== group="Display"

        //% group="Display" subcategory=zeichnen
        //% block="super löschen %OLEDpaint || mit Bitmuster 0↓255 %byte" weight=6
        //% byte.min=0 byte.max=255 byte.defl=0
        clearScreen1(byte?: number) {
            super.clearScreen(0, 7, byte)
        }

        //% group="Display" subcategory=zeichnen
        //% block="Display %OLEDpaint Buffer anzeigen" weight=2
        sendBuffer() {
            let bu: Buffer, offset: number
            for (let page = 0; page < this.qBuffer.length; page++) {//this.qBuffer.length
                bu = this.qBuffer.get(page)
                // setCursorBuffer6 schreibt in den Buffer ab offset 6 Byte (CONTROL und Command für setCursor)
                offset = this.setCursorBuffer6(bu, 0, page, 0)
                bu.setUint8(offset, eCONTROL.x40_Data) // (offset=6) CONTROL Byte 0x40: Display Data
                this.i2cWriteBuffer_OLED(bu)
            }
        }

    }

}
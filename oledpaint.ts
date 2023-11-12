
namespace oled
/*
Weiterentwicklung der Erweiterung von M.Klein:
    https://github.com/MKleinSB/pxt-OLEDpaint
    "pxt-oledpaint": "github:MKleinSB/pxt-OLEDpaint#v1.2.1",

neu programmiert von Lutz Elßner im November 2023
*/ {

    // ========== class oledpaint extends oledclass

    export class oledpaint extends oledclass {
        private readonly qOffset = 7 // 6 Bytes zur Cursor Positionierung vor den Daten + 1 Byte 0x40 Display Data
        private readonly qBuffer: Buffer[] // Array von 8 Buffern je (qOffset + 128) Byte

        constructor(pADDR: number, pInvert: boolean, pFlip: boolean, ck: boolean) {

            //super(pADDR, pInvert, pFlip, ck, pEEPROM_Startadresse_8x8, pEEPROM_Startadresse_5x5, pEEPROM_i2cADDR)
            super(pADDR, pInvert, pFlip, ck)

            this.qBuffer = [
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128),
                Buffer.create(this.qOffset + 128), Buffer.create(this.qOffset + 128)
            ]
        }



        // ========== subcategory="beim Start" ==========

        //% group="Grafik und Text; mit EEPROM (beide Blöcke verwenden)" subcategory="beim Start"
        //% block="Text %OLEDpaint" weight=2
        //% blockSetVariable=OLEDtext 
        return_oledclass(): oledclass { return <oledclass>this }



        // ========== subcategory=zeichnen ==========

        // ========== group="direkt auf Display zeichnen" subcategory=zeichnen

        //% group="direkt auf Display zeichnen" subcategory=zeichnen
        //% block="Display %OLEDpaint löschen || von Zeile %vonZeile bis Zeile %bisZeile mit Bitmuster 0↓255 %byte" weight=9
        //% vonZeile.min=0 vonZeile.max=7 vonZeile.defl=0
        //% bisZeile.min=0 bisZeile.max=7 bisZeile.defl=7
        //% byte.min=0 byte.max=255 byte.defl=0
        clearDisplay(vonZeile?: number, bisZeile?: number, byte?: number) {
            super.clearScreen(vonZeile, bisZeile, byte)
        }


        //% group="direkt auf Display zeichnen" subcategory=zeichnen
        //% block="Display %OLEDpaint 7-Segment Zahl anzeigen %num" weight=6
        //% num.min=0 num.max=9999 
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
                this.drawsegment(eSegment.A, 0)
                this.drawsegment(eSegment.D, 0)
                this.drawsegment(eSegment.E, 0)
                this.drawsegment(eSegment.F, 0)
                this.drawsegment(eSegment.G, 0)
                this.drawsegment(eSegment.E, 32)
                this.drawsegment(eSegment.G, 32)
                this.drawsegment(eSegment.E, 64)
                this.drawsegment(eSegment.G, 64)
            }
            this.sendBuffer() // anzeigen
        }


        //% group="direkt auf Display zeichnen" subcategory=zeichnen
        //% block="Display %OLEDpaint Buffer anzeigen" weight=4
        sendBuffer() {
            let bu: Buffer, offset: number
            for (let page = 0; page < this.qBuffer.length; page++) {//this.qBuffer.length
                bu = this.qBuffer.get(page)
                // setCursorBuffer6 schreibt in den Buffer ab offset 6 Byte (CONTROL und Command für setCursor)
                offset = this.setCursorBuffer6(bu, 0, page, 0)
                bu.setUint8(offset, eCONTROL.x40_Data) // (offset=6) CONTROL Byte 0x40: Display Data
                this.i2cWriteBuffer(bu)
            }
        }



        // ========== group="in den Buffer zeichnen (dann 'Buffer anzeigen' verwenden)" subcategory=zeichnen


        //% group="in den Buffer zeichnen (dann 'Buffer anzeigen' verwenden)" subcategory=zeichnen
        //% block="Buffer %OLEDpaint löschen || von Zeile %vonZeile bis Zeile %bisZeile mit Bitmuster 0↓255 %byte" weight=9
        //% vonZeile.min=0 vonZeile.max=7 vonZeile.defl=0
        //% bisZeile.min=0 bisZeile.max=7 bisZeile.defl=7
        //% byte.min=0 byte.max=255 byte.defl=0
        clearBuffer(vonZeile?: number, bisZeile?: number, byte?: number) {
            for (let page = vonZeile; page <= bisZeile; page++)
                this.qBuffer.get(page).fill(byte & 0xFF, this.qOffset)
        }


        //% group="in den Buffer zeichnen (dann 'Buffer anzeigen' verwenden)" subcategory=zeichnen
        //% block="Buffer %OLEDpaint 7-Segment Ziffer %num an Position (0-3) %pos" weight=8
        //% num.min=0 num.max=9 pos.min=0 pos.max=3
        drawnum(num: number, pos: number) {
            if (between(num, 0, 9) && between(pos, 0, 3)) {
                pos = pos * 32
                /* switch (pos) {
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
                } */
                switch (num) {
                    case 0: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.D, pos)
                        this.drawsegment(eSegment.E, pos)
                        this.drawsegment(eSegment.F, pos)
                        break
                    }
                    case 1: {
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        break
                    }
                    case 2: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.G, pos)
                        this.drawsegment(eSegment.E, pos)
                        this.drawsegment(eSegment.D, pos)
                        break
                    }
                    case 3: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.D, pos)
                        this.drawsegment(eSegment.G, pos)
                        break
                    }
                    case 4: {
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.F, pos)
                        this.drawsegment(eSegment.G, pos)
                        break
                    }
                    case 5: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.D, pos)
                        this.drawsegment(eSegment.F, pos)
                        this.drawsegment(eSegment.G, pos)
                        break
                    }
                    case 6: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.D, pos)
                        this.drawsegment(eSegment.E, pos)
                        this.drawsegment(eSegment.F, pos)
                        this.drawsegment(eSegment.G, pos)
                        break
                    }
                    case 7: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        break
                    }
                    case 8: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.D, pos)
                        this.drawsegment(eSegment.E, pos)
                        this.drawsegment(eSegment.F, pos)
                        this.drawsegment(eSegment.G, pos)
                        break
                    }
                    case 9: {
                        this.drawsegment(eSegment.A, pos)
                        this.drawsegment(eSegment.B, pos)
                        this.drawsegment(eSegment.C, pos)
                        this.drawsegment(eSegment.D, pos)
                        this.drawsegment(eSegment.F, pos)
                        this.drawsegment(eSegment.G, pos)
                        break
                    }
                }
            }
        }


        //% group="in den Buffer zeichnen (dann 'Buffer anzeigen' verwenden)" subcategory=zeichnen
        //% block="Buffer %OLEDpaint ein Segment %seg an Position (0-96) %pos" weight=7
        //% pos.min=0 pos.max=96
        drawsegment(seg: eSegment, pos: number) {
            switch (seg) {
                case eSegment.A: { this.writeImageOLED(quer, pos + 4, 0); break }
                case eSegment.F: { this.writeImageOLED(hoch, pos, 4); break }
                case eSegment.E: { this.writeImageOLED(hoch, pos, 29); break }
                case eSegment.G: { this.writeImageOLED(quer, pos + 4, 25); break }
                case eSegment.B: { this.writeImageOLED(hoch, pos + 24, 4); break }
                case eSegment.C: { this.writeImageOLED(hoch, pos + 24, 29); break }
                case eSegment.D: { this.writeImageOLED(quer, pos + 4, 50); break }
            }
        }



        // ========== group="1 Byte (8 Pixel) in den Buffer zeichnen / lesen" subcategory=zeichnen

        //% group="1 Byte (8 Pixel) in den Buffer zeichnen / lesen" subcategory=zeichnen
        //% block="Buffer %OLEDpaint Zeile 0↓7 %page Segment 0→127 %seg Bitmuster 0↓255 %byte" weight=4
        //% page.min=0 page.max=7 page.defl=0
        //% seg.min=0 seg.max=127 seg.defl=0
        //% byte.min=0 byte.max=255 byte.defl=0
        writeByte(page: number, seg: number, byte: number) {
            if (between(page, 0, 7) && between(seg, 0, 127) && between(byte, 0, 255)) {
                this.qBuffer.get(page).setUint8(this.qOffset + seg, byte)
            }
        }

        //% group="1 Byte (8 Pixel) in den Buffer zeichnen / lesen" subcategory=zeichnen
        //% block="Buffer %OLEDpaint Zeile 0↓7 %page Segment 0→127 %seg Byte lesen" weight=2
        //% page.min=0 page.max=7 page.defl=0
        //% seg.min=0 seg.max=127 seg.defl=0
        readByte(page: number, seg: number) {
            if (between(page, 0, 7) && between(seg, 0, 127))
                return this.qBuffer.get(page).getUint8(this.qOffset + seg)
            else
                return 0
        }



        // ========== group="1 Pixel in den Buffer zeichnen / lesen" subcategory=zeichnen

        //% group="1 Pixel in den Buffer zeichnen / lesen" subcategory=zeichnen
        //% block="Buffer %OLEDpaint Pixel an x 0→127 %x y 0↓63 %y" weight=1
        //% x.min=0, x.max=127 y.min=0, y.max=63
        setPixel(x: number, y: number) {
            if (between(x, 0, 127) && between(y, 0, 63)) {
                let page = y >> 3                                // 64/8 = 0..7
                let bu: Buffer = this.qBuffer.get(page)
                let shift_page = y % 8                           //calculate the page to write to
                //let ind = x + page * 128 + 1                     //calculate which register in the page to write to.
                let seg = this.qOffset + x
                let screenPixel = (bu[seg] | (1 << shift_page))  //set the screen data byte
                bu[seg] = screenPixel                            //store data in screen buffer
                //bu.setUint8(seg, (bu.getUint8(seg) | (1 << (y % 8))))
            }
        }



        // ========== subcategory=Bilder ==========

        // ========== group="Image in Buffer zeichnen" subcategory=Bilder

        //% group="Image in Buffer zeichnen" subcategory=Bilder
        //% block="zeichne %OLEDpaint Matrix %im x %xpos y %ypos" weight=8
        //% xpos.min=0 xpos.max=119 ypos.min=0 ypos.max=55
        writeImageOLED(im: Image, xpos: number, ypos: number) {
            for (let y = 0; y <= im.height() - 1; y++) {
                for (let x = 0; x <= im.width() - 1; x++) {
                    if ((im.pixel(x, y) ? 1 : 0)) {
                        this.setPixel(x + xpos, y + ypos)
                    }
                }
            }
        }


    } // class oledpaint

} // oledpaint.ts

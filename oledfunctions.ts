
namespace oled 
/*
*/
{

    // ========== blockId=oled_ === für pADDR.shadow="oled_eADDR_OLED"

    export enum eADDR_OLED { OLED_16x8_x3C = 0x3C, OLED_16x8_x3D = 0x3D }
    //% blockId=oled_eADDR_OLED block="%pADDR" blockHidden=true
    export function oled_eADDR_OLED(pADDR: eADDR_OLED): number { return pADDR }


    //% blockId=oled_text block="%s" blockHidden=true
    export function oled_text(s: string): string { return s }


    // ========== i2c Register

    export enum eCONTROL { // Co Continuation bit(7); D/C# Data/Command Selection bit(6); following by six "0"s
        // CONTROL ist immer das 1. Byte im Buffer
        x00_xCom = 0x00, // im selben Buffer folgen nur Command Bytes ohne CONTROL dazwischen
        x80_1Com = 0x80, // im selben Buffer nach jedem Command ein neues CONTROL [0x00 | 0x80 | 0x40]
        x40_Data = 0x40  // im selben Buffer folgen nur Display-Data Bytes ohne CONTROL dazwischen
    }

    export enum eCommand {
        A0_SEGMENT_REMAP = 0xA0, // column address 0 is mapped to SEG0 (RESET) // using 0xA0 will flip screen
        A1_SEGMENT_REMAP = 0xA1, // column address 127 is mapped to SEG0
        A4_ENTIRE_DISPLAY_ON = 0xA4,
        A5_RAM_CONTENT_DISPLAY = 0xA5,
        A6_NORMAL_DISPLAY = 0xA6, // invert Hintergrund schwarz
        A7_INVERT_DISPLAY = 0xA7, // invert Hintergrund leuchtet
        AE_DISPLAY_OFF = 0xAE,
        AF_DISPLAY_ON = 0xAF,
        C0_COM_SCAN_INC = 0xC0, // COM Output Scan Direction
        C8_COM_SCAN_DEC = 0xC8, // remapped mode Scan from COM[N-1] to COM0
    }

    export enum eDisplayCommand {
        //% block="AF AE Set Display ON/OFF"
        ON,
        //% block="A7 A6 Set Normal/Inverse Display"
        INVERS,
        //% block="A0 A1 Set Segment Remap"
        FLIP,
        //% block="C0 C8 Set COM Output Scan Direction"
        REMAP,
        //% block="A4 A5 Entire Display"
        ENTIRE_ON
    }


    // ==========

    export enum eZeichenDrehen {
        //%block="nicht drehen"
        nicht,
        //%block="nach links drehen"
        links,
        //%block="nach rechts drehen"
        rechts,
        //%block="spiegeln"
        spiegeln
    }

    export enum eAlign {
        //% block="linksbündig"
        links,
        //% block="rechtsbündig"
        rechts
    }


    export function between(i0: number, i1: number, i2: number): boolean { return (i0 >= i1 && i0 <= i2) }


    export  function drehen(b0: Buffer, pDrehen: eZeichenDrehen) { // Buffer mit 8 Byte
        let b1 = Buffer.create(8)
        b1.fill(0b00000000)

        switch (pDrehen) {
            case eZeichenDrehen.nicht: {
                return b0
            }
            case eZeichenDrehen.links: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach links drehen
                    if ((b0.getUint8(7 - i) & 2 ** 7) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 6) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 5) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 4) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 3) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 2) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 1) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 0) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                }
                return b1
            }
            case eZeichenDrehen.rechts: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach rechts drehen
                    if ((b0.getUint8(i) & 2 ** 0) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 1) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 2) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 3) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 4) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 5) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 6) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 7) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                }
                return b1
            }
            case eZeichenDrehen.spiegeln: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/2 nach rechts drehen
                    if ((b0.getUint8(i) & 2 ** 0) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 0) }
                    if ((b0.getUint8(i) & 2 ** 1) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 1) }
                    if ((b0.getUint8(i) & 2 ** 2) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 2) }
                    if ((b0.getUint8(i) & 2 ** 3) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 3) }
                    if ((b0.getUint8(i) & 2 ** 4) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 4) }
                    if ((b0.getUint8(i) & 2 ** 5) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 5) }
                    if ((b0.getUint8(i) & 2 ** 6) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 6) }
                    if ((b0.getUint8(i) & 2 ** 7) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 7) }
                }
                return b1
            }
            default: return b0
        }
    }

} // oledfunctions.ts

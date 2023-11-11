
namespace oledssd1315
/*
Weiterentwicklung der Idee von M.Klein:
    https://github.com/MKleinSB/pxt-OLEDpaint
    "pxt-oledpaint": "github:MKleinSB/pxt-OLEDpaint#v1.2.1",

neu programmiert von Lutz Elßner im November 2023
*/ {


    //% subcategory=paint
    //% block="Bild8x8" weight=4
    //% imageLiteral=1 imageLiteralColumns=8 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix8x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% subcategory=paint
    //% block="Bild16x16" weight=2
    //% imageLiteral=1 imageLiteralColumns=16 imageLiteralRows=16
    //% shim=images::createImage
    export function matrix16x16(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% imageLiteral=1 imageLiteralColumns=6 imageLiteralRows=24
    //% shim=images::createImage
    export function matrix6x24(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% imageLiteral=1 imageLiteralColumns=22 imageLiteralRows=6
    //% shim=images::createImage
    export function matrix22x6(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    export let quer = matrix22x6(`
        . . # # # # # # # # # # # # # # # # # # . .
        . # # # # # # # # # # # # # # # # # # # # .
        # # # # # # # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # # # # # # # #
        . # # # # # # # # # # # # # # # # # # # # .
        . . # # # # # # # # # # # # # # # # # # . .
        `)

    export let hoch = matrix6x24(`
    . . # # . .
    . # # # # .
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    # # # # # #
    . # # # # .
    . . # # . .
    `)


} // oledimage.ts
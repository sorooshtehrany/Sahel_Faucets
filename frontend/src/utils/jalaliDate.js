import {
    toGregorian,
    toJalaali
} from "jalaali-js";


// -------------------------------------------------
// Convert Jalali date to Gregorian date
//
// Input:
//     1405/07/09
//
// Output:
//     2026-10-01
// -------------------------------------------------

export function jalaliToGregorian(
    jalaliDate
) {

    if (!jalaliDate) {
        return "";
    }


    const parts =
        jalaliDate.split("/");


    if (parts.length !== 3) {
        return "";
    }


    const jy =
        Number(parts[0]);

    const jm =
        Number(parts[1]);

    const jd =
        Number(parts[2]);


    if (
        !jy ||
        !jm ||
        !jd
    ) {
        return "";
    }


    const {
        gy,
        gm,
        gd
    } =
        toGregorian(
            jy,
            jm,
            jd
        );


    return [
        gy.toString().padStart(4, "0"),

        gm.toString().padStart(2, "0"),

        gd.toString().padStart(2, "0")

    ].join("-");
}


// -------------------------------------------------
// Convert Gregorian date to Jalali date
//
// Input:
//     2026-10-01
//
// Output:
//     1405/07/09
// -------------------------------------------------

export function gregorianToJalali(
    gregorianDate
) {

    if (!gregorianDate) {
        return "";
    }


    const parts =
        gregorianDate
            .slice(0, 10)
            .split("-");


    if (parts.length !== 3) {
        return "";
    }


    const gy =
        Number(parts[0]);

    const gm =
        Number(parts[1]);

    const gd =
        Number(parts[2]);


    if (
        !gy ||
        !gm ||
        !gd
    ) {
        return "";
    }


    const {
        jy,
        jm,
        jd
    } =
        toJalaali(
            gy,
            gm,
            gd
        );


    return [
        jy.toString(),

        jm.toString().padStart(2, "0"),

        jd.toString().padStart(2, "0")

    ].join("/");
}
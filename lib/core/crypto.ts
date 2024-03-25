import * as cr from 'crypto';

/*
	  UUID                   = time-low "-" time-mid "-"
							   time-high-and-version "-"
							   clock-seq-and-reserved
							   clock-seq-low "-" node
	  time-low               = 4hexOctet
	  time-mid               = 2hexOctet
	  time-high-and-version  = 2hexOctet
	  clock-seq-and-reserved = hexOctet
	  clock-seq-low          = hexOctet
	  node                   = 6hexOctet
	  hexOctet               = hexDigit hexDigit
	  hexDigit =
			"0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
			"a" / "b" / "c" / "d" / "e" / "f" /
			"A" / "B" / "C" / "D" / "E" / "F"

   The following is an example of the string representation of a UUID as
   a URN:

   urn:uuid:f81d4fae-7dec-41d0-a765-00a0c91e6bf6
*/
export const GenerateUUID = (): string => {
    const hexChars = '0123456789abcdef';
    let uuid = '';

    // Generate an UUID on format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4'; // V4 for random uuid
        } else if (i === 19) {
            uuid += hexChars.charAt(Math.floor(Math.random() * 4) + 8); // [8, 9, a, b]
        } else {
            uuid += hexChars.charAt(Math.floor(Math.random() * 16));
        }
    }

    return uuid;
}

const crypto = { randomUUID: GenerateUUID };

if(typeof process !== 'undefined' && cr && cr?.randomUUID) {
	crypto.randomUUID = cr.randomUUID;
	// @ts-ignore
} else if (typeof window !== 'undefined' && window?.crypto && window.crypto?.randomUUID) {
	// @ts-ignore
	crypto.randomUUID = window.crypto.randomUUID
}

export const UUID = crypto.randomUUID;
export default UUID;

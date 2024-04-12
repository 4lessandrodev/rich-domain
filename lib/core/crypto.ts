import * as crypto from 'crypto';

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
const customCrypto = {
    randomUUID: () => {
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
};

if (typeof process !== 'undefined' && crypto && crypto?.randomUUID) {
    customCrypto.randomUUID = crypto.randomUUID;
} else if (typeof window !== 'undefined' && window?.crypto && window?.crypto?.randomUUID) {
    customCrypto.randomUUID = window.crypto.randomUUID.bind(window.crypto);
}

export const UUID = customCrypto.randomUUID;
export default UUID;

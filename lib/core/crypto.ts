import * as crypto from 'crypto';

const { randomUUID } = crypto;

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

   urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6
*/
const chars = [
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"a", "b", "c", "d", "e", "f",
	"A", "B", "C", "D", "E", "F"
];

const charsAsc = [
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"a", "b", "c", "d", "e", "f"
];



const Generate = (): string => {
	const GetRandom = (): string => chars[Math.trunc(Math.random() * chars.length)];
	const GetRandomAsc = (): string => charsAsc[Math.trunc(Math.random() * charsAsc.length)];
	const CurrentTime = (Date.now()).toString(16).padStart(4, GetRandom()) + GetRandomAsc();

	let str = CurrentTime.slice(6);
	while (str.length < 36) {
		str = str + GetRandomAsc();
	}

	const result = `${str.slice(0, 7)}-${str.slice(8, 12)}-${str.slice(13, 17)}-${str.slice(18, 22)}-${str.slice(23)}`
	return result.slice(0, 36);
}

export const UUID = randomUUID || Generate;
export default UUID;

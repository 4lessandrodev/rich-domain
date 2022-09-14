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

export const GenerateUUID = (): string => {
	const GetRandom = (): string => chars[Math.trunc(Math.random() * chars.length)];
	const GetRandomAsc = (): string => charsAsc[Math.trunc(Math.random() * charsAsc.length)];
	const CurrentTime = (Date.now()).toString(16).padStart(4, GetRandom()) + GetRandomAsc();

	let str = GetRandomAsc();
	while (str.length < 33) {
		str = str + GetRandomAsc();
	}
	str = str + CurrentTime.slice(9);
	const result = `${str.slice(0, 8)}-${str.slice(9, 13)}-${str.slice(14, 18)}-${str.slice(19, 23)}-${str.slice(24)}`
	return result.slice(0, 36);
}

export const UUID = randomUUID || GenerateUUID;
export default UUID;

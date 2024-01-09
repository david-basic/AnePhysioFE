/**
 * Generates a random number and returns it as string
 * @param yearIsPrefix Adds the current year as a prefix to the string
 * @param numberOfDigits Number of digits of the random number
 * @returns Returns a string with a random number with required digits if the number of digits is safe to return, otherwise returns null. 
 * Can also use current year as prefix
 */
const generateRandomNumber = (
	yearIsPrefix: boolean,
	numberOfDigits: number
): string | null => {
	if (!validateNumberOfDigits(numberOfDigits)) {
		return null;
	}

	const minLimit: number = 10 ** (numberOfDigits - 1);
	const maxLimit: number = 10 ** numberOfDigits - 1;

	const randomNum: number = getRandomNumber(minLimit, maxLimit);

	if (yearIsPrefix) {
		const currentYear: number = new Date().getFullYear();
		const str: string = `${currentYear}${randomNum}`;
		return str;
	}

	return randomNum.toString();
};

export default generateRandomNumber;

/**
 * Validates that the number of digits is safe to generate
 * @param numberOfDigits number of digits wanted of a number
 * @returns boolean that indicates that the input is valid or invalid
 */
function validateNumberOfDigits(numberOfDigits: number) {
	const maxSafeDigits: number =
		Math.floor(Math.log10(Number.MAX_SAFE_INTEGER)) + 1;

	if (numberOfDigits > maxSafeDigits) {
		console.log(
			`Error: Maximum number of digits allowed is ${maxSafeDigits}.`
		);
		return false;
	}

	return true;
}

/**
 * Generates a number between the limits
 * @param minLimit Lower limit for the random number
 * @param maxLimit Upper limit for the random number
 * @returns a random number only if it is higher then minLimit and lowe then maxLimit
 */
function getRandomNumber(minLimit: number, maxLimit: number): number {
	let randomNum: number;
	do {
		randomNum = generateRandomInRange(maxLimit);
	} while (randomNum < minLimit);

	return randomNum;
}

/**
 * Generates random number lower then maxLimit
 * @param maxLimit Upper limit for the random number
 * @returns a random number that is lover then the maxLimit otherwise it generates it again
 */
function generateRandomInRange(maxLimit: number): number {
	const maxLimitDigits: number = maxLimit.toString().length;
	const randomNum = Math.floor(Math.random() * 10 ** maxLimitDigits);

	return randomNum <= maxLimit ? randomNum : generateRandomInRange(maxLimit);
}

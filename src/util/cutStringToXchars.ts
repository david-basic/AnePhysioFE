/**
 * Function cuts a string to the number of chars specified
 * @param inputString String value to shorten
 * @param charNumToCutTo Number value of chars you want to leave uncut
 * @returns a string cut to the number of chars
 */
const cutStringToNchars = (
	inputString: string,
	charNumToCutTo: number
): string => {
	if (inputString.length <= charNumToCutTo) {
		return inputString.slice(0, charNumToCutTo);
	} else {
		return inputString.slice(0, charNumToCutTo - 3) + "...";
	}
};

export default cutStringToNchars;

const isNullOrEmpty = (value: string | null) => {
	return (
		value == null ||
		(typeof value === "string" && value.trim().length === 0)
	);
};

export default isNullOrEmpty;

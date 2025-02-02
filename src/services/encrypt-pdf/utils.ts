export const convertFileToUint8Array = async (file: File) => {
	const arrayBuffer = await file.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);
	return uint8Array;
};

export const convertUint8ArrayToBlob = (uint8Array: Uint8Array) => {
	const blob = new Blob([uint8Array], { type: "application/pdf" });
	return blob;
};

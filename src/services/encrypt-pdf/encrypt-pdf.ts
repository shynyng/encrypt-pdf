import createModule from "@neslinesli93/qpdf-wasm";
import qpdfWasm from "@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url";

import { convertFileToUint8Array, convertUint8ArrayToBlob } from "./utils";

export type EncryptPDFProps = {
	inputFile: File;
	password: string;
};
export const encryptPDF = async ({ inputFile, password }: EncryptPDFProps) => {
	const qpdf = await createModule({
		locateFile: () => qpdfWasm,
	});

	const INPUT_FILE_PATH = "./input.pdf";
	const OUTPUT_FILE_PATH = "./output.pdf";

	qpdf.FS.writeFile(INPUT_FILE_PATH, await convertFileToUint8Array(inputFile));
	qpdf.callMain([
		"--encrypt",
		password,
		password,
		"256",
		"--",
		INPUT_FILE_PATH,
		OUTPUT_FILE_PATH,
	]);

	const encryptedFileBuffer = qpdf.FS.readFile(OUTPUT_FILE_PATH);
	return convertUint8ArrayToBlob(encryptedFileBuffer);
};

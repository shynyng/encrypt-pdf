import { useState } from "react";
import { produce } from "immer";

export type PdfFile = {
	file: File;
	outputName: string;
	password: string;
};

export const usePdfFiles = (initial: PdfFile[]) => {
	const [pdfFiles, setPdfFiles] = useState<PdfFile[]>(initial);

	const removePdfFile = (index: number) => {
		setPdfFiles(() =>
			produce(pdfFiles, (draft) => {
				draft.splice(index, 1);
			}),
		);
	};

	const appendPdfFiles = (files: PdfFile[]) => {
		setPdfFiles(() => [...pdfFiles, ...files]);
	};

	return {
		pdfFiles,
		removePdfFile,
		appendPdfFiles,
		setPdfFiles,
	};
};

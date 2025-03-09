import { produce } from "immer";
import { useState } from "react";

export type PdfFile = {
	file: File;
	outputName: string;
	password: string;
};

export const usePdfFiles = (initial: PdfFile[]) => {
	const [pdfFiles, setPdfFiles] = useState<PdfFile[]>(initial);

	const removePdfFile = (index: number) => {
		setPdfFiles((pdfFiles) =>
			produce(pdfFiles, (draft) => {
				draft.splice(index, 1);
			}),
		);
	};

	const appendPdfFiles = (files: PdfFile[]) => {
		setPdfFiles((pdfFiles) => [...pdfFiles, ...files]);
	};

	const updatePdfFilesByName = (
		fileName: string,
		{ outputName, password }: { outputName: string; password: string },
	) => {
		setPdfFiles((pdfFiles) =>
			produce(pdfFiles, (draft) => {
				const target = draft.find(
					(f) => f.file.name.normalize("NFC") === fileName.normalize("NFC"),
				);
				if (!target) return;
				target.outputName = outputName;
				target.password = password;
			}),
		);
	};

	return {
		pdfFiles,
		removePdfFile,
		appendPdfFiles,
		setPdfFiles,
		updatePdfFilesByName,
	};
};

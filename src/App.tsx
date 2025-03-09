import JSZip from "jszip";
import { Download, Files, X } from "lucide-react";
import {
	DataSheetGrid,
	DownloadButton,
	DropZone,
	FileUploadButton,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	keyColumn,
	textColumn,
	useDatasheetGridRef,
} from "pdf-encryptor/components";
import { usePdfFiles } from "pdf-encryptor/hooks";

import { encryptPDF } from "pdf-encryptor/services";
import { useState } from "react";
import { Button } from "./components/ui/button";

type FileInfo = {
	fileName: string;
	password: string;
	outputName: string;
};

const App = () => {
	const {
		pdfFiles,
		removePdfFile,
		appendPdfFiles,
		setPdfFiles,
		updatePdfFilesByName,
	} = usePdfFiles([]);
	const [fileInfo, setFileInfo] = useState<FileInfo[]>([]);

	const datasheetGridRef = useDatasheetGridRef();

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<div className="flex flex-col w-screen gap-4 p-8 max-w-7xl ">
				<div className="flex items-baseline justify-center gap-2 pb-4 border-b-2 border-black">
					<p className="text-3xl font-bold">Encrypt-PDF</p>
					<span>
						(
						<a
							href="https://github.com/shynyng/encrypt-pdf"
							className="underline "
						>
							Github
						</a>
						)
					</span>
				</div>
				{pdfFiles.length !== 0 && (
					<>
						<DataSheetGrid<FileInfo>
							disableContextMenu
							disableExpandSelection
							addRowsComponent={false}
							value={fileInfo}
							onChange={setFileInfo}
							columns={[
								{
									...keyColumn("fileName", textColumn),
									title: "Uploaded PDF",
								},
								{
									...keyColumn("password", textColumn),
									title: "Password",
								},
								{
									...keyColumn("outputName", textColumn),
									title: "Output Name",
								},
							]}
						/>
						<Button
							type="button"
							size={"default"}
							disabled={
								fileInfo.length === 0 ||
								fileInfo.some(
									(f) => !f.password || !f.outputName || !f.fileName,
								)
							}
							onClick={() => {
								for (const { fileName, outputName, password } of fileInfo) {
									updatePdfFilesByName(fileName, {
										outputName,
										password,
									});
								}
							}}
						>
							Match
						</Button>
					</>
				)}
				<DropZone
					accept={{
						"application/pdf": [".pdf"],
					}}
					noClick={pdfFiles.length !== 0}
					onDrop={(files) => {
						setPdfFiles(
							files.map((file) => ({
								file,
								outputName: "",
								password: "",
							})),
						);
						setFileInfo(
							files.map((f) => ({
								fileName: f.name,
								outputName: f.name,
								password: "",
							})),
						);
					}}
				>
					{({ isDragActive }) => {
						if (isDragActive) {
							return (
								<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg cursor-pointer active:bg-primary-foreground border-muted-foreground bg-muted border-opacity-30 h-52">
									<Files
										className="text-muted-foreground"
										size={56}
										strokeWidth={1}
									/>
									<span className="text-muted-foreground">Drop File</span>
								</div>
							);
						}

						if (pdfFiles.length === 0) {
							return (
								<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary-foreground border-muted-foreground bg-muted border-opacity-30 h-52">
									<Files
										className="text-muted-foreground"
										size={56}
										strokeWidth={1}
									/>
									<span className="text-muted-foreground">
										Drag & Drop File here
									</span>
								</div>
							);
						}

						return (
							<Table>
								<TableCaption>
									The output information of the encrypted file.
								</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Uploaded PDF</TableHead>
										<TableHead>Password</TableHead>
										<TableHead>Output file name</TableHead>
										<TableHead className="text-right">actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pdfFiles.map((pdfFile, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey:Since a unique key is not present in the pdfFile object, an index is used.
										<TableRow key={index}>
											<TableCell className="font-medium">
												{pdfFile.file.name}
											</TableCell>
											<TableCell>{pdfFile.password}</TableCell>
											<TableCell>{pdfFile.outputName}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2 ">
													<DownloadButton
														disabled={!pdfFile.password || !pdfFile.outputName}
														download={pdfFile.outputName}
														createBlob={() =>
															encryptPDF({
																inputFile: pdfFile.file,
																password: pdfFile.password,
															})
														}
													/>
													<Button
														variant="destructive"
														size="icon"
														type="button"
														onClick={() => {
															removePdfFile(index);
														}}
													>
														<X />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							// <DynamicDataSheetGrid<PdfFile>
							// 	ref={datasheetGridRef}
							// 	lockRows
							// 	autoAddRow={false}
							// 	value={pdfFiles}
							// 	onChange={setPdfFiles}
							// 	columns={[
							// 		{
							// 			title: "Uploaded PDF",
							// 			disabled: true,
							// 			component: ({ rowData: v }) => (
							// <span className="flex items-center self-stretch justify-center grow">
							// 	<span className="flex">{v.file.name}</span>
							// </span>
							// 			),
							// 			copyValue: ({ rowData }) => rowData.file.name,
							// 		},
							// 		{
							// 			...keyColumn("password", textColumn),
							// 			disabled: true,
							// 			title: "Password",
							// 		},
							// 		{
							// 			...keyColumn("outputName", textColumn),
							// 			disabled: true,
							// 			title: "Output PDF",
							// 		},
							// 		{
							// 			title: "",
							// 			maxWidth: 96,
							// 			component: ({ rowData: f, rowIndex }) => (
							// <div className="flex gap-2 px-2 ">
							// 	<DownloadButton
							// 		disabled={!f.password || !f.outputName}
							// 		download={f.outputName}
							// 		onBeforeClick={() =>
							// 			datasheetGridRef.current?.setSelection(null)
							// 		}
							// 		createBlob={() =>
							// 			encryptPDF({
							// 				inputFile: f.file,
							// 				password: f.password,
							// 			})
							// 		}
							// 	/>
							// 	<Button
							// 		variant="destructive"
							// 		size="icon"
							// 		type="button"
							// 		onClick={() => {
							// 			datasheetGridRef.current?.setSelection(null);
							// 			removePdfFile(rowIndex);
							// 		}}
							// 	>
							// 		<X />
							// 	</Button>
							// </div>
							// 			),
							// 		},
							// 	]}
							// />
						);
					}}
				</DropZone>
				<div className="flex flex-col gap-1">
					<FileUploadButton
						disabled={pdfFiles.length === 0}
						multiple
						id="fileInput"
						inputProps={{ accept: ".pdf" }}
						onUpload={(files) => {
							appendPdfFiles(
								files.map((file) => ({
									file,
									outputName: "",
									password: "",
								})),
							);
							setFileInfo((fileInfos) => [
								...fileInfos,
								...files.map((f) => ({
									fileName: f.name,
									outputName: f.name,
									password: "",
								})),
							]);
						}}
					/>
					<DownloadButton
						disabled={
							pdfFiles.length === 0 ||
							pdfFiles.some((f) => !f.password || !f.outputName)
						}
						download={"encrypted.zip"}
						onBeforeClick={() => datasheetGridRef.current?.setSelection(null)}
						createBlob={async () => {
							const zip = new JSZip();
							for await (const f of pdfFiles) {
								zip.file(
									f.outputName,
									encryptPDF({
										inputFile: f.file,
										password: f.password,
									}),
								);
							}
							return await zip.generateAsync({ type: "blob" });
						}}
					>
						<Download /> Download all files
					</DownloadButton>
				</div>
			</div>
		</div>
	);
};

export default App;

import {
	DropZone,
	DynamicDataSheetGrid,
	textColumn,
	checkboxColumn,
	keyColumn,
	useDatasheetGridRef,
	DownloadButton,
	FileUploadButton,
} from "./components";
import { encryptPDF } from "./services";
import { usePdfFiles } from "./hooks";
import type { PdfFile } from "./hooks";

const App = () => {
	const { pdfFiles, removePdfFile, appendPdfFiles, setPdfFiles } = usePdfFiles(
		[],
	);
	const datasheetGridRef = useDatasheetGridRef();

	return (
		<div>
			<DropZone
				accept={{
					"application/pdf": [".pdf"],
				}}
				noClick={pdfFiles.length !== 0}
				onDrop={(files) =>
					setPdfFiles(
						files.map((file) => ({
							checked: true,
							file,
							outputName: `encrypted-${file.name}`,
							password: "",
						})),
					)
				}
			>
				{({ isDragActive }) => {
					if (isDragActive) {
						return "Continue ... ";
					}

					if (pdfFiles.length === 0) {
						return "Drop file here.";
					}

					return (
						<DynamicDataSheetGrid<PdfFile>
							ref={datasheetGridRef}
							lockRows
							autoAddRow={false}
							value={pdfFiles}
							onChange={setPdfFiles}
							columns={[
								{
									...keyColumn("checked", checkboxColumn),
									maxWidth: 60,
									title: "",
								},
								{
									title: "name",
									disabled: true,
									component: ({ rowData: v }) => (
										<span className="flex self-stretch grow items-center justify-center">
											<span className="flex">{v.file.name}</span>
										</span>
									),
								},
								{
									...keyColumn("outputName", textColumn),
									title: "outputName",
								},
								{
									...keyColumn("password", textColumn),
									title: "password",
								},
								{
									title: "DEL",
									maxWidth: 80,
									component: ({ rowData: v, rowIndex }) => (
										<button
											className="cursor-pointer"
											key={v.outputName}
											type="button"
											onClick={() => {
												datasheetGridRef.current?.setSelection(null);
												removePdfFile(rowIndex);
											}}
										>
											DEL {rowIndex}
										</button>
									),
								},
								{
									title: "DOWN",
									maxWidth: 80,
									component: ({ rowData: f, rowIndex }) => (
										<DownloadButton
											download={f.outputName}
											onBeforeClick={() =>
												datasheetGridRef.current?.setSelection(null)
											}
											createBlob={() =>
												encryptPDF({
													inputFile: f.file,
													password: f.password,
												})
											}
										>
											DOWN {rowIndex}
										</DownloadButton>
									),
								},
							]}
						/>
					);
				}}
			</DropZone>
			<FileUploadButton
				id="fileInput"
				inputProps={{ multiple: true, accept: ".pdf" }}
				onUpload={(files) =>
					appendPdfFiles(
						files.map((file) => ({
							checked: true,
							file,
							outputName: `encrypted-${file.name}`,
							password: "1234",
						})),
					)
				}
			>
				Add Files
			</FileUploadButton>
		</div>
	);
};

export default App;

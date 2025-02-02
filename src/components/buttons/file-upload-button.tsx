import type { InputHTMLAttributes, ReactNode } from "react";

export type FileUploadButtonProps = {
	className?: string;
	id: string;
	children: ReactNode;
	inputProps?: Partial<
		Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id">
	>;
	onUpload: (file: File[]) => void;
};

export const FileUploadButton = ({
	className,
	id,
	children,
	inputProps,
	onUpload,
}: FileUploadButtonProps) => {
	const clickInputLabel = () => {
		const label = document.createElement("label");
		label.setAttribute("for", id);
		document.body.appendChild(label);
		label.click();
		document.body.removeChild(label);
	};
	return (
		<>
			<button
				className={`cursor-pointer ${className ?? ""}`}
				type="button"
				onClick={clickInputLabel}
			>
				{children}
			</button>
			<input
				type="file"
				id={id}
				{...inputProps}
				className="hidden"
				onChange={(v) => {
					const files = v.target.files;
					if (files === null) throw Error();
					onUpload(Array.from(files));
				}}
			/>
		</>
	);
};

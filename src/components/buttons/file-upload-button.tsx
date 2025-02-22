import type { InputHTMLAttributes, ReactNode } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";

type FileUploadButtonPropsBase = {
	className?: string;
	id: string;
	disabled?: boolean;
	children?: ReactNode;
	inputProps?: Partial<
		Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id" | "multiple">
	>;
};

export type FileUploadButtonProps = (
	| {
			multiple: true;
			onUpload: (file: File[]) => void;
	  }
	| {
			multiple: false;
			onUpload: (file: File) => void;
	  }
) &
	FileUploadButtonPropsBase;

export const FileUploadButton = ({
	className,
	id,
	children = "Upload more files",
	disabled,
	inputProps,
	multiple,
	onUpload,
}: FileUploadButtonProps) => {
	return (
		<>
			<Button asChild className={className} type="button" disabled={disabled}>
				<label htmlFor={id}>
					<Upload />
					{children}
				</label>
			</Button>
			<input
				type="file"
				id={id}
				{...inputProps}
				className="hidden"
				multiple={multiple}
				onChange={(v) => {
					const _files = v.target.files;
					if (!_files) throw Error();
					const files = Array.from(_files);

					if (multiple) {
						onUpload(files);
					} else {
						const file = files.at(0);
						if (!file) throw Error();
						onUpload(file);
					}
				}}
			/>
		</>
	);
};

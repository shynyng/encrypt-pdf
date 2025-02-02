import type { ReactNode } from "react";
import { useDropzone } from "react-dropzone";

import type { DropzoneOptions } from "react-dropzone";

export type TDropZoneProps = {
	children: ({ isDragActive }: { isDragActive: boolean }) => ReactNode;
} & DropzoneOptions;

export const DropZone = ({
	noClick,
	onDrop,
	accept,
	children,
}: TDropZoneProps) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		noClick,
		accept,
	});

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			{children({ isDragActive })}
		</div>
	);
};

import { useState } from "react";
import type { ReactNode } from "react";

export type DownloadButtonProps = {
	className?: string;
	download: string;
	children: ReactNode;
	createBlob: () => Promise<Blob>;
	onBeforeClick?: () => void;
};

export const DownloadButton = ({
	className,
	download,
	children,
	createBlob,
	onBeforeClick,
}: DownloadButtonProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	const downloadBlob = (blob: Blob) => {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = download;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(a.href);
	};
	return (
		<button
			className={`cursor-pointer ${className ?? ""}`}
			type="button"
			onClick={() => {
				onBeforeClick?.();
				setLoading(true);
				createBlob()
					.then((blob) => downloadBlob(blob))
					.finally(() => setLoading(false));
			}}
			disabled={loading}
		>
			{loading ? "Processing ..." : children}
		</button>
	);
};

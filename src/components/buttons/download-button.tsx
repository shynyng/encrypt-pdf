import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

export type DownloadButtonProps = {
	className?: string;
	download: string;
	children?: ReactNode;
	disabled?: boolean;
	createBlob: () => Promise<Blob>;
	onBeforeClick?: () => void;
};

export const DownloadButton = ({
	className,
	download,
	disabled,
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
		<Button
			className={className}
			type="button"
			size={children ? "default" : "icon"}
			onClick={() => {
				onBeforeClick?.();
				setLoading(true);
				createBlob()
					.then((blob) => downloadBlob(blob))
					.finally(() => setLoading(false));
			}}
			disabled={loading || disabled}
		>
			{loading ? (
				<Loader2 className="animate-spin" />
			) : children ? (
				children
			) : (
				<Download />
			)}
		</Button>
	);
};

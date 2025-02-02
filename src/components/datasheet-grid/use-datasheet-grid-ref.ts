import { useRef } from "react";

import type { DataSheetGridRef } from "react-datasheet-grid";

export const useDatasheetGridRef = () => {
	return useRef<DataSheetGridRef>(null);
};

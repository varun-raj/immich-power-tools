import { IDeviceAsset } from "@/types/asset"
import { createContext, useContext, useMemo, useReducer } from "react"

export type UploadItemStatus = "pending" | "uploading" | "success" | "error";

export interface UploadItem {
  asset: IDeviceAsset;
  status: UploadItemStatus;
}

interface UploadState {
  uploads: UploadItem[]
}

const initialState: UploadState = {
  uploads: []
};

type UploadAction =
| { type: "ADD_ASSETS"; payload: IDeviceAsset[] }
| { type: "UPDATE_STATUS"; payload: { checksum: string, status: UploadItemStatus} }
| { type: "CLEAR_COMPLETED"; }
| { type: "REMOVE"; payload: { checksum: string }; }

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
	case "ADD_ASSETS":
		const newItems: UploadItem[] = action.payload
			.filter(asset => !state.uploads.some(u => u.asset.checksum === asset.checksum))
			.map(asset => ({ asset, status: "pending" }));
		return { ...state, uploads: [...state.uploads, ...newItems] };


	case "UPDATE_STATUS":
		return {
			...state,
			uploads: state.uploads.map(item =>
				item.asset.checksum === action.payload.checksum
				? { ...item, status: action.payload.status }
				: item
			)
		};

	case "CLEAR_COMPLETED":
		return {
			...state,
			uploads: state.uploads.filter(item =>
				item.status === "pending" || item.status === "uploading"
			)
		};

	case "REMOVE":
		return {
			...state,
			uploads: state.uploads.filter(item =>
				item.asset.checksum !== action.payload.checksum
			)
		};

    default:
      return state;
  }
}

interface UploadContextValue {
  state: UploadState;
  dispatch: React.Dispatch<UploadAction>;
}

const UploadContext = createContext<UploadContextValue | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(uploadReducer, initialState);
	return (
		<UploadContext.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
			{children}
		</UploadContext.Provider>
	);
}

export const useUploadContext = (): UploadContextValue => {
  const context = useContext(UploadContext);
  if (!context) {
	throw new Error("useUploadContext must be used within a UploadProvider");
  }
  return context;
};

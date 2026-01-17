import { findAssetByChecksum } from "@/handlers/api/asset.handler"
import { sortAssetsByDateTime } from "@/helpers/asset.helper"
import { IDeviceAsset } from "@/types/asset";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";

// Interface for specific configuration options
export interface IDevicePhotoSelectionConfig {
  /** Invalid selection are auto unselected after X ms */
  autoUnselectedInvalidTime: number
  sortOrder: "asc" | "desc"
}

interface DevicePhotoSelectionState {
  assets: IDeviceAsset[];
  selectedChecksums: string[];
  config: IDevicePhotoSelectionConfig
}

const initialState: DevicePhotoSelectionState = {
  selectedChecksums: [],
  assets: [],
  config: {
    autoUnselectedInvalidTime: 700,
    sortOrder: "desc"
  },
};

type DevicePhotoSelectionAction =
| { type: "ADD_ASSETS"; payload: IDeviceAsset[] }
| { type: "UPDATE_ASSET"; payload: IDeviceAsset }
| { type: "SET_SELECTED"; payload: string[] }
| { type: "UNSELECT"; payload: string[] }
| { type: "SET_SORT_ORDER"; payload: "asc" | "desc" };


export function devicePhotoSelectionContextReducer(
  state: DevicePhotoSelectionState,
  action: DevicePhotoSelectionAction
): DevicePhotoSelectionState {
  switch (action.type) {
    case "ADD_ASSETS":
      // Filter assets already added
      const newAssets = action.payload
        .filter((incoming) => !state.assets.some(a => a.checksum === incoming.checksum));
      const merged = [...state.assets, ...newAssets];
      return { ...state, assets: sortAssetsByDateTime(merged, state.config.sortOrder), };

    case "UPDATE_ASSET": {
      const updated = state.assets.map(asset =>
        asset.checksum === action.payload.checksum ? action.payload : asset
      );
      return {
        ...state,
        assets: sortAssetsByDateTime(updated, state.config.sortOrder),
      };
    }

    case "SET_SELECTED":
    return { ...state, selectedChecksums: action.payload };

    case "UNSELECT":
    return {
      ...state,
      selectedChecksums: state.selectedChecksums.filter(
        checksum => !action.payload.includes(checksum)
      ),
    };

    case "SET_SORT_ORDER": {
      return {
        ...state,
        config: { ...state.config, sortOrder: action.payload },
        assets: sortAssetsByDateTime(state.assets, action.payload),
      };
    }

    default:
    return state;
  }
}

interface DevicePhotoSelectionContextValue {
  state: DevicePhotoSelectionState;
  dispatch: React.Dispatch<DevicePhotoSelectionAction>;
}

const DevicePhotoSelectionContext = createContext<DevicePhotoSelectionContextValue | undefined>(undefined);
export default DevicePhotoSelectionContext;

export const DevicePhotoSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    devicePhotoSelectionContextReducer,
    initialState
  );
  /** Prevent multiple checksum lookup to be ran at the same time */
  const lookupInProgressRef = useRef(false);

  // Auto-unselect invalid selections
  useEffect(() => {
    const invalidSelections = state.selectedChecksums.filter((checksum) => {
      const asset = state.assets.find((f) => f.checksum === checksum);
      return asset && asset.id; // invalid if asset already exists
    });

    if (invalidSelections.length === 0) return;

    const timer = setTimeout(() => {
      dispatch({ type: "UNSELECT", payload: invalidSelections });
    }, state.config.autoUnselectedInvalidTime);

    return () => clearTimeout(timer);
  }, [state.selectedChecksums, state.assets]);


  // Check on immich if files already exists
  useEffect(() => {
    if (lookupInProgressRef.current) return;
    lookupInProgressRef.current = true;

    const unchecked = state.assets.filter(a => a.id === undefined);
    if (unchecked.length === 0) return;

    const CONCURRENCY = 10;

    /**
     * We will build workers to make consistently {CONCURRENCY} calls at the same time
     */
    (async () => {
      try {
        let index = 0;

        const worker = async () => {
          while (index < unchecked.length) {
            const currentIndex = index++;
            const asset = unchecked[currentIndex];

            const result = await findAssetByChecksum(asset.checksum);

            dispatch({
              type: "UPDATE_ASSET",
              payload: {
                ...asset,
                id: result.id,
                deletedAt: result.deletedAt,
              },
            });
          }
        };

        // Start N workers in parallel
        const workers = Array.from({ length: CONCURRENCY }, worker);
        await Promise.all(workers);
      } finally {
        lookupInProgressRef.current = false;
      }
    })();
  }, [state.assets]);


  return (
    <DevicePhotoSelectionContext.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
    {children}
    </DevicePhotoSelectionContext.Provider>
  );
};


export const useDevicePhotoSelectionContext = () => {
  const context = useContext(DevicePhotoSelectionContext);
  if (context === undefined) {
    throw new Error("useDevicePhotoSelectionContext must be used within a DevicePhotoSelectionProvider");
  }
  return context;
};

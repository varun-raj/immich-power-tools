import { listDuplicates, deleteAssets, updateAssets } from "@/handlers/api/asset.handler";
import { IDuplicateAssetRecord } from "@/types/asset";
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import VirtualizedDuplicateList from '@/components/assets/duplicate-assets/VirtualizedDuplicateList'
import Loader from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import { RefreshCw, Search } from 'lucide-react'

import { toast } from '@/components/ui/use-toast'
import { humanizeBytes } from '@/helpers/string.helper'

export default function BulkDuplicatePage() {
    const [duplicates, setDuplicates] = useState<IDuplicateAssetRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
    const [containerHeight, setContainerHeight] = useState<number>(600);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchDuplicates = async () => {
        setLoading(true);
        setError(null);
        try {
            const duplicates = await listDuplicates();
            setDuplicates(duplicates);
            setSelectedAssets(new Set()); // Clear selection when refetching
        } catch (error: any) {
            setError(error.message || 'Failed to load duplicate assets');
            toast({
                title: "Error",
                description: "Failed to load duplicate assets. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDuplicates();
    }, []);

    // Handle container height calculation and resize
    useEffect(() => {
        const updateHeight = () => {
            // Calculate available height: full viewport minus header (48px)
            const viewportHeight = window.innerHeight;
            const headerHeight = 48; // h-12 = 48px
            const availableHeight = viewportHeight - headerHeight;
            setContainerHeight(availableHeight);
        };

        // Initial calculation
        updateHeight();

        // Update on window resize
        window.addEventListener('resize', updateHeight);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, [duplicates]); // Re-calculate when duplicates change

    // Flatten all asset IDs for selection operations
    const allAssetIds = useMemo(() => {
        return duplicates.flatMap(record => record.assets.map(asset => asset.id));
    }, [duplicates]);

    const handleAssetSelect = useCallback((assetId: string, isShiftClick?: boolean) => {
        setSelectedAssets(prev => {
            const newSelection = new Set(prev);
            
            if (isShiftClick && lastSelectedIndex >= 0) {
                // Find the indices of the current and last selected assets
                const currentIndex = allAssetIds.indexOf(assetId);
                const start = Math.min(lastSelectedIndex, currentIndex);
                const end = Math.max(lastSelectedIndex, currentIndex);
                
                // Select all assets between the two indices
                for (let i = start; i <= end; i++) {
                    newSelection.add(allAssetIds[i]);
                }
                setLastSelectedIndex(currentIndex);
            } else {
                // Regular selection toggle
                if (newSelection.has(assetId)) {
                    newSelection.delete(assetId);
                } else {
                    newSelection.add(assetId);
                }
                setLastSelectedIndex(allAssetIds.indexOf(assetId));
            }
            
            return newSelection;
        });
    }, [allAssetIds, lastSelectedIndex]);



    const handleDeleteRecord = async (record: IDuplicateAssetRecord) => {
        setIsDeleting(true);
        try {
            const assetIds = record.assets.map(asset => asset.id);
            const totalSize = record.assets.reduce((sum, asset) => sum + asset.exifInfo.fileSizeInByte, 0);
            await deleteAssets(assetIds);
            
            // Remove the entire record from duplicates
            setDuplicates(prev => prev.filter(r => r.duplicateId !== record.duplicateId));
            
            // Remove any selected assets from this record
            setSelectedAssets(prev => {
                const newSelection = new Set(prev);
                assetIds.forEach(id => newSelection.delete(id));
                return newSelection;
            });
            
            setLastSelectedIndex(-1);
            
            toast({
                title: "Success",
                description: `Successfully deleted ${record.assets.length} duplicate assets and saved ${humanizeBytes(totalSize)} of storage.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete assets. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleKeepAllInRecord = useCallback(async (record: IDuplicateAssetRecord) => {
        setIsDeleting(true);
        try {
            const assetIds = record.assets.map(asset => asset.id);
            
            // Update assets to remove duplicateId (set to null)
            await updateAssets({
                ids: assetIds,
                duplicateId: null
            });
            
            // Remove the entire record from duplicates
            setDuplicates(prev => prev.filter(r => r.duplicateId !== record.duplicateId));
            
            // Remove any selected assets from this record
            setSelectedAssets(prev => {
                const newSelection = new Set(prev);
                assetIds.forEach(id => newSelection.delete(id));
                return newSelection;
            });
            
            setLastSelectedIndex(-1);
            
            toast({
                title: "Success",
                description: `Successfully kept ${record.assets.length} assets. They will no longer appear as duplicates.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to keep assets. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    }, [duplicates]);

    const handleKeepSelected = async (record: IDuplicateAssetRecord, selectedIds: string[], unselectedIds: string[]) => {
        setIsDeleting(true);
        try {
            const unselectedSize = record.assets
                .filter(asset => unselectedIds.includes(asset.id))
                .reduce((sum, asset) => sum + asset.exifInfo.fileSizeInByte, 0);

            // First, update selected assets to remove duplicateId (mark as kept)
            if (selectedIds.length > 0) {
                await updateAssets({
                    ids: selectedIds,
                    duplicateId: null
                });
            }

            // Then, delete unselected assets
            if (unselectedIds.length > 0) {
                await deleteAssets(unselectedIds);
            }
            
            // Remove the entire record from duplicates (since selected assets are no longer duplicates)
            setDuplicates(prev => prev.filter(r => r.duplicateId !== record.duplicateId));
            
            // Remove all assets from this record from selection
            setSelectedAssets(prev => {
                const newSelection = new Set(prev);
                [...selectedIds, ...unselectedIds].forEach(id => newSelection.delete(id));
                return newSelection;
            });
            
            setLastSelectedIndex(-1);
            
            toast({
                title: "Success",
                description: `Successfully kept ${selectedIds.length} assets and deleted ${unselectedIds.length} duplicates. Storage saved: ${humanizeBytes(unselectedSize)}.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to process selected assets. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };



    return (
        <PageLayout>
            <Header 
                leftComponent="Bulk Duplicate Finder"
                rightComponent={
                    <Button
                        onClick={fetchDuplicates}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </Button>
                }
            />

            <div className="h-full overflow-hidden">
                {/* Description - only show when loading or no duplicates */}
                {(loading || error || duplicates.length === 0) && (
                    <div className="p-6 pb-0">
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Manage and remove duplicate assets from your library
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-12 px-6">
                        <Loader />
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                            Scanning for duplicate assets...
                        </span>
                    </div>
                )}

                {error && (
                    <div className="px-6">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-red-600 dark:text-red-400">Error:</span>
                                <span className="text-red-800 dark:text-red-200">{error}</span>
                            </div>
                            <Button
                                onClick={fetchDuplicates}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}

                {!loading && !error && duplicates.length === 0 && (
                    <div className="text-center py-12 px-6">
                        <Search size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No duplicates found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Great! No duplicate assets were detected in your library.
                        </p>
                    </div>
                )}

                {!loading && !error && duplicates.length > 0 && (
                    <div ref={containerRef} style={{ height: containerHeight }} className="overflow-hidden">
                        <VirtualizedDuplicateList
                            duplicates={duplicates}
                            selectedAssets={selectedAssets}
                            onAssetSelect={handleAssetSelect}
                            onDeleteRecord={handleDeleteRecord}
                            onKeepSelected={handleKeepSelected}
                            onKeepAllInRecord={handleKeepAllInRecord}
                            height={containerHeight}
                        />
                    </div>
                )}
            </div>



            {isDeleting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                        <div className="flex items-center gap-3">
                            <Loader />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Deleting Assets
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Removing duplicate assets...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

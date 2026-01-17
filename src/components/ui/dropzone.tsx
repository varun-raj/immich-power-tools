import { useState, useEffect, ChangeEvent } from "react";

type DropzoneProps = {
  /**
   * *false*: dropzone always visible, user can click to select files\
   * *true*: dropzone visible only when user is dragging a file over the page
   */
  showOnDragOnly: boolean;
  supportedTypes: string[];
  onFilesDropped: (files: File[]) => void;
};

export function Dropzone({ showOnDragOnly, supportedTypes, onFilesDropped }: DropzoneProps) {
  const [dragDepth, setDragDepth] = useState(0);

  const isDragging = dragDepth > 0;

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const supportedFiles = selectedFiles.filter((file) =>
      supportedTypes.includes(file.type)
    );

    if (supportedFiles.length > 0) {
      onFilesDropped(supportedFiles);
    }
  };

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragDepth((d) => d + 1);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragDepth((d) => Math.max(0, d - 1));
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragDepth(0);

      if (!e.dataTransfer) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      const droppedSupportedFiles = droppedFiles.filter((file) =>
        supportedTypes.includes(file.type)
      );

      if (droppedSupportedFiles.length > 0) {
        onFilesDropped(droppedSupportedFiles);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onFilesDropped]);

  return (
    <>
      {(!showOnDragOnly || isDragging) && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none ${isDragging ? "bg-blue-100/30" : ""}`}>
          <label className="pointer-events-auto border-2 border-dashed border-gray-500 rounded-lg p-10 text-center cursor-pointer hover:bg-blue-100/30 transition-colors">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept={supportedTypes.join(",")}
            />
            {(showOnDragOnly && isDragging) ? (<div>Drop files anywhere to add</div>) : (<div>Drop files here or click to add</div>)}

          </label>
        </div>
      )}
    </>
  );
}

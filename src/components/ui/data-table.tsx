"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowSelectionChange?: (selectedIds: string[]) => void
  getRowId?: (row: TData) => string
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export interface DataTableRef<TData> {
  selectRows: (rowIds: string[]) => void
  selectAllRows: () => void
  deselectAllRows: () => void
  getSelectedRows: () => string[]
  clearSelection: () => void
}

const DataTable = React.forwardRef<DataTableRef<any>, DataTableProps<any, any>>(
  ({ columns, data, onRowSelectionChange, getRowId, searchValue, onSearchChange }, ref) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

    const table = useReactTable({
      data,
      columns,
      getRowId: getRowId || ((row: any) => row.id),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
      // Add these options to prevent potential issues
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSorting: true,
      enableFilters: true,
      enableColumnFilters: true,
    })

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      selectRows: (rowIds: string[]) => {
        const newSelection: Record<string, boolean> = {}
        rowIds.forEach(id => {
          newSelection[id] = true
        })
        setRowSelection(newSelection)
      },
      selectAllRows: () => {
        const allRowIds = table.getRowModel().rows.map(row => row.id)
        const newSelection: Record<string, boolean> = {}
        allRowIds.forEach(id => {
          newSelection[id] = true
        })
        setRowSelection(newSelection)
      },
      deselectAllRows: () => {
        setRowSelection({})
      },
      getSelectedRows: () => {
        return Object.keys(rowSelection).filter(id => rowSelection[id])
      },
      clearSelection: () => {
        setRowSelection({})
      },
    }), [table])

    // Sync external search with table filter
    React.useEffect(() => {
      if (searchValue !== undefined) {
        table.getColumn("albumName")?.setFilterValue(searchValue)
      }
    }, [searchValue, table])

    // Notify parent of selection changes
    React.useEffect(() => {
      const selectedRowIds = Object.keys(rowSelection).filter(id => rowSelection[id])
      onRowSelectionChange?.(selectedRowIds)
    }, [rowSelection, onRowSelectionChange])

    const handleShowAllColumns = () => {
      table.toggleAllColumnsVisible(true)
    }

    const handleHideAllColumns = () => {
      table.toggleAllColumnsVisible(false)
    }

    return (
      <div className="w-full">
        <div className="overflow-hidden rounded-md border">
          <TableRoot>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <ContextMenu key={header.id}>
                        <ContextMenuTrigger asChild>
                          <TableHead className="cursor-context-menu">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => header.column.toggleVisibility()}
                          >
                            {header.column.getIsVisible() ? "Hide Column" : "Show Column"}
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem onClick={handleShowAllColumns}>
                            Show All Columns
                          </ContextMenuItem>
                          <ContextMenuItem onClick={handleHideAllColumns}>
                            Hide All Columns
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            Column Visibility
                          </div>
                          {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                              return (
                                <ContextMenuItem
                                  key={column.id}
                                  onClick={() => column.toggleVisibility()}
                                  className="flex items-center justify-between"
                                >
                                  <span className="capitalize">{column.id}</span>
                                  <div className={`w-2 h-2 rounded-full ${column.getIsVisible() ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </ContextMenuItem>
                              )
                            })}
                        </ContextMenuContent>
                      </ContextMenu>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableRoot>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

DataTable.displayName = "DataTable"

export default DataTable
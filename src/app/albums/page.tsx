"use client";
import * as React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import * as XLSX from "xlsx";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { AlbumData } from "@/types/Album";
import { useRouter } from 'next/navigation';


const GET_ALBUMS = gql`
  query GetAlbums($options: PageQueryOptions) {
    albums(options: $options) {
      data {
        id
        title
        user {
          name
        }
      }
      meta {
        totalCount
      }
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

const CREATE_ALBUM = gql`
  mutation CreateAlbum($title: String!, $userId: ID!) {
    createAlbum(input: { title: $title, userId: $userId }) {
      id
      title
      user {
        name
      }
    }
  }
`;

export default function AlbumsPage() {
    const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_ALBUMS);
  const [deleteAlbum] = useMutation(DELETE_ALBUM);
  const [createAlbum] = useMutation(CREATE_ALBUM);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<{ [key: string]: boolean }>({});

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = React.useState("");
  const [newAlbumUserId, setNewAlbumUserId] = React.useState("");
  const [importData, setImportData] = React.useState<AlbumData[]>([]);
  const [isImportDialogOpen, setImportDialogOpen] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowClick = (id: any) => {
    console.log(id)
    router.push(`/albums/${id}`);
  };

  const columns: ColumnDef<{ id: string; title: string; user: { name: string } }>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const isChecked = table.getIsAllPageRowsSelected();
        const isIndeterminate = table.getIsSomePageRowsSelected() && !isChecked;
  
        return (
          <CustomCheckbox
            checked={isChecked}
            onChange={(value) => table.toggleAllPageRowsSelected(value)}
            indeterminate={isIndeterminate}
          />
        );
      },
      cell: ({ row }) => (
        <CustomCheckbox
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorFn: (row) => row.user.name,
      id: "user.name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("user.name")}</div>,
    },
  ];

  const table = useReactTable({
    data: data?.albums.data || [],
    columns,
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
  });

  if (loading) return <p>Loading albums...</p>;
  if (error) return <p>Error loading albums</p>;


  const handleAddAlbum = async () => {
    try {
      const { data: newAlbumData } = await createAlbum({
        variables: { title: newAlbumTitle, userId: newAlbumUserId },
      });
  
      console.log("New Album Data:", newAlbumData); 
  
      
      if (newAlbumData && newAlbumData.createAlbum) {
        console.log("Created Album:", newAlbumData.createAlbum);
      }
  
      
      
      console.log("Refetched Data:", data);
      setDialogOpen(false); 
      setNewAlbumTitle(""); 
      setNewAlbumUserId(""); 
    } catch (error) {
      console.error("Error adding album:", error);
    }
  };
  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);
    for (const id of selectedIds) {
      await deleteAlbum({ variables: { id } });
    }
    
    setRowSelection({});
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const jsonData: AlbumData[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        setImportData(jsonData); 
        setImportDialogOpen(true);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    for (const album of importData) {
      await createAlbum({ variables: { title: album.title, userId: album.userId } });
    }
    refetch();
    setImportDialogOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
       
      </div>

      <div className="flex gap-4 mb-4">
        <Button onClick={() => setDialogOpen(true)}>Add New Album</Button>
        <Button variant="destructive" onClick={handleBulkDelete} disabled={!Object.keys(rowSelection).length}>
          Delete Selected
        </Button>
        <input type="file" accept=".csv, .xlsx" onChange={(e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      handleImport(file); 
    }
  }} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Add New Album</DialogTitle>
          <Input placeholder="Album Title" value={newAlbumTitle} onChange={(e) => setNewAlbumTitle(e.target.value)} />
          <Input placeholder="User ID" value={newAlbumUserId} onChange={(e) => setNewAlbumUserId(e.target.value)} />
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAlbum}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogTitle>Import Albums</DialogTitle>
          <div className="max-h-64 overflow-auto">
            {importData.map((album, index) => (
              <div key={index} className="border-b py-2">
                <p>Title: {album.title}</p>
                <p>User ID: {album.userId}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmImport}>Confirm Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
  {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row ) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} onClick={() => handleRowClick(row.id)}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

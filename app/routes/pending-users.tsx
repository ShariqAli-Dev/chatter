// import { type LoaderFunctionArgs } from "@remix-run/node";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { type ColumnDef } from "@tanstack/react-table";
import PendingUsersTable from "~/components/PendingUsersTable";
import supabase from "~/lib/supabase.server";
import { APPROVAL_TYPE } from "~/utils/constants";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

export async function loader() {
  const payments: Payment[] = [
    {
      id: "1",
      amount: 100,
      status: "pending",
      email: "tryt@rtyty5.com",
    },
    {
      id: "2",
      amount: 100,
      status: "processing",
      email: "asdasd@asdasd.com",
    },
    {
      id: "3",
      amount: 100,
      status: "success",
      email: "5rtyy@556.com",
    },
  ];
  return json({ payments: payments });
  const { data, error } = await supabase
    .from("user")
    .select("id, created_at, email, handle, approval_type,first_name,last_name")
    .in("approval_type", [APPROVAL_TYPE.PENDING.ID, APPROVAL_TYPE.DENIED.ID]);
  if (error) {
    console.log(error);
  }

  return json({ pendingUsers: data });
}

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "id", header: () => <p className="text-xl">ID</p> },
  { accessorKey: "status", header: () => <p className="text-xl">STATUS</p> },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xl"
        >
          Email
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <p className="text-xl text-right">AMOUNT</p>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium text-right">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export default function PendingUsers() {
  const { payments } = useLoaderData();
  const navigate = useNavigate();
  return (
    <>
      <header className="flex items-center flex-between">
        <ArrowLeftIcon
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 cursor-pointer"
        />
        <h1 className="flex-1 text-4xl font-bold text-center">PENDING USERS</h1>
        <ReloadIcon className="w-10 h-10 cursor-pointer" />
      </header>
      <main>
        <PendingUsersTable data={payments} columns={columns} />
      </main>
    </>
  );
}

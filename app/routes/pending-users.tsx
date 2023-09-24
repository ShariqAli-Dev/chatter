import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import PendingUsersTable from "~/components/PendingUsersTable";
import { Button } from "~/components/ui/button";
import supabase from "~/lib/supabase.server";
import { APPROVAL_TYPE } from "~/utils/constants";
import { type ActionData } from "~/utils/types";

interface User {
  id: string;
  created_at: string;
  email: string;
  handle: string | null;
  approval_type: number & {
    type: string;
  };
  first_name: string;
  last_name: string;
}

export async function loader() {
  const { data, error } = await supabase
    .from("user")
    .select(
      "id, created_at, email, handle, approval_type,first_name,last_name, approval_type(type)"
    )
    .in("approval_type", [APPROVAL_TYPE.PENDING.ID, APPROVAL_TYPE.DENIED.ID]);
  if (error) {
    console.log(error);
  }
  return json({ pendingUsers: data ?? [] });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    let formData = await request.formData();
    let { _action, ...values } = Object.fromEntries(formData);

    if (_action === "get_user_documents") {
      const { data: userDocuments, error } = await supabase.storage
        .from("user_documents")
        .list(`${values.id}/pending`);
      if (error || !userDocuments)
        return json<ActionData>({
          status: 404,
          errors: [error],
          message: "error fetching documents",
        });

      const imageUrls: string[] = [];
      for (const document of userDocuments) {
        const { data, error } = await supabase.storage
          .from("user_documents")
          .createSignedUrl(`${values.id}/pending/${document.name}`, 5);
        if (error?.message || !data?.signedUrl)
          return json<ActionData>({
            status: 404,
            errors: [error],
            message: "error fetching signed urls",
          });
        imageUrls.push(data.signedUrl);
      }

      return json<ActionData>({
        status: 200,
        message: "documents fetched",
        id: "get_user_documents",
        data: imageUrls,
      });
    }
    return json<ActionData>({ status: 404, message: "no action taken" });
  } catch (e: any) {
    return json<ActionData>({
      status: 500,
      errors: [e],
      message: "uncalled for server error",
    });
  }
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <p className="text-2xl">NAME</p>,
    cell: ({ row }) => {
      const fullName = row.original.first_name + " " + row.original.last_name;
      return <p>{fullName}</p>;
    },
  },
  {
    accessorKey: "email",
    header: () => {
      return <p className="text-2xl">EMAIL</p>;
    },
  },
  {
    accessorKey: "approval_type.type",
    header: () => <p className="text-2xl">STATUS</p>,
  },
  {
    id: "documents",
    header: () => <p className="text-2xl">DOCUMENTS</p>,
    cell: ({ row }) => {
      return (
        <Form method="post">
          <input type="hidden" name="id" value={row.original.id} />
          <Button
            type="submit"
            name="_action"
            value="get_user_documents"
            size="sm"
          >
            Get Documents
          </Button>
        </Form>
      );
    },
  },
  {
    header: () => <p className="text-2xl">ACTIONS</p>,
    id: "actions",
    cell: ({ row }) => {
      return <Button size="sm">lemme do my thing</Button>;
    },
  },
];

export default function PendingUsers() {
  const { pendingUsers } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.id === "get_user_documents") {
      const imageUrls = actionData.data as string[];
      imageUrls.forEach((url) => {
        window.open(url, "_blank");
      });
    }
    if (actionData?.errors?.length) {
      alert("there has been an error");
    }
  }, [actionData]);

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
        <PendingUsersTable data={pendingUsers} columns={columns} />
      </main>
    </>
  );
}

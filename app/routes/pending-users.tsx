import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import PendingUsersTable from "~/components/PendingUsersTable";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import supabase from "~/lib/supabase.server";
import { cn } from "~/lib/utils";
import { type OutletContext } from "~/root";
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
  const { data } = await supabase
    .from("user")
    .select(
      "id, created_at, email, handle, approval_type,first_name,last_name, approval_type(type)"
    )
    .in("approval_type", [APPROVAL_TYPE.PENDING.ID, APPROVAL_TYPE.DENIED.ID]);
  return json({ pendingUsers: data ?? [] });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "get_user_documents") {
      const { data: userDocuments, error } = await supabase.storage
        .from("user_documents")
        .list(`${values.id}/pending`);
      if (error || !userDocuments)
        return json<ActionData>({
          success: false,
          status: 404,
          errors: [error],
          message: "There was an error fetching user documents",
        });

      const imageUrls: string[] = [];
      for (const document of userDocuments) {
        const { data, error } = await supabase.storage
          .from("user_documents")
          .createSignedUrl(`${values.id}/pending/${document.name}`, 5);
        if (error?.message || !data?.signedUrl)
          return json<ActionData>({
            success: false,
            status: 404,
            errors: [error],
            message: "There was an error fetcthing the document's url",
          });
        imageUrls.push(data.signedUrl);
      }

      return json<ActionData>({
        success: true,
        status: 200,
        id: "get_user_documents",
        data: imageUrls,
      });
    } else if (_action === "deny_user") {
      const { error } = await supabase
        .from("user")
        .update({
          approve_date: new Date().toISOString(),
          approved_by: values.admin_id as string,
          approval_type: APPROVAL_TYPE.DENIED.ID,
        })
        .match({ id: values.id });
      if (error)
        return json<ActionData>({
          status: 500,
          errors: [error],
          message: "There was an error denying the user",
          success: false,
        });
      return json<ActionData>({
        status: 200,
        success: true,
        id: "deny_user",
      });
    } else if (_action === "approve_user") {
      if (!(values.approval_type as string).length)
        return json<ActionData>({
          status: 400,
          message: "Please select an approval type",
          success: false,
        });
      const adminId = values.admin_id as string;
      const approvalTypeId = parseInt(values.approval_type as string);
      const userId = values.id as string;
      const { error } = await supabase
        .from("user")
        .update({
          approve_date: new Date().toISOString(),
          approved_by: adminId,
          approval_type: approvalTypeId,
        })
        .match({ id: userId });
      if (error) {
        return json<ActionData>({
          status: 500,
          success: false,
          errors: [error],
          message: "Error updating the user's status",
        });
      }
      return json<ActionData>({
        id: "approve_user",
        status: 200,
        success: true,
      });
    }
    return json<ActionData>({
      status: 400,
      message: "No action taken",
      success: false,
    });
  } catch (e: any) {
    return json<ActionData>({
      status: 500,
      errors: [e],
      message: "The server has encountered an error",
      success: false,
    });
  }
}

export default function PendingUsers() {
  const { toast } = useToast();
  const { pendingUsers } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const { adminId } = useOutletContext<OutletContext>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
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
              disabled={isSubmitting}
              type="submit"
              name="_action"
              value="get_user_documents"
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
        return (
          <div className="flex items-center justify-between ">
            <Form method="post">
              <input type="hidden" name="id" value={row.original.id} />
              <input type="hidden" name="admin_id" value={adminId} />
              <Button
                disabled={isSubmitting}
                type="submit"
                name="_action"
                value="approve_user"
              >
                Approve
              </Button>
              <Select name="approval_type">
                <SelectTrigger className="border border-black">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {row.original.approval_type.type !==
                    APPROVAL_TYPE.ACCREDITED.TYPE && (
                    <SelectItem value={APPROVAL_TYPE.ACCREDITED.ID.toString()}>
                      Accredited
                    </SelectItem>
                  )}
                  {row.original.approval_type.type !==
                    APPROVAL_TYPE.QUALIFIED.TYPE && (
                    <SelectItem value={APPROVAL_TYPE.QUALIFIED.ID.toString()}>
                      Qualified
                    </SelectItem>
                  )}
                  {row.original.approval_type.type !==
                    APPROVAL_TYPE.RETAIL.TYPE && (
                    <SelectItem value={APPROVAL_TYPE.RETAIL.ID.toString()}>
                      Retail
                    </SelectItem>
                  )}
                  {row.original.approval_type.type !==
                    APPROVAL_TYPE.PENDING.TYPE && (
                    <SelectItem value={APPROVAL_TYPE.PENDING.ID.toString()}>
                      Pending
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Form>
            {row.original.approval_type.type !== APPROVAL_TYPE.DENIED.TYPE && (
              <Form method="post">
                <input type="hidden" name="id" value={row.original.id} />
                <input type="hidden" name="admin_id" value={adminId} />
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  name="_action"
                  value="deny_user"
                >
                  Deny
                </Button>
              </Form>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (actionData?.success === false) {
      toast({
        title: "Error",
        description: actionData.message,
        variant: "destructive",
      });
      return console.log({ errors: actionData.errors });
    }
    if (actionData?.id === "get_user_documents") {
      const imageUrls = actionData.data as string[];
      imageUrls.forEach((url) => {
        window.open(url, "_blank");
      });
    } else if (actionData?.id === "approve_user") {
      toast({
        title: "Success",
        description: "Successfully updated user's status",
      });
    }
  }, [actionData, toast]);

  const navigate = useNavigate();
  return (
    <>
      <header className="flex items-center flex-between">
        <ArrowLeftIcon
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 cursor-pointer"
        />
        <h1 className="flex-1 text-4xl font-bold text-center">PENDING USERS</h1>
        <ReloadIcon
          className={cn("w-10 h-10 cursor-pointer", {
            "animate-spin": isSubmitting,
          })}
        />
      </header>
      <main>
        <PendingUsersTable data={pendingUsers} columns={columns} />
      </main>
    </>
  );
}

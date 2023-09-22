// import { type LoaderFunctionArgs } from "@remix-run/node";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import supabase from "~/lib/supabase.server";
import { APPROVAL_TYPE } from "~/utils/constants";

export async function loader() {
  const { data, error } = await supabase
    .from("user")
    .select("id, created_at, email, handle, approval_type,first_name,last_name")
    .in("approval_type", [APPROVAL_TYPE.PENDING.ID, APPROVAL_TYPE.DENIED.ID]);
  if (error) {
    console.log(error);
  }

  return json({ pendingUsers: data });
}

export default function PendingUsers() {
  const { pendingUsers } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  console.log(pendingUsers);
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
      <main></main>
    </>
  );
}

// import { type LoaderFunctionArgs } from "@remix-run/node";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@remix-run/react";
// export async function loader({}: LoaderFunctionArgs) {}

export default function PendingUsers() {
  const navigate = useNavigate();
  return (
    <>
      <header className="flex items-center flex-between">
        <ArrowLeftIcon
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 cursor-pointer"
        />
        <h1 className="flex-1 text-4xl font-bold text-center">PENDING USERS</h1>
        <div className="w-10" />
      </header>
      <main></main>
    </>
  );
}

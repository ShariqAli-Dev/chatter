import { type MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { type OutletContext } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "Medici Admin" },
    { name: "Medici Admin Name", content: "Medici Admin Content" },
  ];
};

export default function Index() {
  const { supabase } = useOutletContext<OutletContext>();
  async function login() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      alert("there was an error logging in");
      console.error(error);
      supabase.auth.signOut();
    }
  }

  return (
    <main className="flex flex-col items-center justify-center flex-1">
      <h1 className="text-5xl">The Medici Project</h1>
      <Button onClick={login} className="mt-5 text-2xl w-60 h-15">
        Admin Login
      </Button>
    </main>
  );
}

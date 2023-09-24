import { Link, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { type OutletContext } from "~/root";

export default function Dashboard() {
  const { supabase } = useOutletContext<OutletContext>();
  const [email, setEmail] = useState<string>();

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("there was an error logging out");
      console.error(error);
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, [supabase]);

  return (
    <>
      <header>
        <h1 className="text-4xl font-bold text-center">THE MEDICI PROJECT</h1>
      </header>
      <main className="flex justify-around flex-1 p-3 ">
        <div className="w-[45%] h-full">
          <section className="p-1 border border-black">
            <h2 className="text-3xl font-bold">{email}</h2>
            <Button onClick={logout}>logout</Button>
          </section>
          <section className="p-1 mt-8 border border-black">
            <h2 className="text-3xl font-bold">Medici Fund Info</h2>
            <h3 className="text-xl">Totas Users</h3>
            <h3 className="text-xl">Total $$</h3>
            <h3 className="text-xl">Trailing 30 day performance</h3>
          </section>
          <section className="flex flex-wrap gap-3 p-1 mt-8 border border-black">
            <h2 className="w-full text-3xl font-bold ">Pending Things</h2>
            <Button variant="link" asChild>
              <Link to="/pending-users">Pending Users</Link>
            </Button>
            <Button variant="link" asChild>
              <Link to="/dashboard">Pending Divestments</Link>
            </Button>
            <Button variant="link" asChild>
              <Link to="/dashboard">Total Pending Divestments</Link>
            </Button>
          </section>
        </div>
        <section className="w-[45%]">
          <h2>buttons that do things</h2>
        </section>
      </main>
    </>
  );
}

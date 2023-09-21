import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { type OutletContext } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("there was an error logging out");
      console.error(error);
    }
  }

  return (
    <main>
      <h1>medici admin</h1>
      <button onClick={login}>login</button>
      <button onClick={logout}>logout</button>
    </main>
  );
}

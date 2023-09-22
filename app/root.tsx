import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { type Database } from "utils/dbTypes";

export interface OutletContext {
  supabase: SupabaseClient<Database>;
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader(_: LoaderFunctionArgs) {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_KEY: process.env.SUPABASE_KEY!,
    ADMIN_ACCOUNTS: process.env.ADMIN_ACCOUNTS?.split(", "),
  };

  return json({ env });
}

export default function App() {
  const { env } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY)
  );
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      } else {
        const userIsAdmin = env.ADMIN_ACCOUNTS!.includes(session.user.email!);
        if (!userIsAdmin) {
          supabase.auth.signOut();
          navigate("/");
        } else {
          navigate("dashboard");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ supabase }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

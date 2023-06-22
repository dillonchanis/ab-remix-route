import {
  type V2_MetaFunction,
  type DataFunctionArgs,
  json,
} from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { session } from "~/session.server";

const KEY = "ab-test-remix";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: DataFunctionArgs) => {
  const s = await session.getSession(request.headers.get("Cookie"));

  const data = await request.text();
  const formData = new URLSearchParams(data);
  const variant = formData.get("variant");

  s.set(KEY, variant);

  return json(null, {
    headers: {
      "Set-Cookie": await session.commitSession(s),
    },
  });
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const s = await session.getSession(request.headers.get("Cookie"));

  let variant = s.get(KEY);

  if (typeof variant !== "string" || !variant.length) {
    variant = Math.random() > 0.5 ? "a" : "b";
  }

  s.set(KEY, variant);

  return json(
    { variant },
    {
      headers: {
        "Set-Cookie": await session.commitSession(s),
      },
    }
  );
};

export default function Index() {
  const { variant } = useLoaderData();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>A/B Test</h1>

      <p>You are in variant: {variant ? variant : "n/a"}</p>

      <Form style={{ marginTop: "24px" }} method="POST" replace>
        <input type="hidden" name="variant" value="" />
        <button type="submit">Reload Variant</button>
      </Form>
    </main>
  );
}

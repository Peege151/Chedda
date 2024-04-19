import {
    Form,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import invariant from "tiny-invariant";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { getBeat } from "~/models/beat.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    console.log('Loader', params)
    const userId = await requireUserId(request);
    invariant(params.beatId, "beatId not found");

    const beat = await getBeat({ id: params.beatId, userId });
    if (!beat) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ beat });
};

export default function BeatDetailsPage() {
    const data = useLoaderData<typeof loader>();
    console.log('Data of Obj?', data);
    return (
        <div>
            <h3 className="text-2xl font-bold">{data.beat.title}</h3>
            <hr className="my-4" />
            <audio controls preload='auto'>
              <source src={'https://sullysoft-chedda.s3.us-east-2.amazonaws.com/example_mp3.mp3'} />
            </audio>
            <Form method="post">
                <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Delete
                </button>
            </Form>
        </div>
    );
}
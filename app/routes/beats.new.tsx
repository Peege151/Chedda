import type { ActionFunctionArgs, UploadHandler } from "@remix-run/node";
import { prisma } from "~/db.server";

import {
    json, 
    redirect, 
    unstable_createFileUploadHandler,
    unstable_parseMultipartFormData,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { createBeat } from "~/models/beat.server";
import { requireUserId } from "~/session.server";
import path from 'path';
import {TagsList} from '../components/TagsList';
import { s3UploadHandler } from "~/utils/s3.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno

export const loader = async ({
    params,
  }: LoaderFunctionArgs) => {
    return json(
      await prisma.tag.findMany({})
    );
  };

export const action = async ({ request }: ActionFunctionArgs) => {
    const uploadHandler: UploadHandler = composeUploadHandlers(
        s3UploadHandler,
        createMemoryUploadHandler(),
      );
    const clonedData = request.clone()
    const formDatas = await clonedData.formData()

    const title = formDatas.get("title");
    const bpm = formDatas.get("bpm")?.toString() || '';
    const tags = formDatas.getAll('tags');
    const userId = await requireUserId(request);

    if (typeof title !== "string" || title.length === 0) {
        return json(
            {
                errors: {
                    title: "Title is required",
                    bpm: 'how fast is this?',
                    file: 'need to upload a file'
                }
            },
            { status: 400 },
        );
    }

    
    if (typeof title !== "string" || title.length === 0) {
            return json(
                    {
                            errors: {
                                    title: "Title is required",
                                    bpm: 'how fast is this?',
                                    file: 'need to upload a file'
                                }
                            },
                            { status: 400 },
                        );
                    }

    const formData = await unstable_parseMultipartFormData(
        request,
        uploadHandler // <-- we'll look at this deeper next
    );

    const file = formData.get('file');
    console.log('File Here?', file);
    
    //const beat = await createBeat({ title: title, bpm: bpm, tags: tags, user: userId });

    if (typeof file == 'string') {
        console.log('Success', file);
        const tagsArr = tags.map(tag => {
            return {id: Number(tag)}
        })
        console.log('Tags in here?', tagsArr);
        const beatWithFile = await createBeat({ 
            title: title,
            bpm: bpm, 
            file: file,
            tags: tagsArr
        });
        console.log('This Work?', beatWithFile)
        return redirect(`/beats/${beatWithFile.id}`);

    } else {
       return redirect(`/beats/new}`);
    }

};

export default function NewBeatPage() {
    const actionData = useActionData<typeof action>();
    const titleRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const bpmRef = useRef<HTMLInputElement>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const fetchedTags = useLoaderData<typeof loader>() || ['loading'];
    useEffect(() => {
        if (actionData?.errors?.title) {
            titleRef.current?.focus();
        } else if (actionData?.errors.bpm) {

        }
    }, [actionData]);

    return (
        <Form
            encType="multipart/form-data"
            method="post"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
            }}
        >
            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>Title: </span>
                    <input
                        ref={titleRef}
                        name="title"
                        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                        aria-invalid={actionData?.errors?.title ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.title ? "title-error" : undefined
                        }
                    />
                </label>
                {actionData?.errors?.title ? (
                    <div className="pt-1 text-red-700" id="title-error">
                        {actionData.errors.title}
                    </div>
                ) : null}
            </div>
            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>BPM: </span>
                    <input
                        ref={bpmRef}
                        name="bpm"
                        type='number'
                        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                        aria-invalid={actionData?.errors?.bpm ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.bpm ? "bpm-error" : undefined
                        }
                    />
                </label>
                {actionData?.errors?.bpm ? (
                    <div className="pt-1 text-red-700" id="bpm-error">
                        {actionData.errors.bpm}
                    </div>
                ) : null}
            </div>

            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>File: </span>
                    <input
                        ref={fileRef}
                        name="file"
                        type='file'
                        className="w-full flex-1 px-3 py-2 text-lg leading-6"
                        aria-invalid={actionData?.errors?.file ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.file ? "body-error" : undefined
                        }
                    />
                </label>
                {actionData?.errors?.file ? (
                    <div className="pt-1 text-red-700" id="body-error">
                        {actionData.errors.file}
                    </div>
                ) : null}
            </div>

            <TagsList fetchedTags={fetchedTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            {fetchedTags.map((product) => (
                <div key={product.id}>{product.name}</div>
            ))}
            <div className="text-right">
                <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Upload Beat
                </button>
            </div>
        </Form>
    );
}

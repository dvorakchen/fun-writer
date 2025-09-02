import OpenAI from "openai";
import { OPENAI_KEY, OPENAI_BASEURL } from '$env/static/private'
import type { ChatCompletionMessageParam } from "openai/resources";
import type { RequestEvent } from "@sveltejs/kit";
import { getByUrlQueryString } from "@/lib/utils";
import { MARK_END_CONNECTION, MARK_SSE_ID, SSE, sseManager } from "@/net/sse";
import { articleDesignPrompt } from "..";

export async function GET({ request }: RequestEvent) {
    const text = getByUrlQueryString(request.url, 'text') ?? '';

    const client = new OpenAI({
        baseURL: OPENAI_BASEURL,
        apiKey: OPENAI_KEY,
    });

    const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: articleDesignPrompt(text) }
    ];

    const httpCtl = new AbortController();

    const stream = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        stream: true,
    }, { signal: httpCtl.signal });

    const respStream = new ReadableStream({
        async start(controller) {

            const sseId = sseManager.add(new SSE(httpCtl, controller));
            controller.enqueue(`data: ${MARK_SSE_ID}:${sseId}\n\n`);

            for await (const event of stream) {
                const content = event.choices[0]!.delta?.content ?? '';
                controller.enqueue(`data: ${content}\n\n`);

            }
            controller.enqueue(`data: ${MARK_END_CONNECTION}\n\n`);
            controller.close();
        }
    });

    return new Response(respStream, {
        status: 200, headers: [
            ['Content-Type', 'text/event-stream'],
            ['Cache-Control', 'no-cache'],
            ['Connection', 'keep-alive'],
            ['X-Accel-Buffering', 'no'],
        ]
    });
}

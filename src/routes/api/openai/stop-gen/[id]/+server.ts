import { sseManager } from "@/net/sse";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ params }: RequestEvent) {
    const id = params.id ?? '';

    sseManager.stop(id);

    return new Response(null, { status: 200 });
}
export const MARK_END_CONNECTION = '-------------END-------------';
export const MARK_SSE_ID = '-------------SSE-ID-------------';

export class SSE {
    constructor(public httpCtl: AbortController, public streamCtl: ReadableStreamDefaultController) {
    }

}

class SSEManager {
    private sseMap: Map<string, SSE> = new Map();

    public add(sse: SSE): string {
        const id = Bun.randomUUIDv7();
        this.sseMap.set(id, sse)
        return id;
    }

    public stop(id: string) {
        const val = this.sseMap.get(id);
        if (!val) {
            console.log(`sseId has not found: `, id)
            return;
        }

        try {
            val.streamCtl.close();
        } catch (e) {
            console.error('SSEManager stop SSE streamCtl error: ', id, e);
        }

        try {
            val.httpCtl.abort();
        } catch (e) {
            console.error('SSEManager stop SSE httpCtl error: ', id, e);
        }
    }
}

export const sseManager = new SSEManager();
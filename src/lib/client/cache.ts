import { } from 'luxon';

class GuestPreGen {
    private readonly _key = 'GUEST_PRE_GEN';
    private readonly _countKey = 'Guest_GEN_COUNT';

    public readonly MAX_COUNT = 1;

    /**
     * 获取游客上一次生成的内容
     */
    public retrieve(): string {
        return localStorage.getItem(this._key) ?? '';
    }

    public store(text: string) {
        localStorage.setItem(this._key, text);
    }

    public get count(): number {
        return parseInt(localStorage.getItem(this._countKey) ?? '0');
    }

    public increaseCount(): void {
        let tmp = this.count;
        tmp++;

        localStorage.setItem(this._countKey, tmp.toString());
    }
}

export const guestPreGen = new GuestPreGen();
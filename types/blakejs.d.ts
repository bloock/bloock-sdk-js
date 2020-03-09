declare module 'blakejs' {
    export function blake2bHex(input: Uint8Array, key: string | null, outlen: number): string;
}

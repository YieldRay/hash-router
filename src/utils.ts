export function removeHeadHash(hash: string): string {
    const removeHash = hash.startsWith("#") ? hash.slice(1) : hash;
    return removeHash.startsWith("/") ? removeHash : "/" + removeHash;
}
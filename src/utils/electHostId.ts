/**
 * Elects the room host from the peers a client knows about.
 * Every peer lists itself first, so list order differs per client; the lowest peer id
 * is the same on all of them, and moves to the next lowest when the host leaves.
 * @param peerIds - Ids of every connected player, in any order.
 * @returns The host's peer id, or an empty string for an empty room.
 */
export const electHostId = (peerIds: string[]): string => [...peerIds].sort()[0] ?? ''

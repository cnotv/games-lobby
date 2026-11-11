// Trystero picks its Nostr signalling relays from this id. The default id lands on public relays
// that refuse the traffic (proof of work, rate limits, ephemeral events blocked), so peers never find each other.
export const P2P_CONFIG = { appId: 'cnotv-games' }

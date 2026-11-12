// Trystero picks its Nostr signalling relays from this id. The default id lands on public relays
// that refuse the traffic (proof of work, rate limits, ephemeral events blocked), so peers never find each other.
// Pinned relays were each seen delivering peers in a real two-page join; redundancy 5 uses them all.
export const P2P_CONFIG = {
  appId: 'cnotv-games',
  relayUrls: [
    'wss://relay.angor.io',
    'wss://relay.satlantis.io',
    'wss://relay.mostro.network',
    'wss://relay.snort.social',
    'wss://nostr.oxtr.dev'
  ],
  relayRedundancy: 5
}

import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const GAMEPAD_POLL_MS = 1000

const isGamepadPlugged = (): boolean =>
  (navigator.getGamepads?.() ?? []).some((pad) => pad !== null && pad.connected)

/**
 * Whether a gamepad is plugged in. A browser reports one only after its first button press, and
 * a disconnect can go unreported, so it is polled as well as listened for.
 * @returns a reactive flag that follows the gamepad being plugged in or out
 */
export const useGamepadPlugged = (): Ref<boolean> => {
  const plugged = ref(isGamepadPlugged())
  const refresh = (): void => {
    plugged.value = isGamepadPlugged()
  }
  const pollTimer = ref(0)

  onMounted(() => {
    window.addEventListener('gamepadconnected', refresh)
    window.addEventListener('gamepaddisconnected', refresh)
    pollTimer.value = window.setInterval(refresh, GAMEPAD_POLL_MS)
  })
  onUnmounted(() => {
    window.removeEventListener('gamepadconnected', refresh)
    window.removeEventListener('gamepaddisconnected', refresh)
    window.clearInterval(pollTimer.value)
  })
  return plugged
}

/**
 * Whether the main pointer is a finger, which is when the on-screen faux-pad is of any use.
 * @returns true on a touch screen
 */
export const isTouchScreen = (): boolean => window.matchMedia('(pointer: coarse)').matches

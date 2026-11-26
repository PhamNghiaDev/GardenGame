import type { HowlOptions } from 'howler'
import { useGameStore } from '../store/gameStore'

let engine: Promise<typeof import('howler')> | undefined

/** M8 can create sounds on demand from a user gesture. */
export async function createSound(options: HowlOptions) {
  engine ??= import('howler')
    .then((module) => {
      module.Howler.mute(useGameStore.getState().save.audioMuted)
      useGameStore.subscribe((state, previous) => {
        if (state.save.audioMuted !== previous.save.audioMuted) {
          module.Howler.mute(state.save.audioMuted)
        }
      })
      return module
    })
    .catch((error) => {
      engine = undefined
      throw error
    })

  const { Howl } = await engine
  return new Howl(options)
}

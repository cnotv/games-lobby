import type { GameAudioId, MusicTrack, SfxDefinition } from '@/types/gameAudio'

// Written by ear: tones are (wave, start Hz, end Hz, seconds, volume, optional delay).
export const GAME_SFX: Partial<Record<GameAudioId, Record<string, SfxDefinition>>> = {
  pictionary: {
    start: [
      {
        waveType: 'triangle',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.18,
        volume: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.18,
        volume: 0.18,
        delaySeconds: 0.07
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.18,
        volume: 0.18,
        delaySeconds: 0.14
      }
    ],
    pick: [
      {
        waveType: 'square',
        startFrequency: 440,
        endFrequency: 660,
        durationSeconds: 0.1,
        volume: 0.12
      }
    ],
    correct: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.22,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.22,
        volume: 0.2,
        delaySeconds: 0.08
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.22,
        volume: 0.2,
        delaySeconds: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.22,
        volume: 0.2,
        delaySeconds: 0.24
      }
    ],
    close: [
      {
        waveType: 'sine',
        startFrequency: 330,
        endFrequency: 330,
        durationSeconds: 0.12,
        volume: 0.14
      },
      {
        waveType: 'sine',
        startFrequency: 330,
        endFrequency: 330,
        durationSeconds: 0.12,
        volume: 0.14,
        delaySeconds: 0.15
      }
    ],
    hint: [
      {
        waveType: 'sine',
        startFrequency: 880,
        endFrequency: 1320,
        durationSeconds: 0.14,
        volume: 0.1
      }
    ],
    tick: [
      {
        waveType: 'square',
        startFrequency: 1000,
        endFrequency: 1000,
        durationSeconds: 0.04,
        volume: 0.08
      }
    ],
    fill: [
      {
        waveType: 'triangle',
        startFrequency: 300,
        endFrequency: 150,
        durationSeconds: 0.12,
        volume: 0.16
      }
    ],
    clear: [
      {
        waveType: 'sawtooth',
        startFrequency: 600,
        endFrequency: 80,
        durationSeconds: 0.25,
        volume: 0.1
      }
    ],
    roundEnd: [
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.25,
        volume: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.25,
        volume: 0.18,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.25,
        volume: 0.18,
        delaySeconds: 0.2
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  wordle: {
    start: [
      {
        waveType: 'sine',
        startFrequency: 440,
        endFrequency: 440,
        durationSeconds: 0.2,
        volume: 0.18
      },
      {
        waveType: 'sine',
        startFrequency: 554,
        endFrequency: 554,
        durationSeconds: 0.2,
        volume: 0.18,
        delaySeconds: 0.08
      },
      {
        waveType: 'sine',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.2,
        volume: 0.18,
        delaySeconds: 0.16
      }
    ],
    key: [
      {
        waveType: 'square',
        startFrequency: 700,
        endFrequency: 600,
        durationSeconds: 0.04,
        volume: 0.07
      }
    ],
    delete: [
      {
        waveType: 'square',
        startFrequency: 500,
        endFrequency: 380,
        durationSeconds: 0.05,
        volume: 0.07
      }
    ],
    reveal: [
      {
        waveType: 'triangle',
        startFrequency: 420,
        endFrequency: 560,
        durationSeconds: 0.09,
        volume: 0.14
      }
    ],
    invalid: [
      {
        waveType: 'sawtooth',
        startFrequency: 180,
        endFrequency: 120,
        durationSeconds: 0.2,
        volume: 0.12
      }
    ],
    solved: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.25,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.25,
        volume: 0.2,
        delaySeconds: 0.09
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.25,
        volume: 0.2,
        delaySeconds: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.25,
        volume: 0.2,
        delaySeconds: 0.27
      }
    ],
    failed: [
      {
        waveType: 'sine',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.3,
        volume: 0.18
      },
      {
        waveType: 'sine',
        startFrequency: 330,
        endFrequency: 330,
        durationSeconds: 0.3,
        volume: 0.18,
        delaySeconds: 0.14
      },
      {
        waveType: 'sine',
        startFrequency: 262,
        endFrequency: 262,
        durationSeconds: 0.3,
        volume: 0.18,
        delaySeconds: 0.28
      }
    ],
    roundEnd: [
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.25,
        volume: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.25,
        volume: 0.16,
        delaySeconds: 0.12
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  squares: {
    start: [
      {
        waveType: 'square',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.14,
        volume: 0.1
      },
      {
        waveType: 'square',
        startFrequency: 494,
        endFrequency: 494,
        durationSeconds: 0.14,
        volume: 0.1,
        delaySeconds: 0.07
      },
      {
        waveType: 'square',
        startFrequency: 587,
        endFrequency: 587,
        durationSeconds: 0.14,
        volume: 0.1,
        delaySeconds: 0.14
      }
    ],
    select: [
      {
        waveType: 'triangle',
        startFrequency: 500,
        endFrequency: 560,
        durationSeconds: 0.06,
        volume: 0.12
      }
    ],
    word: [
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.16,
        volume: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 880,
        endFrequency: 880,
        durationSeconds: 0.16,
        volume: 0.18,
        delaySeconds: 0.06
      },
      {
        waveType: 'triangle',
        startFrequency: 1175,
        endFrequency: 1175,
        durationSeconds: 0.16,
        volume: 0.18,
        delaySeconds: 0.12
      }
    ],
    invalid: [
      {
        waveType: 'sawtooth',
        startFrequency: 200,
        endFrequency: 130,
        durationSeconds: 0.16,
        volume: 0.11
      }
    ],
    roundEnd: [
      {
        waveType: 'triangle',
        startFrequency: 587,
        endFrequency: 587,
        durationSeconds: 0.22,
        volume: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 494,
        endFrequency: 494,
        durationSeconds: 0.22,
        volume: 0.16,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.22,
        volume: 0.16,
        delaySeconds: 0.2
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  minigolf: {
    start: [
      {
        waveType: 'triangle',
        startFrequency: 330,
        endFrequency: 330,
        durationSeconds: 0.2,
        volume: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 415,
        endFrequency: 415,
        durationSeconds: 0.2,
        volume: 0.16,
        delaySeconds: 0.08
      },
      {
        waveType: 'triangle',
        startFrequency: 494,
        endFrequency: 494,
        durationSeconds: 0.2,
        volume: 0.16,
        delaySeconds: 0.16
      }
    ],
    putt: [
      {
        waveType: 'sine',
        startFrequency: 220,
        endFrequency: 90,
        durationSeconds: 0.12,
        volume: 0.28
      },
      {
        waveType: 'square',
        startFrequency: 1800,
        endFrequency: 900,
        durationSeconds: 0.03,
        volume: 0.08
      }
    ],
    hole: [
      {
        waveType: 'sine',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.22
      },
      {
        waveType: 'sine',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.3,
        volume: 0.22,
        delaySeconds: 0.1
      },
      {
        waveType: 'sine',
        startFrequency: 262,
        endFrequency: 262,
        durationSeconds: 0.3,
        volume: 0.22,
        delaySeconds: 0.2
      }
    ],
    water: [
      { waveType: 'sine', startFrequency: 400, endFrequency: 70, durationSeconds: 0.4, volume: 0.2 }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  bubbles: {
    start: [
      {
        waveType: 'triangle',
        startFrequency: 587,
        endFrequency: 587,
        durationSeconds: 0.16,
        volume: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 740,
        endFrequency: 740,
        durationSeconds: 0.16,
        volume: 0.16,
        delaySeconds: 0.07
      },
      {
        waveType: 'triangle',
        startFrequency: 880,
        endFrequency: 880,
        durationSeconds: 0.16,
        volume: 0.16,
        delaySeconds: 0.14
      }
    ],
    shoot: [
      {
        waveType: 'sine',
        startFrequency: 300,
        endFrequency: 900,
        durationSeconds: 0.1,
        volume: 0.18
      }
    ],
    stick: [
      {
        waveType: 'triangle',
        startFrequency: 260,
        endFrequency: 200,
        durationSeconds: 0.08,
        volume: 0.18
      }
    ],
    pop: [
      {
        waveType: 'sine',
        startFrequency: 900,
        endFrequency: 1500,
        durationSeconds: 0.07,
        volume: 0.2
      },
      {
        waveType: 'sine',
        startFrequency: 600,
        endFrequency: 1200,
        durationSeconds: 0.07,
        volume: 0.12,
        delaySeconds: 0.04
      }
    ],
    tremble: [
      {
        waveType: 'sawtooth',
        startFrequency: 70,
        endFrequency: 55,
        durationSeconds: 0.45,
        volume: 0.1
      },
      {
        waveType: 'square',
        startFrequency: 140,
        endFrequency: 110,
        durationSeconds: 0.3,
        volume: 0.04
      }
    ],
    ceilingDrop: [
      {
        waveType: 'sawtooth',
        startFrequency: 220,
        endFrequency: 45,
        durationSeconds: 0.5,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 90,
        endFrequency: 40,
        durationSeconds: 0.35,
        volume: 0.22,
        delaySeconds: 0.12
      }
    ],
    drop: [
      {
        waveType: 'triangle',
        startFrequency: 700,
        endFrequency: 180,
        durationSeconds: 0.25,
        volume: 0.14
      }
    ],
    lose: [
      {
        waveType: 'sine',
        startFrequency: 330,
        endFrequency: 330,
        durationSeconds: 0.35,
        volume: 0.18
      },
      {
        waveType: 'sine',
        startFrequency: 262,
        endFrequency: 262,
        durationSeconds: 0.35,
        volume: 0.18,
        delaySeconds: 0.16
      },
      {
        waveType: 'sine',
        startFrequency: 196,
        endFrequency: 196,
        durationSeconds: 0.35,
        volume: 0.18,
        delaySeconds: 0.32
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  rhythm: {
    miss: [
      {
        waveType: 'sawtooth',
        startFrequency: 160,
        endFrequency: 90,
        durationSeconds: 0.14,
        volume: 0.1
      }
    ],
    combo: [
      {
        waveType: 'square',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.1,
        volume: 0.07
      },
      {
        waveType: 'square',
        startFrequency: 988,
        endFrequency: 988,
        durationSeconds: 0.1,
        volume: 0.07,
        delaySeconds: 0.05
      },
      {
        waveType: 'square',
        startFrequency: 1175,
        endFrequency: 1175,
        durationSeconds: 0.1,
        volume: 0.07,
        delaySeconds: 0.1
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  marbles: {
    start: [
      {
        waveType: 'triangle',
        startFrequency: 330,
        endFrequency: 330,
        durationSeconds: 0.18,
        volume: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.18,
        volume: 0.16,
        delaySeconds: 0.08
      },
      {
        waveType: 'triangle',
        startFrequency: 494,
        endFrequency: 494,
        durationSeconds: 0.18,
        volume: 0.16,
        delaySeconds: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.18,
        volume: 0.16,
        delaySeconds: 0.24
      }
    ],
    fall: [
      {
        waveType: 'sine',
        startFrequency: 600,
        endFrequency: 60,
        durationSeconds: 0.5,
        volume: 0.18
      }
    ],
    finish: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.28,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.28,
        volume: 0.2,
        delaySeconds: 0.09
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.28,
        volume: 0.2,
        delaySeconds: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.28,
        volume: 0.2,
        delaySeconds: 0.27
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  },
  marbleBuilder: {
    place: [
      {
        waveType: 'triangle',
        startFrequency: 320,
        endFrequency: 480,
        durationSeconds: 0.08,
        volume: 0.18
      }
    ],
    remove: [
      {
        waveType: 'triangle',
        startFrequency: 480,
        endFrequency: 240,
        durationSeconds: 0.09,
        volume: 0.16
      }
    ],
    test: [
      {
        waveType: 'triangle',
        startFrequency: 392,
        endFrequency: 392,
        durationSeconds: 0.14,
        volume: 0.16
      },
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.14,
        volume: 0.16,
        delaySeconds: 0.07
      }
    ]
  },
  wordRunner: {
    start: [
      {
        waveType: 'square',
        startFrequency: 440,
        endFrequency: 440,
        durationSeconds: 0.14,
        volume: 0.1
      },
      {
        waveType: 'square',
        startFrequency: 554,
        endFrequency: 554,
        durationSeconds: 0.14,
        volume: 0.1,
        delaySeconds: 0.07
      },
      {
        waveType: 'square',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.14,
        volume: 0.1,
        delaySeconds: 0.14
      }
    ],
    wordDone: [
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.16,
        volume: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 880,
        endFrequency: 880,
        durationSeconds: 0.16,
        volume: 0.18,
        delaySeconds: 0.06
      },
      {
        waveType: 'triangle',
        startFrequency: 1175,
        endFrequency: 1175,
        durationSeconds: 0.16,
        volume: 0.18,
        delaySeconds: 0.12
      }
    ],
    wrong: [
      {
        waveType: 'sawtooth',
        startFrequency: 190,
        endFrequency: 120,
        durationSeconds: 0.16,
        volume: 0.11
      }
    ],
    finish: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.28,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.28,
        volume: 0.2,
        delaySeconds: 0.09
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.28,
        volume: 0.2,
        delaySeconds: 0.18
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.28,
        volume: 0.2,
        delaySeconds: 0.27
      }
    ],
    end: [
      {
        waveType: 'triangle',
        startFrequency: 523,
        endFrequency: 523,
        durationSeconds: 0.3,
        volume: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 659,
        endFrequency: 659,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.1
      },
      {
        waveType: 'triangle',
        startFrequency: 784,
        endFrequency: 784,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.2
      },
      {
        waveType: 'triangle',
        startFrequency: 1047,
        endFrequency: 1047,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.3
      },
      {
        waveType: 'triangle',
        startFrequency: 1319,
        endFrequency: 1319,
        durationSeconds: 0.3,
        volume: 0.2,
        delaySeconds: 0.4
      }
    ]
  }
}

export const GAME_MUSIC: Partial<Record<GameAudioId, MusicTrack>> = {
  pictionary: {
    beatsPerMinute: 112,
    leadWave: 'triangle',
    bassWave: 'triangle',
    lead: 'e5 - g5 e5 c5 - e5 - e5 - a5 e5 c5 - a4 - f5 - a5 f5 c5 - f5 - d5 - g5 d5 b4 - d5 g5 g4 - c5 g4 e4 - g4 - e5 - a5 e5 c5 - e5 - c5 - f5 c5 a4 - c5 - d5 - g5 d5 b4 - d5 - c5 c5 f5 - c5 a4 f4 - d5 d5 g5 - d5 b4 g4 - b4 b4 e5 - b4 g4 e4 - e5 e5 a5 - e5 c5 a4 - f4 a4 c5 a4 c5 f5 c5 a4 g4 b4 d5 b4 d5 g5 d5 b4 e4 g4 b4 g4 b4 e5 b4 g4 a4 c5 e5 c5 e5 a5 e5 c5 e5 - g5 e5 c5 - e5 - e5 - a5 e5 c5 - a4 - f5 - a5 f5 c5 - f5 - d5 - g5 d5 b4 - d5 g5 d5 - - a4 - - f4 - a5 - - e5 - - c5 - f5 - - c5 - - a4 - g5 - - d5 - - b4 - c5 c5 f5 - c5 a4 f4 - d5 d5 g5 - d5 b4 g4 - b4 b4 e5 - b4 g4 e4 - e5 e5 a5 - e5 c5 a4 - g4 - c5 g4 e4 - g4 - e5 - a5 e5 c5 - e5 - c5 - f5 c5 a4 - c5 - d5 - g5 d5 b4 - d5 -',
    bass: 'c3 - g3 - c3 - g3 - a2 - e3 - a2 - e3 - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 - c3 - g2 - c3 - g2 - a2 - e3 - a2 - e3 - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 - e2 - b2 - e2 - b2 - a2 - e3 - a2 - e3 - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 - e2 - b2 - e2 - b2 - a2 - e3 - a2 - e3 - c3 - g3 - c3 - g3 - a2 - e3 - a2 - e3 - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 - d3 - - - a2 - - - a2 - - - e3 - - - f2 - - - c3 - - - g2 - - - d3 - - - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 - e2 - b2 - e2 - b2 - a2 - e3 - a2 - e3 - c3 - g2 - c3 - g2 - a2 - e3 - a2 - e3 - f2 - c3 - f2 - c3 - g2 - d3 - g2 - d3 -'
  },
  wordle: {
    beatsPerMinute: 90,
    leadWave: 'sine',
    bassWave: 'triangle',
    lead: 'e5 - - c5 - a4 - - c5 - - a4 - f4 - - g4 - - e5 - c5 - - d5 - - b4 - g4 - - e5 - a5 e5 c5 - e5 - c5 - f5 c5 a4 - c5 - g4 - c5 g4 e4 - g4 - d5 - g5 d5 b4 - d5 - a4 a4 d5 - a4 f4 d4 - e5 e5 a5 - e5 c5 a4 - c5 c5 f5 - c5 a4 f4 - b4 b4 e5 - b4 g#4 e4 - d4 f4 a4 f4 a4 d5 a4 f4 a4 c5 e5 c5 e5 a5 e5 c5 f4 a4 c5 a4 c5 f5 c5 a4 e4 g#4 b4 g#4 b4 e5 b4 g#4 e5 - - c5 - a4 - - c5 - - a4 - f4 - - g4 - - e5 - c5 - - d5 - - b4 - g4 - - f5 - - c5 - - a4 - c5 - - g4 - - e4 - g5 - - d5 - - b4 - a5 - - e5 - - c5 - a4 a4 d5 - a4 f4 d4 - e5 e5 a5 - e5 c5 a4 - c5 c5 f5 - c5 a4 f4 - b4 b4 e5 - b4 g#4 e4 - e5 - a5 e5 c5 - e5 - c5 - f5 c5 a4 - c5 - g4 - c5 g4 e4 - g4 - d5 - g5 d5 b4 - d5 -',
    bass: 'a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g3 - - - g2 - - - d3 - - - a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g2 - - - g2 - - - d3 - - - d3 - - - a2 - - - a2 - - - e3 - - - f2 - - - c3 - - - e2 - - - b2 - - - d3 - - - a2 - - - a2 - - - e3 - - - f2 - - - c3 - - - e2 - - - b2 - - - a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g3 - - - g2 - - - d3 - - - f2 - - - c3 - - - c3 - - - g2 - - - g2 - - - d3 - - - a2 - - - e3 - - - d3 - - - a2 - - - a2 - - - e3 - - - f2 - - - c3 - - - e2 - - - b2 - - - a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g2 - - - g2 - - - d3 - - -'
  },
  squares: {
    beatsPerMinute: 120,
    leadWave: 'square',
    bassWave: 'triangle',
    lead: 'b4 d5 g5 d5 b4 d5 g5 - e5 g5 b5 g5 e5 g5 b5 - c5 e5 g5 e5 c5 e5 g5 - d5 f#5 a5 f#5 d5 f#5 a5 - d5 - g5 d5 b4 - d5 - b4 - e5 b4 g4 - b4 - g4 - c5 g4 e4 - g4 - a4 - d5 a4 f#4 - a4 - g4 g4 c5 - g4 e4 c4 - a4 a4 d5 - a4 f#4 d4 - f#5 f#5 b5 - f#5 d5 b4 - b4 b4 e5 - b4 g4 e4 - c4 e4 g4 e4 g4 c5 g4 e4 d4 f#4 a4 f#4 a4 d5 a4 f#4 b4 d5 f#5 d5 f#5 b5 f#5 d5 e4 g4 b4 g4 b4 e5 b4 g4 b4 d5 g5 d5 b4 d5 g5 - e5 g5 b5 g5 e5 g5 b5 - c5 e5 g5 e5 c5 e5 g5 - d5 f#5 a5 f#5 d5 f#5 a5 - e5 - - b4 - - g4 - c5 - - g4 - - e4 - d5 - - a4 - - f#4 - g5 - - d5 - - b4 - g4 g4 c5 - g4 e4 c4 - a4 a4 d5 - a4 f#4 d4 - f#5 f#5 b5 - f#5 d5 b4 - b4 b4 e5 - b4 g4 e4 - d5 - g5 d5 b4 - d5 - b4 - e5 b4 g4 - b4 - g4 - c5 g4 e4 - g4 - a4 - d5 a4 f#4 - a4 -',
    bass: 'g2 - g3 - g2 - g3 - e2 - e3 - e2 - e3 - c3 - c2 - c3 - c2 - d3 - d2 - d3 - d2 - g2 - d3 - g2 - d3 - e2 - b2 - e2 - b2 - c3 - g2 - c3 - g2 - d3 - a2 - d3 - a2 - c3 - g2 - c3 - g2 - d3 - a2 - d3 - a2 - b2 - f#2 - b2 - f#2 - e2 - b2 - e2 - b2 - c3 - g2 - c3 - g2 - d3 - a2 - d3 - a2 - b2 - f#2 - b2 - f#2 - e2 - b2 - e2 - b2 - g2 - g3 - g2 - g3 - e2 - e3 - e2 - e3 - c3 - c2 - c3 - c2 - d3 - d2 - d3 - d2 - e2 - - - b2 - - - c3 - - - g2 - - - d3 - - - a2 - - - g2 - - - d3 - - - c3 - g2 - c3 - g2 - d3 - a2 - d3 - a2 - b2 - f#2 - b2 - f#2 - e2 - b2 - e2 - b2 - g2 - d3 - g2 - d3 - e2 - b2 - e2 - b2 - c3 - g2 - c3 - g2 - d3 - a2 - d3 - a2 -'
  },
  minigolf: {
    beatsPerMinute: 100,
    leadWave: 'triangle',
    bassWave: 'sine',
    lead: 'a4 - c5 - f5 - c5 - bb4 - d5 - f5 - d5 - c5 - e5 - g5 - e5 - a4 - c5 - f5 - - - c5 - f5 c5 a4 - c5 - f5 - a#5 f5 d5 - f5 - g4 - c5 g4 e4 - g4 - c5 - f5 c5 a4 - c5 - a4 a4 d5 - a4 f4 d4 - d5 d5 g5 - d5 a#4 g4 - g4 g4 c5 - g4 e4 c4 - c5 c5 f5 - c5 a4 f4 - d4 f4 a4 f4 a4 d5 a4 f4 g4 a#4 d5 a#4 d5 g5 d5 a#4 c4 e4 g4 e4 g4 c5 g4 e4 f4 a4 c5 a4 c5 f5 c5 a4 a4 - c5 - f5 - c5 - bb4 - d5 - f5 - d5 - c5 - e5 - g5 - e5 - a4 - c5 - f5 - - - a#5 - - f5 - - d5 - f5 - - c5 - - a4 - c5 - - g4 - - e4 - d5 - - a4 - - f4 - a4 a4 d5 - a4 f4 d4 - d5 d5 g5 - d5 a#4 g4 - g4 g4 c5 - g4 e4 c4 - c5 c5 f5 - c5 a4 f4 - c5 - f5 c5 a4 - c5 - f5 - a#5 f5 d5 - f5 - g4 - c5 g4 e4 - g4 - c5 - f5 c5 a4 - c5 -',
    bass: 'f2 - c3 - f2 - c3 - bb2 - f3 - bb2 - f3 - c3 - g3 - c3 - g3 - f2 - c3 - f2 - - - f2 - c3 - f2 - c3 - a#2 - f2 - a#2 - f2 - c3 - g2 - c3 - g2 - f2 - c3 - f2 - c3 - d3 - a2 - d3 - a2 - g2 - d3 - g2 - d3 - c3 - g2 - c3 - g2 - f2 - c3 - f2 - c3 - d3 - a2 - d3 - a2 - g2 - d3 - g2 - d3 - c3 - g2 - c3 - g2 - f2 - c3 - f2 - c3 - f2 - c3 - f2 - c3 - bb2 - f3 - bb2 - f3 - c3 - g3 - c3 - g3 - f2 - c3 - f2 - - - a#2 - - - f2 - - - f2 - - - c3 - - - c3 - - - g2 - - - d3 - - - a2 - - - d3 - a2 - d3 - a2 - g2 - d3 - g2 - d3 - c3 - g2 - c3 - g2 - f2 - c3 - f2 - c3 - f2 - c3 - f2 - c3 - a#2 - f2 - a#2 - f2 - c3 - g2 - c3 - g2 - f2 - c3 - f2 - c3 -'
  },
  bubbles: {
    beatsPerMinute: 132,
    leadWave: 'square',
    bassWave: 'triangle',
    lead: 'f#5 a5 f#5 d5 f#5 a5 f#5 - e5 a5 e5 c#5 e5 a5 e5 - d5 f#5 d5 b4 d5 f#5 d5 - d5 g5 d5 b4 d5 g5 b5 - a4 - d5 a4 f#4 - a4 - e5 - a5 e5 c#5 - e5 - f#5 - b5 f#5 d5 - f#5 - d5 - g5 d5 b4 - d5 - d5 d5 g5 - d5 b4 g4 - a4 a4 d5 - a4 f#4 d4 - e5 e5 a5 - e5 c#5 a4 - f#5 f#5 b5 - f#5 d5 b4 - g4 b4 d5 b4 d5 g5 d5 b4 d4 f#4 a4 f#4 a4 d5 a4 f#4 a4 c#5 e5 c#5 e5 a5 e5 c#5 b4 d5 f#5 d5 f#5 b5 f#5 d5 f#5 a5 f#5 d5 f#5 a5 f#5 - e5 a5 e5 c#5 e5 a5 e5 - d5 f#5 d5 b4 d5 f#5 d5 - d5 g5 d5 b4 d5 g5 b5 - e5 - - b4 - - g4 - a5 - - e5 - - c#5 - d5 - - a4 - - f#4 - b5 - - f#5 - - d5 - d5 d5 g5 - d5 b4 g4 - a4 a4 d5 - a4 f#4 d4 - e5 e5 a5 - e5 c#5 a4 - f#5 f#5 b5 - f#5 d5 b4 - a4 - d5 a4 f#4 - a4 - e5 - a5 e5 c#5 - e5 - f#5 - b5 f#5 d5 - f#5 - d5 - g5 d5 b4 - d5 -',
    bass: 'd3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#3 - b2 - f#3 - g2 - d3 - g2 - d3 - d3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#2 - b2 - f#2 - g2 - d3 - g2 - d3 - g2 - d3 - g2 - d3 - d3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#2 - b2 - f#2 - g2 - d3 - g2 - d3 - d3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#2 - b2 - f#2 - d3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#3 - b2 - f#3 - g2 - d3 - g2 - d3 - e2 - - - b2 - - - a2 - - - e3 - - - d3 - - - a2 - - - b2 - - - f#2 - - - g2 - d3 - g2 - d3 - d3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#2 - b2 - f#2 - d3 - a2 - d3 - a2 - a2 - e3 - a2 - e3 - b2 - f#2 - b2 - f#2 - g2 - d3 - g2 - d3 -'
  },
  marbles: {
    beatsPerMinute: 126,
    leadWave: 'square',
    bassWave: 'triangle',
    lead: 'e5 g5 b5 g5 e5 g5 b5 - c5 e5 g5 e5 c5 e5 g5 - b4 d5 g5 d5 b4 d5 g5 - a4 d5 f#5 d5 a4 d5 f#5 - b4 - e5 b4 g4 - b4 - g4 - c5 g4 e4 - g4 - d5 - g5 d5 b4 - d5 - a4 - d5 a4 f#4 - a4 - e5 e5 a5 - e5 c5 a4 - b4 b4 e5 - b4 g4 e4 - f#5 f#5 b5 - f#5 d#5 b4 - b4 b4 e5 - b4 g4 e4 - a4 c5 e5 c5 e5 a5 e5 c5 e4 g4 b4 g4 b4 e5 b4 g4 b4 d#5 f#5 d#5 f#5 b5 f#5 d#5 e4 g4 b4 g4 b4 e5 b4 g4 e5 g5 b5 g5 e5 g5 b5 - c5 e5 g5 e5 c5 e5 g5 - b4 d5 g5 d5 b4 d5 g5 - a4 d5 f#5 d5 a4 d5 f#5 - c5 - - g4 - - e4 - d5 - - a4 - - f#4 - e5 - - b4 - - g4 - b5 - - f#5 - - d5 - e5 e5 a5 - e5 c5 a4 - b4 b4 e5 - b4 g4 e4 - f#5 f#5 b5 - f#5 d#5 b4 - b4 b4 e5 - b4 g4 e4 - b4 - e5 b4 g4 - b4 - g4 - c5 g4 e4 - g4 - d5 - g5 d5 b4 - d5 - a4 - d5 a4 f#4 - a4 -',
    bass: 'e2 e2 e3 e2 e2 e2 e3 e2 c3 c3 c2 c3 c3 c3 c2 c3 g2 g2 g3 g2 g2 g2 g3 g2 d3 d3 d2 d3 d3 d3 d2 d3 e2 e2 b2 e2 e2 e2 b2 e2 c3 c3 g2 c3 c3 c3 g2 c3 g2 g2 d3 g2 g2 g2 d3 g2 d3 d3 a2 d3 d3 d3 a2 d3 a2 a2 e3 a2 a2 a2 e3 a2 e2 e2 b2 e2 e2 e2 b2 e2 b2 b2 f#2 b2 b2 b2 f#2 b2 e2 e2 b2 e2 e2 e2 b2 e2 a2 a2 e3 a2 a2 a2 e3 a2 e2 e2 b2 e2 e2 e2 b2 e2 b2 b2 f#2 b2 b2 b2 f#2 b2 e2 e2 b2 e2 e2 e2 b2 e2 e2 e2 e3 e2 e2 e2 e3 e2 c3 c3 c2 c3 c3 c3 c2 c3 g2 g2 g3 g2 g2 g2 g3 g2 d3 d3 d2 d3 d3 d3 d2 d3 c3 - - - g2 - - - d3 - - - a2 - - - e2 - - - b2 - - - b2 - - - f#2 - - - a2 a2 e3 a2 a2 a2 e3 a2 e2 e2 b2 e2 e2 e2 b2 e2 b2 b2 f#2 b2 b2 b2 f#2 b2 e2 e2 b2 e2 e2 e2 b2 e2 e2 e2 b2 e2 e2 e2 b2 e2 c3 c3 g2 c3 c3 c3 g2 c3 g2 g2 d3 g2 g2 g2 d3 g2 d3 d3 a2 d3 d3 d3 a2 d3'
  },
  marbleBuilder: {
    beatsPerMinute: 84,
    leadWave: 'sine',
    bassWave: 'triangle',
    lead: 'e5 - - g5 - - b5 - f#5 - - a5 - - d5 - g5 - - e5 - - b4 - d5 - - b4 - - g4 - g4 - c5 g4 e4 - g4 - a4 - d5 a4 f#4 - a4 - b4 - e5 b4 g4 - b4 - d5 - g5 d5 b4 - d5 - e5 e5 a5 - e5 c5 a4 - c5 c5 f5 - c5 a4 f4 - g4 g4 c5 - g4 e4 c4 - d5 d5 g5 - d5 b4 g4 - a4 c5 e5 c5 e5 a5 e5 c5 f4 a4 c5 a4 c5 f5 c5 a4 c4 e4 g4 e4 g4 c5 g4 e4 g4 b4 d5 b4 d5 g5 d5 b4 e5 - - g5 - - b5 - f#5 - - a5 - - d5 - g5 - - e5 - - b4 - d5 - - b4 - - g4 - d5 - - a4 - - f#4 - e5 - - b4 - - g4 - c5 - - g4 - - e4 - g5 - - d5 - - b4 - e5 e5 a5 - e5 c5 a4 - c5 c5 f5 - c5 a4 f4 - g4 g4 c5 - g4 e4 c4 - d5 d5 g5 - d5 b4 g4 - g4 - c5 g4 e4 - g4 - a4 - d5 a4 f#4 - a4 - b4 - e5 b4 g4 - b4 - d5 - g5 d5 b4 - d5 -',
    bass: 'c3 - - - g3 - - - d3 - - - a3 - - - e3 - - - b3 - - - g2 - - - d3 - - - c3 - - - g2 - - - d3 - - - a2 - - - e2 - - - b2 - - - g2 - - - d3 - - - a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g2 - - - g2 - - - d3 - - - a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g2 - - - g2 - - - d3 - - - c3 - - - g3 - - - d3 - - - a3 - - - e3 - - - b3 - - - g2 - - - d3 - - - d3 - - - a2 - - - e2 - - - b2 - - - c3 - - - g2 - - - g2 - - - d3 - - - a2 - - - e3 - - - f2 - - - c3 - - - c3 - - - g2 - - - g2 - - - d3 - - - c3 - - - g2 - - - d3 - - - a2 - - - e2 - - - b2 - - - g2 - - - d3 - - -'
  },
  wordRunner: {
    beatsPerMinute: 138,
    leadWave: 'square',
    bassWave: 'sawtooth',
    lead: 'a4 c5 e5 a5 e5 c5 e5 c5 g4 b4 d5 g5 d5 b4 d5 b4 f4 a4 c5 f5 c5 a4 c5 a4 e4 g#4 b4 e5 b4 g#4 b4 g#4 e5 - a5 e5 c5 - e5 - d5 - g5 d5 b4 - d5 - c5 - f5 c5 a4 - c5 - b4 - e5 b4 g#4 - b4 - c5 c5 f5 - c5 a4 f4 - d5 d5 g5 - d5 b4 g4 - e5 e5 a5 - e5 c5 a4 - b4 b4 e5 - b4 g#4 e4 - f4 a4 c5 a4 c5 f5 c5 a4 g4 b4 d5 b4 d5 g5 d5 b4 a4 c5 e5 c5 e5 a5 e5 c5 e4 g#4 b4 g#4 b4 e5 b4 g#4 a4 c5 e5 a5 e5 c5 e5 c5 g4 b4 d5 g5 d5 b4 d5 b4 f4 a4 c5 f5 c5 a4 c5 a4 e4 g#4 b4 e5 b4 g#4 b4 g#4 d5 - - a4 - - f4 - a5 - - e5 - - c5 - e5 - - b4 - - g#4 - a5 - - e5 - - c5 - c5 c5 f5 - c5 a4 f4 - d5 d5 g5 - d5 b4 g4 - e5 e5 a5 - e5 c5 a4 - b4 b4 e5 - b4 g#4 e4 - e5 - a5 e5 c5 - e5 - d5 - g5 d5 b4 - d5 - c5 - f5 c5 a4 - c5 - b4 - e5 b4 g#4 - b4 -',
    bass: 'a2 a2 a3 a2 a2 a2 a3 a2 g2 g2 g3 g2 g2 g2 g3 g2 f2 f2 f3 f2 f2 f2 f3 f2 e2 e2 e3 e2 e2 e2 e3 e2 a2 a2 e3 a2 a2 a2 e3 a2 g2 g2 d3 g2 g2 g2 d3 g2 f2 f2 c3 f2 f2 f2 c3 f2 e2 e2 b2 e2 e2 e2 b2 e2 f2 f2 c3 f2 f2 f2 c3 f2 g2 g2 d3 g2 g2 g2 d3 g2 a2 a2 e3 a2 a2 a2 e3 a2 e2 e2 b2 e2 e2 e2 b2 e2 f2 f2 c3 f2 f2 f2 c3 f2 g2 g2 d3 g2 g2 g2 d3 g2 a2 a2 e3 a2 a2 a2 e3 a2 e2 e2 b2 e2 e2 e2 b2 e2 a2 a2 a3 a2 a2 a2 a3 a2 g2 g2 g3 g2 g2 g2 g3 g2 f2 f2 f3 f2 f2 f2 f3 f2 e2 e2 e3 e2 e2 e2 e3 e2 d3 - - - a2 - - - a2 - - - e3 - - - e2 - - - b2 - - - a2 - - - e3 - - - f2 f2 c3 f2 f2 f2 c3 f2 g2 g2 d3 g2 g2 g2 d3 g2 a2 a2 e3 a2 a2 a2 e3 a2 e2 e2 b2 e2 e2 e2 b2 e2 a2 a2 e3 a2 a2 a2 e3 a2 g2 g2 d3 g2 g2 g2 d3 g2 f2 f2 c3 f2 f2 f2 c3 f2 e2 e2 b2 e2 e2 e2 b2 e2'
  }
}

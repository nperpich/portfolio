# React Three Fiber Portfolio — Component Architecture & Claude Code Brief

## Goal

Refactor the current single-page, hardcoded Venture Plug implementation into a
reusable system: a generic 3D "design viewer" with an edit mode (flyby camera
authoring) and a presentation mode (clean final view), driven entirely by
per-design config data instead of inline literals. Adding design #2 should mean
"write a new config file," not "write new components."

## Current state (context for Claude Code)

- Vite + React Router app, one route per design (`/designs/venture-plug`).
- `VenturePlug.jsx` loads a `.glb`, uses `@react-three/drei`'s `useGLTF` +
  `useAnimations`, and scrubs the model's `AnimationAction.time` with GSAP
  tweens driven by a `step` index passed down from the page.
- `VenturePlugPage.jsx` owns `step` state and renders forward/back arrow
  buttons that call `setStep`.
- Steps are currently a hardcoded array inside the component file.
- Mobile layout uses `100dvh` (not `100vh`) — required fix, see gotchas below.
- No camera authoring tool yet — camera is a static `OrbitControls`.
- No text overlay yet.
- `MechanicalEngineer.jsx` is the existing container component that holds the
  Canvas, lighting, and (implicitly, currently always-on) `OrbitControls` for
  a design's 3D presentation. This plays the same role as `DesignStage` below
  — the brief renames it as part of the refactor rather than creating a
  parallel file. If it currently does more than that (e.g. also owns step
  state or renders `StepControls`), that logic should move up into the
  per-design page component instead, per the tree below.

## Target component tree

```
VenturePlugPage.jsx                 (route-level; one per design)
├─ owns: stepIndex (useState), timelineRef (useRef({ time: 0 })), editMode (useState)
├─ imports: steps, flybyPoints, textCues from ./venturePlug.config.js
│
├─ <DesignStage editMode modelUrl>
│    ├─ <Canvas> + lighting + <Bounds> + <Environment>
│    ├─ <ModelRig modelUrl steps stepIndex timelineRef>       (generalized VenturePlug)
│    ├─ <FlybyCamera points timelineRef editMode>
│    ├─ {editMode && <OrbitControls />}
│    └─ {editMode && <FlybyEditor points onChange />}
│
├─ <StepControls steps stepIndex onChange={setStepIndex} />
└─ <TimedTextOverlay cues={textCues} timelineRef />
```

`components/viewer/` holds the reusable system pieces (`DesignStage`,
`FlybyCamera`, `FlybyEditor`, `StepControls`, `TimedTextOverlay`).
`components/designs/<Name>/` holds each design's `ModelRig` variant (if it
needs anything design-specific beyond the generic loader) and its config file.

## The shared timing model (read this before touching the code)

The model's `AnimationAction.time` is the one real clock. Everything else —
camera position, text visibility — is a function of that value at the current
instant. That value changes every frame during a GSAP tween, so it must NOT be
piped through `useState` (that would re-render the full tree 60×/sec).

Instead: `timelineRef = useRef({ time: 0 })`, created once in the page and
passed as a prop to `ModelRig`, `FlybyCamera`, and `TimedTextOverlay`.
`ModelRig` writes `timelineRef.current.time = action.time` every frame inside
its own `useFrame`. `FlybyCamera` and `TimedTextOverlay` read
`timelineRef.current.time` inside their own `useFrame` calls. No component
re-renders because of this value changing — only direct reads/writes on a
stable object.

`stepIndex` (which step button is active) is a separate, low-frequency value
and is fine as ordinary `useState` — it only changes on click.

*Future note:* if this grows to multiple designs sharing state across one
continuous-scroll page, migrate `timelineRef` to a small `zustand` store. The
read/write API stays nearly identical, so this is a contained swap, not a
rewrite — no need to add it now.

## Component specs

### `DesignStage`
| Prop | Type | Notes |
|---|---|---|
| `modelUrl` | `string` | Path to the `.glb` |
| `editMode` | `boolean` (default `false`) | Toggles `OrbitControls` + `FlybyEditor` on/off |
| `children` | `ReactNode` | `ModelRig` + `FlybyCamera`, passed in by the page |

### `ModelRig` (generalized `VenturePlug`)
| Prop | Type | Notes |
|---|---|---|
| `modelUrl` | `string` | |
| `steps` | `{ label: string, time: number }[]` | Sorted ascending by `time` |
| `stepIndex` | `number` | Which step to tween toward |
| `timelineRef` | `MutableRefObject<{ time: number }>` | Written every frame, not read by this component |
| `tweenDuration` | `number` (default `1`) | Seconds |

Preserve exactly: `reset().play()` + `paused = true` runs **once on mount
only**; on `stepIndex` change, tween `action.time` directly with **no**
`reset()` call. See gotchas below for why.

**Dev-only time scrubber:** when `editMode` is true, render a plain
`<input type="range">` bound directly to `action.time` (bypassing GSAP
entirely), so step times can be found by dragging until a pose looks right
and reading the number off — much faster than guessing a value, saving,
reloading, and eyeballing repeatedly. This is a separate concern from
`FlybyEditor`'s camera-point recording (it's finding *model* times, not
*camera* positions) but lives behind the same `editMode` flag.

### `FlybyCamera`
| Prop | Type | Notes |
|---|---|---|
| `points` | `{ time: number, position: [n,n,n], target: [n,n,n] }[]` | Sorted ascending by `time` |
| `timelineRef` | `MutableRefObject<{ time: number }>` | Read every frame |
| `editMode` | `boolean` | When `true`, this component does nothing — `OrbitControls` has the camera |

Interpolation: find the two points bracketing `timelineRef.current.time`,
linearly interpolate `position` and `target`, apply via `camera.position.set`
+ `camera.lookAt`. Upgrade to `THREE.CatmullRomCurve3` later if linear looks
jerky at direction changes with 4+ points — not needed for an MVP with 2-3.

### `FlybyEditor` (rendered only when `editMode` is true)
| Prop | Type | Notes |
|---|---|---|
| `points` | same shape as above | Controlled |
| `onChange` | `(points) => void` | Called on add/edit/delete |

UI: a "Record point" button that captures the live `camera.position` and
`OrbitControls` target plus a timestamp (default: last point's time + 1), and
a list below it with one editable number input per point for `time`, plus a
delete button per row. Include a "Copy as JSON" button that puts the current
`points` array on the clipboard — that's what gets pasted into the design's
config file once you're happy with it.

### `StepControls`
| Prop | Type | Notes |
|---|---|---|
| `steps` | `{ label: string, time: number }[]` | |
| `stepIndex` | `number` | |
| `onChange` | `(index: number) => void` | |

Purely presentational — no animation logic, just renders label + prev/next
buttons and calls `onChange`.

### `TimedTextOverlay`
| Prop | Type | Notes |
|---|---|---|
| `cues` | `{ text: string, start: number, end: number, fadeDuration?: number }[]` | |
| `timelineRef` | `MutableRefObject<{ time: number }>` | Read every frame |

Implement using drei's `<Html>` so it can live inside the R3F tree and use
`useFrame` like everything else. Each frame, compute opacity per cue from
`timelineRef.current.time` relative to `start`/`end` (ramp up over
`fadeDuration` at the start, ramp down over `fadeDuration` before `end`), and
write it directly via a DOM ref (`el.current.style.opacity = ...`) rather than
React state — same reasoning as the shared timing model above.

## Config schema (one file per design)

```js
// components/designs/VenturePlug/venturePlug.config.js
export const steps = [
  { label: 'Assembled',   time: 0 },
  { label: 'Exploded',    time: 1.2 },
  { label: 'Reassembled', time: 2.8 },
]

export const flybyPoints = [
  { time: 0,   position: [0, 0.4, 1.2], target: [0, 0, 0] },
  { time: 1.2, position: [0.8, 0.6, 0.9], target: [0, 0.1, 0] },
  { time: 2.8, position: [0, 0.4, 1.2], target: [0, 0, 0] },
]

export const textCues = [
  { text: 'Single-piece plug body.', start: 0,   end: 1.0, fadeDuration: 0.3 },
  { text: 'Exploding to show the internal seal.', start: 1.2, end: 2.6, fadeDuration: 0.3 },
]
```

## Known gotchas — do not regress these

1. **Don't call `action.reset()` on every `stepIndex` change.** `reset()`
   snaps `time` back to 0 as a side effect. It should run exactly once, on
   mount. Re-running it on every step change is what caused the "always
   restarts from the beginning" bug.
2. **Skip the tween on the very first render.** On mount, jump `action.time`
   straight to the initial step's time with no GSAP tween — otherwise you get
   a visible snap-to-zero-then-tween-away flash before the first interaction.
3. **Import `useGLTF` from `@react-three/drei`, not `@react-three/fiber`.**
4. **Mobile height must be `100dvh`, not `100vh`.** `100vh` on real mobile
   browsers is calculated against the browser chrome hidden, so fixed-position
   UI (like `StepControls`) can render below the visible viewport on an actual
   phone even though it looks fine in desktop responsive-mode simulation.
5. **Quote file paths with spaces** in any CLI commands referenced in scripts
   or docs (SolidWorks export paths often have spaces in folder names).

## Task list for Claude Code

1. Create `src/hooks/` if it doesn't exist. No shared hook file is required —
   `timelineRef` is just a `useRef` created directly in the page component.
2. Create `src/components/designs/VenturePlug/venturePlug.config.js` with the
   schema above, populated with the current hardcoded step values from
   `VenturePlug.jsx`.
3. Rename `VenturePlug.jsx` → `ModelRig.jsx` under
   `src/components/designs/VenturePlug/`. Update it to accept the props listed
   in the `ModelRig` spec, remove the hardcoded `STEPS` export, and write to
   `timelineRef.current.time` every frame via `useFrame`. Preserve gotchas #1
   and #2 exactly.
4. Rename `MechanicalEngineer.jsx` → `src/components/viewer/DesignStage.jsx`
   (moving it into the shared `viewer/` folder, since it's a reusable system
   component, not a per-design one). Refactor it to accept `modelUrl`,
   `editMode`, and `children` per the `DesignStage` spec below, and make
   `<OrbitControls>` conditional on `editMode` rather than always-on. If it
   currently contains anything beyond the Canvas/lighting/controls (step
   state, `StepControls` markup, etc.), move that logic up into the per-design
   page component — `DesignStage` should only own the 3D staging, nothing else.
5. Create `src/components/viewer/FlybyCamera.jsx` per spec above (linear
   interpolation between bracketing points).
6. Create `src/components/viewer/FlybyEditor.jsx` per spec above (record
   button, editable timestamp list, copy-as-JSON button). Only mount it when
   `editMode` is true.
7. Create `src/components/viewer/TimedTextOverlay.jsx` per spec above, using
   drei's `<Html>` and a DOM ref for imperative opacity writes.
8. Create `src/components/viewer/StepControls.jsx` — extract the existing
   arrow-button markup from `VenturePlugPage.jsx` into this presentational
   component per its prop spec.
9. Rewrite `src/pages/VenturePlugPage.jsx` to own `stepIndex`, `timelineRef`,
   and `editMode` state, import the config file, and compose all of the above.
   Keep the existing `100dvh` wrapper div unchanged.
10. Verify against the acceptance checklist below before considering this done.

## Acceptance checklist

- [ ] `editMode={false}` shows only the clean presentation view — no editor UI, no free `OrbitControls`.
- [ ] `editMode={true}` shows `OrbitControls` + `FlybyEditor`, and the model/text still animate normally underneath.
- [ ] Clicking a step arrow tweens smoothly from the *current* time to the target step — never snaps back to 0 first.
- [ ] Text cues fade in and out at their configured timestamps, synced to the model's actual animation time.
- [ ] In presentation mode, the camera follows the recorded flyby points, interpolated against the same timeline as the model.
- [ ] No previously-hardcoded step/camera/text values remain inline in component files — all of it lives in `venturePlug.config.js`.
- [ ] Mobile layout still uses `100dvh`; `StepControls` is visible on an actual phone, not just desktop responsive mode.
- [ ] A dev-only time scrubber is visible in `editMode`, bound directly to `action.time`.

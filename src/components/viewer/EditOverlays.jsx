import { TimeScrubber } from './TimeScrubber';
import { FlybyScrubber } from './FlybyScrubber';
import { FlybyEditor } from './FlybyEditor';

// The plain-DOM edit-mode tools, bundled — live outside the Canvas so
// they're regular CSS `position: absolute`, not drei's <Html> (which hides
// itself when its 3D anchor rotates behind the camera).
export function EditOverlays({
  action,
  points,
  onChangePoints,
  cameraRef,
  controlsRef,
  selectedIndex,
  setSelectedIndex,
  previewRef,
  setPreviewing,
}) {
  return (
    <>
      <TimeScrubber action={action} />
      <FlybyScrubber
        points={points}
        previewRef={previewRef}
        setPreviewing={setPreviewing}
      />
      <FlybyEditor
        points={points}
        onChange={onChangePoints}
        cameraRef={cameraRef}
        controlsRef={controlsRef}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </>
  );
}

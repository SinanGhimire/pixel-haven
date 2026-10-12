/** Arcade body coordinates from the previous frame prevent landing through undersides. */
export function canLandOnLedge(velocityY: number, previousBottom: number, ledgeTop: number, dropping: boolean) {
  return !dropping && velocityY >= 0 && previousBottom <= ledgeTop + 4;
}

export function canDropThrough(now: number, lastLanding: number, down: boolean, jumpPressed: boolean) {
  return down && jumpPressed && now - lastLanding < 120;
}
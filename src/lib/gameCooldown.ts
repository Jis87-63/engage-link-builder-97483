const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getLastPlayed(gameId: string): number | null {
  const val = localStorage.getItem(`game_cooldown_${gameId}`);
  return val ? parseInt(val, 10) : null;
}

export function setPlayed(gameId: string) {
  localStorage.setItem(`game_cooldown_${gameId}`, Date.now().toString());
}

export function getCooldownRemaining(gameId: string): number {
  const last = getLastPlayed(gameId);
  if (!last) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - last);
  return Math.max(0, remaining);
}

export function formatCooldown(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

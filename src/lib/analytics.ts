// Adapter analytics. Default: tidak mengirim apa pun (vendor menunggu Q-03).
// Properti dibatasi pada enum dan angka kecil — tidak pernah isi jawaban atau data pribadi.

type ToolId = 'health-check';
type AreaId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface EventMap {
  tool_view: { tool_id: ToolId };
  tool_start: { tool_id: ToolId };
  tool_area_complete: { tool_id: ToolId; area: AreaId };
  tool_complete: { tool_id: ToolId; duration_bucket: '<5' | '5-10' | '>10' };
  result_view: { tool_id: ToolId };
  next_action_click: { tool_id: ToolId; action_type: 'article' | 'download' | 'solusi' | 'kontak' | 'restart'; target: string };
  contact_submit: { source: string };
}

export function track<E extends keyof EventMap>(name: E, props: EventMap[E]): void {
  if (import.meta.env.DEV) console.debug('[analytics]', name, props);
}

export function durationBucket(ms: number): EventMap['tool_complete']['duration_bucket'] {
  const minutes = ms / 60000;
  return minutes < 5 ? '<5' : minutes <= 10 ? '5-10' : '>10';
}

import { supabase } from "./supabaseClient";

const listeners = new Map(); // table -> Set(callback)
const channels = new Map();  // table -> channel

const TABLES = ["customers", "orders", "replies", "broadcasts"];

function initTableChannel(table) {
  if (channels.has(table)) return;

  const channel = supabase
    .channel(`public-${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => {
        try {
          const set = listeners.get(table);
          if (set && set.size) {
            set.forEach((cb) => {
              try {
                cb(payload);
              } catch (e) {
                console.warn(`realtime listener error [${table}]`, e);
              }
            });
          }
        } catch (e) {
          console.warn(`realtime dispatch error [${table}]`, e);
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.debug(`realtime subscribed: ${table}`);
      }
      if (status === "CHANNEL_ERROR") {
        console.warn(`realtime channel error: ${table}`);
      }
    });

  channels.set(table, channel);
}

export function addListener(table, cb) {
  initTableChannel(table);
  if (!listeners.has(table)) listeners.set(table, new Set());
  listeners.get(table).add(cb);
  return () => removeListener(table, cb);
}

export function removeListener(table, cb) {
  if (!listeners.has(table)) return;
  listeners.get(table).delete(cb);

  if (listeners.get(table).size === 0) {
    listeners.delete(table);
    const ch = channels.get(table);
    if (ch) {
      try {
        supabase.removeChannel(ch);
      } catch (e) {
        try { ch.unsubscribe(); } catch {}
      }
      channels.delete(table);
    }
  }
}

export function removeAllListeners() {
  listeners.clear();
  channels.forEach((ch) => {
    try {
      supabase.removeChannel(ch);
    } catch (e) {
      try { ch.unsubscribe(); } catch {}
    }
  });
  channels.clear();
}

// Pre-init all table channels on import
TABLES.forEach(initTableChannel);

export default { addListener, removeListener, removeAllListeners };
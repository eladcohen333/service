/**
 * Thin wrapper around Vercel KV.
 * Falls back to an in-memory store when KV env vars are absent (local dev).
 */
import { kv } from "@vercel/kv";

const memStore = new Map<string, string>();

function todayKey(suffix: string) {
  const d = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${d}:${suffix}`;
}

function isKvAvailable() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function logInteraction(sessionId: string, message: string) {
  const key = todayKey("sessions");
  const msgKey = todayKey("messages");
  if (isKvAvailable()) {
    await kv.sadd(key, sessionId);
    await kv.lpush(msgKey, message.slice(0, 300));
    await kv.expire(key, 60 * 60 * 48);
    await kv.expire(msgKey, 60 * 60 * 48);
  } else {
    memStore.set(key, sessionId);
  }
}

export async function logContact() {
  const key = todayKey("contacts");
  if (isKvAvailable()) {
    await kv.incr(key);
    await kv.expire(key, 60 * 60 * 48);
  }
}

export async function getTodayStats() {
  if (!isKvAvailable()) {
    return { unique_users: 0, contacts_today: 0, recent_questions: [] };
  }
  const [users, contacts, messages] = await Promise.all([
    kv.scard(todayKey("sessions")),
    kv.get<number>(todayKey("contacts")),
    kv.lrange<string>(todayKey("messages"), 0, 9),
  ]);
  return {
    unique_users: users ?? 0,
    contacts_today: contacts ?? 0,
    recent_questions: messages ?? [],
  };
}

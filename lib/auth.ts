export type User = {
  username: string
  role: 'admin' | 'ae' | 'sdr'
  repName: string | null
}

const USERS: Record<string, User> = {
  jake: { username: 'jake', role: 'admin', repName: null },
  joe: { username: 'joe', role: 'ae', repName: 'Joe Meyers' },
  jc: { username: 'jc', role: 'sdr', repName: 'JC Ruiz' },
}

const PASSWORD = 'precision2026'

export function authenticate(username: string, password: string): User | null {
  if (password !== PASSWORD) return null
  return USERS[username.toLowerCase()] ?? null
}

export function getUser(username: string): User | null {
  return USERS[username.toLowerCase()] ?? null
}

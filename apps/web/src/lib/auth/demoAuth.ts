export interface DemoUser {
  username: string;
  email: string;
  password: string;
}

const STORAGE_KEY = 'nexs_demo_users';
const SESSION_KEY = 'nexs_demo_session';

export const DEMO_CREDENTIALS = {
  email: 'demo@nexs.com',
  password: 'demo123456',
};

function readUsers(): DemoUser[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: DemoUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function ensureDemoUser(): DemoUser {
  const users = readUsers();
  const exists = users.some((user) => user.email === DEMO_CREDENTIALS.email);

  if (!exists) {
    const demoUser: DemoUser = {
      username: 'Usuario Demo',
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    };
    writeUsers([...users, demoUser]);
    return demoUser;
  }

  return users.find((user) => user.email === DEMO_CREDENTIALS.email) as DemoUser;
}

export function loginDemo(email: string, password: string) {
  const users = readUsers();
  const demoUser = ensureDemoUser();
  const user = users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user && !(email === demoUser.email && password === demoUser.password)) {
    return { ok: false, error: 'Credenciales inválidas' };
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email,
        username: user?.username || demoUser.username,
      })
    );

    // Marcar sesión demo como autenticada para el layout de wallet.
    localStorage.setItem('access_token', 'demo-access-token');
    localStorage.setItem('refresh_token', 'demo-refresh-token');
    sessionStorage.setItem('user_pin', '000000');
  }

  return {
    ok: true,
    user: user || demoUser,
  };
}

export function registerDemo(username: string, email: string, password: string) {
  const users = readUsers();

  if (users.some((user) => user.email === email)) {
    return { ok: false, error: 'Este correo ya está registrado' };
  }

  const newUser = { username, email, password };
  writeUsers([...users, newUser]);

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ email, username })
    );
    localStorage.setItem('access_token', 'demo-access-token');
    localStorage.setItem('refresh_token', 'demo-refresh-token');
    sessionStorage.setItem('user_pin', '000000');
  }

  return { ok: true, user: newUser };
}

export function getSessionUser() {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

const state = {
  migrations: false,
};

type PropNames = keyof typeof state;

export function setReady(prop: PropNames, value: boolean) {
  state[prop] = value;
}

export function isReady() {
  return Object.values(state).every(Boolean);
}

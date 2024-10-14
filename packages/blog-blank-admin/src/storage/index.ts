class SafeStorage {
  private store: Storage;
  constructor(store: Storage) {
    this.store = store;
  }

  set(key: string, val: any) {
    this.store.setItem(key, JSON.stringify(val));
  }

  get<T>(key: string) {
    try {
      const json: any = this.store.getItem(key);
      return JSON.parse(json) as T;
    } catch (err) {
      return null;
    }
  }

  remove(key: string) {
    this.store.removeItem(key);
  }

  clear() {
    this.store.clear();
  }

  getInstance() {
    return this.store;
  }
}

export const Local = new SafeStorage(self.localStorage);
export const Session = new SafeStorage(self.sessionStorage);

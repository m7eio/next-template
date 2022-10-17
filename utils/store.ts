import store from "store";

export default class Store {
  private key;

  constructor(key: string) {
    this.key = key;
  }

  set(key: string, value: any) {
    const isExist = store.get(this.key);
    if (!isExist) {
      store.set(this.key, {});
    }

    const newData = { ...isExist, [key]: value };

    store.set(this.key, newData);
  }

  get(key: string) {
    const data = store.get(this.key);

    if (!data) {
      store.set(this.key, {});
    }

    return data[key];
  }
}

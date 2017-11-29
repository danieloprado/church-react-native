export class Container {
  private services: { [key: string]: any };
  private instances: { [key: string]: any };

  constructor() {
    this.services = {};
    this.instances = {};
  }

  public register<T>(key: string, factory: (container: Container) => T): void {
    if (this.services[key]) {
      throw new Error('service-duplicated: ' + key);
    }

    this.services[key] = factory;
  }

  public get<T>(key: string): T {
    if (!this.services[key]) {
      throw new Error('service-not-found: ' + key);
    }

    if (!this.instances[key]) {
      this.instances[key] = this.services[key](this);
    }

    return this.instances[key];
  }
}

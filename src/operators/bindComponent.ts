import { Observable } from 'rxjs/Observable';
import { Subscriber, Subscription } from 'rxjs/Rx';

import { BaseComponent } from '../components/base';

function bindComponent<T>(this: Observable<T>, component: BaseComponent): Observable<T> {
  return this.lift(new BindComponentOperator(component));
}

Observable.prototype.bindComponent = bindComponent;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name
  interface Observable<T> { bindComponent: typeof bindComponent; }
}

class BindComponentOperator {
  constructor(private component: BaseComponent) { }

  public call(subscriber: Subscriber<any>, source: Observable<any>): Subscription {
    const subscription = source.subscribe(subscriber);

    if (this.component.subscriptions) {
      this.component.subscriptions.push(subscription);
    }

    return subscription;
  }
}
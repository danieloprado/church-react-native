import { Component } from 'react';
import {
  NavigationAction,
  NavigationActions,
  NavigationNavigateActionPayload,
  NavigationRoute,
  NavigationScreenProp,
} from 'react-navigation';
import { Subscription } from 'rxjs';

import { alertError } from '../providers/alert';
import { InteractionManager } from '../providers/interactionManager';
import { BaseValidator } from '../validators/base';

export interface IStateBase<T = any> {
  model?: Partial<T>;
  validation?: {
    [key: string]: string;
  };
}

export abstract class BaseComponent<S extends IStateBase = IStateBase, P = any> extends Component<P, S> {
  public subscriptions: Subscription[];
  public params: any;
  public navigation?: NavigationScreenProp<NavigationRoute<any>, NavigationAction>;

  private unmonted: boolean;

  constructor(props: any) {
    super(props);

    this.subscriptions = [];
    this.params = {};
    this.unmonted = false;

    this.navigation = (this.props as any).navigation;

    if (this.navigation) {
      this.params = this.navigation.state.params || {};
    }
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.unmonted = true;
  }

  public setState<K extends keyof S>(f: (prevState: S, props: P) => Pick<S, K>, callback?: () => any): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>, skip: boolean): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>, skip?: any): Promise<void>;
  public setState(state: any, skip: any): Promise<void> {
    if (this.unmonted) return Promise.resolve();

    return new Promise(resolve => {
      if (skip) {
        return super.setState(state as any, () => resolve());
      }

      return InteractionManager.runAfterInteractions(() => {
        if (this.unmonted) return;
        super.setState(state as any, () => resolve());
      });
    });
  }

  protected openDrawer(): void {
    this.navigate('DrawerOpen');
  }

  protected goBack(): void {
    this.navigation.goBack();
  }

  protected navigate(routeName: string, params?: any, reset?: any): void {
    if (!reset) {
      this.navigation.navigate(routeName, params);
      return;
    }

    this.navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName, params })]
    }));
  }

  protected navigateBuild(routes: NavigationNavigateActionPayload[]): void {
    this.navigation.dispatch(NavigationActions.reset({
      index: routes.length - 1,
      key: null,
      actions: routes.map(route => NavigationActions.navigate(route))
    }));
  }

  protected updateModel(key: string, value: string): void;
  protected updateModel(validator: BaseValidator<any>, key: string, value: string): void;
  protected updateModel(validator: any, key: string, value?: string): void {
    if (arguments.length === 2) {
      key = validator;
      validator = null;
    }

    let { model } = this.state as any;
    model[key] = value;

    if (!validator) {
      this.setState({ validation: {}, model }, true);
      return;
    }

    validator.validate(model)
      .logError()
      .bindComponent(this)
      .subscribe(({ model, errors }: any) => {
        this.setState({ validation: errors, model }, true);
      }, (err: any) => alertError(err).subscribe());
  }

}
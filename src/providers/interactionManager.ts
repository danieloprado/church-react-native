import { InteractionManager as OriginalInteractionManager } from 'react-native';

// tslint:disable-next-line:variable-name
export const InteractionManager = {
  ...OriginalInteractionManager,
  runAfterInteractions: (callback: Function) => {
    // ensure callback get called, timeout at 500ms
    // @gre workaround https://github.com/facebook/react-native/issues/8624

    return new Promise<void>(resolve => {
      let called = false;
      const timeout = setTimeout(() => {
        called = true;
        callback();
        resolve();
      }, 1000);

      OriginalInteractionManager.runAfterInteractions(() => {
        if (called) return;

        clearTimeout(timeout);
        callback();
        resolve();
      });
    });
  }
};
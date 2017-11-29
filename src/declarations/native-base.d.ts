import * as React from 'react';
import * as ReactNative from 'react-native';

declare module "native-base" {
  namespace NativeBase {
    interface Button extends ReactNative.TouchableOpacityProperties {
      accent?: boolean;
      footer?: boolean;
      formButton?: boolean;
      first?: boolean;
      last?: boolean;
    }

    interface Item {
      label?: string;
      value?: any;
    }

    interface Content {
      keyboardShouldPersistTaps?: 'handled';
      refreshControl?: any;
    }

    interface Tabs {
      prerenderingSiblingsNumber?: number;
      tabBarUnderlineStyle?: any;
      contentProps?: any;
    }

    interface TabHeading {
      style?: any;
    }

    interface Header {
      hasSegment?: boolean;
    }

    interface Picker {
      renderHeader?: any;
    }

  }

}
import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Title, View } from 'native-base';
import * as React from 'react';
import { Share, WebView } from 'react-native';

import { BaseComponent, IStateBase } from '../../components/base';
import { ErrorMessage } from '../../components/errorMessage';
import { informativeRender } from '../../formatters/informativeRender';
import { IInformative } from '../../interfaces/informative';
import * as services from '../../services';
import { enInformativeType } from '../../services/enums/informativeType';
import { IInformativeService } from '../../services/interfaces/informative';

interface IState extends IStateBase {
  loading: boolean;
  informative?: IInformative;
  html: string;
  text?: string;
  error?: any;
}

export default class InformativeDetailsPage extends BaseComponent<IState> {
  private informativeService: IInformativeService;

  constructor(props: any) {
    super(props);

    this.informativeService = services.get('informativeService');
    const { informative } = this.params;

    this.state = {
      loading: informative ? false : true,
      informative,
      html: informative ? informativeRender(informative) : null
    };
  }

  public componentDidMount(): void {
    if (this.state.informative) return;

    this.informativeService.get(this.params.id)
      .logError()
      .bindComponent(this)
      .subscribe(informative => {
        const html = informative ? informativeRender(informative) : null;
        this.setState({ loading: false, informative, html, error: !informative });
      }, error => this.setState({ loading: false, error }));
  }

  public share(): void {
    Share.share({
      title: this.state.informative.title,
      message: this.state.text
    });
  }

  public setText(text: string): void {
    this.setState({ text });
  }

  public render(): JSX.Element {
    const { loading, html, informative, error } = this.state;
    let title = 'Informativo';

    if (informative) {
      title = informative.typeId === enInformativeType.cell ? 'Célula' : 'Igreja';
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
            {informative &&
              <Button transparent onPress={() => this.share()}>
                <Icon name='share' />
              </Button>
            }
          </Right>
        </Header>
        {loading &&
          <Content>
            <Spinner />
          </Content>
        }
        {!loading && error &&
          <Content>
            <ErrorMessage error={error} />
          </Content>
        }
        {!loading && !error &&
          <View style={{ flex: 1 }}>
            <WebView
              source={{ html }}
              onMessage={event => this.setText(event.nativeEvent.data)}
              style={{ flex: 1 }} />
          </View>
        }
      </Container>
    );
  }
}
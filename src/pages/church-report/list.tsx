import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Fab,
  Header,
  Icon,
  Left,
  Right,
  Text,
  Title,
  View,
} from 'native-base';
import * as React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { EmptyMessage } from '../../components/emptyMessage';
import { ErrorMessage } from '../../components/errorMessage';
import { dateFormatter } from '../../formatters/date';
import { IChurchReport } from '../../interfaces/churchReport';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { IChurchReportService } from '../../services/interfaces/chuchReport';
import { theme } from '../../theme';

interface IState extends IStateBase {
  refreshing: boolean;
  reports: IChurchReport[];
  error?: any;
}

export default class ChurchReportListPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Relatório de Culto' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='list-box' style={{ color: tintColor }} />
    )
  };

  private churchReportService: IChurchReportService;

  constructor(props: any) {
    super(props);

    this.churchReportService = services.get('churchReportService');
    this.state = { refreshing: true, error: false, reports: [] };
  }

  public componentDidMount(): void {
    this.load();
  }

  public load(refresh: boolean = false): void {
    this.setState({ refreshing: true }, true);

    this.churchReportService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(reports => {
        this.setState({ refreshing: false, error: false, reports: reports || [] });
      }, error => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public render(): JSX.Element {
    const { refreshing, reports, error } = this.state;

    return (
      <Container style={theme.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Relatório de Culto</Title>
          </Body>
          <Right />
        </Header>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this.load(true)}
            />
          }>
          {error && !reports.length &&
            <ErrorMessage error={error} />
          }
          {!refreshing && !error && !reports.length &&
            <EmptyMessage icon='list' message='Nenhum relatório criado' />
          }
          {!!reports.length &&
            <View style={StyleSheet.flatten([theme.cardsPadding, theme.fabPadding])}>
              {reports.map(report =>
                <Card key={report.id}>
                  <CardItem header>
                    <Left style={styles.leftWrapper}>
                      <View style={styles.leftView}>
                        <Text style={styles.day}>{dateFormatter.format(report.date, 'DD')}</Text>
                        <Text style={styles.month}>{dateFormatter.format(report.date, 'MMM')}</Text>
                      </View>
                    </Left>
                    <Body>
                      <Text>{report.title}</Text>
                      <Text note>{report.type.name}</Text>
                    </Body>
                    <Right style={styles.rightWrapper}>
                      <Button transparent dark onPress={() => this.navigate('ChurchReportForm', { report })}>
                        <Icon name='create' style={styles.buttonIcon} />
                      </Button>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Grid>
                        <Col style={styles.row}>
                          <Text style={styles.counter}>{report.totalMembers}</Text>
                          <Text style={styles.label}>Memb.</Text>
                        </Col>
                        <Col style={styles.row}>
                          <Text style={styles.counter}>{report.totalNewVisitors}</Text>
                          <Text style={styles.label}>Visit.</Text>
                        </Col>
                        <Col style={styles.row}>
                          <Text style={styles.counter}>{report.totalFrequentVisitors}</Text>
                          <Text style={styles.label}>Freq.</Text>
                        </Col>
                        <Col style={styles.row}>
                          <Text style={styles.counter}>{report.totalKids}</Text>
                          <Text style={styles.label}>Crian.</Text>
                        </Col>
                        <Col style={styles.row}>
                          <Text style={styles.counterTotal}>{report.total}</Text>
                          <Text style={styles.labelTotal}>Total</Text>
                        </Col>
                      </Grid>
                    </Body>
                  </CardItem>
                </Card>
              )}
            </View>
          }
        </Content>
        <Fab onPress={() => this.navigate('ChurchReportForm')}>
          <Icon name='add' />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  leftWrapper: {
    maxWidth: 50,
    opacity: 0.5,
    flexDirection: 'column'
  },
  rightWrapper: {
    maxWidth: 50
  },
  leftView: {
    marginLeft: -5,
    marginTop: -2
  },
  day: {
    fontSize: 20,
    textAlign: 'center'
  },
  month: {
    marginTop: -5,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  counter: {
    fontSize: 20,
    opacity: 0.5
  },
  counterTotal: {
    fontSize: 20
  },
  label: {
    fontSize: 14,
    opacity: 0.5
  },
  labelTotal: {
    fontSize: 14
  },
  buttonIcon: {
    fontSize: 25
  }
});
import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Title } from 'native-base';
import * as React from 'react';

import { BaseComponent, IStateBase } from '../../components/base';
import { Field } from '../../components/field';
import { ISelectItem } from '../../interfaces/selectItem';
import { IUser } from '../../interfaces/user';
import { alertError } from '../../providers/alert';
import * as services from '../../services';
import { IAddressService } from '../../services/interfaces/address';
import { IProfileService } from '../../services/interfaces/profile';
import { ProfileValidator } from '../../validators/profile';

const genderOptions = [
  { value: null, display: 'Não informado' },
  { value: 'm', display: 'Masculino' },
  { value: 'f', display: 'Feminino' },
];

interface IState extends IStateBase<IUser> {
  states: ISelectItem[];
  cities: ISelectItem[];
}

export default class ProfileEditPage extends BaseComponent<IState> {
  private profileValidator: ProfileValidator;
  private addressService: IAddressService;
  private profileService: IProfileService;

  constructor(props: any) {
    super(props);

    this.profileValidator = new ProfileValidator();
    this.addressService = services.get('addressService');
    this.profileService = services.get('profileService');

    this.state = {
      model: this.params.profile,
      states: this.addressService.getStates(),
      cities: this.addressService.getCities(this.params.profile.state)
    };
  }

  public updateModel(validator: any, key: string, value?: string): void {
    if (key === 'state') {
      const cities = this.addressService.getCities(value);
      this.setState({ cities }, true);
    }

    super.updateModel(validator, key, value);
  }

  public save(): void {
    console.log(this.state.model);
    this.profileValidator.validate(this.state.model)
      .do(({ model, errors }) => this.setState({ validation: errors, model }, true))
      .filter(({ valid }) => valid)
      .switchMap(({ model }) => this.profileService.save(model).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => {
        this.goBack();
      }, err => alertError(err).subscribe());
  }

  public render(): JSX.Element {
    let { model, validation, states, cities } = this.state;
    validation = validation || {};

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Atualizar Perfil</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.save()}>
              <Icon name='checkmark' />
            </Button>
          </Right>
        </Header>
        <Content padder keyboardShouldPersistTaps='handled'>
          <Form>
            <List>
              <Field
                label='Nome'
                icon='person'
                ref='firstName'
                type='text'
                value={model.firstName}
                error={validation.firstName}
                next={() => this.refs.lastName}
                onChange={this.updateModel.bind(this, this.profileValidator, 'firstName')}
              />
              <Field
                label='Sobrenome'
                icon='empty'
                ref='lastName'
                type='text'
                value={model.lastName}
                error={validation.lastName}
                next={() => this.refs.email}
                onChange={this.updateModel.bind(this, this.profileValidator, 'lastName')}
              />

              <Field
                label='Email'
                icon='mail'
                ref='email'
                type='email'
                value={model.email}
                error={validation.email}
                next={() => this.refs.gender}
                onChange={this.updateModel.bind(this, this.profileValidator, 'email')}
              />
              <Field
                label='Sexo'
                icon='male'
                ref='gender'
                type='dropdown'
                value={model.gender}
                options={genderOptions}
                error={validation.gender}
                next={() => this.refs.birthday}
                onChange={this.updateModel.bind(this, this.profileValidator, 'gender')}
              />
              <Field
                label='Aniversário'
                icon='calendar'
                ref='birthday'
                type='date'
                value={model.birthday}
                error={validation.birthday}
                next={() => this.refs.zipcode}
                onChange={this.updateModel.bind(this, this.profileValidator, 'birthday')}
              />

              <Field
                label='Cep'
                icon='pin'
                ref='zipcode'
                type='zipcode'
                value={model.zipcode}
                error={validation.zipcode}
                next={() => this.refs.address}
                onChange={this.updateModel.bind(this, this.profileValidator, 'zipcode')}
              />
              <Field
                label='Endereço'
                icon='empty'
                ref='address'
                type='text'
                value={model.address}
                error={validation.address}
                next={() => this.refs.number}
                onChange={this.updateModel.bind(this, this.profileValidator, 'address')}
              />
              <Field
                label='Número'
                icon='empty'
                ref='number'
                type='text'
                value={model.number}
                error={validation.number}
                next={() => this.refs.complement}
                onChange={this.updateModel.bind(this, this.profileValidator, 'number')}
              />
              <Field
                label='Complemento'
                icon='empty'
                ref='complement'
                type='text'
                value={model.complement}
                error={validation.complement}
                next={() => this.refs.neighborhood}
                onChange={this.updateModel.bind(this, this.profileValidator, 'complement')}
              />
              <Field
                label='Bairro'
                icon='empty'
                ref='neighborhood'
                type='text'
                value={model.neighborhood}
                error={validation.neighborhood}
                next={() => this.refs.state}
                onChange={this.updateModel.bind(this, this.profileValidator, 'neighborhood')}
              />
              <Field
                label='Estado'
                icon='empty'
                value={model.state}
                ref='state'
                type='dialog'
                options={states}
                error={validation.state}
                next={() => this.refs.city}
                onChange={this.updateModel.bind(this, this.profileValidator, 'state')}
              />
              <Field label='Cidade'
                icon='empty'
                value={model.city}
                ref='city'
                type='dialog'
                options={cities}
                error={validation.city}
                onChange={this.updateModel.bind(this, this.profileValidator, 'city')}
                onSubmit={() => this.save()}
              />
            </List>
          </Form>
        </Content>
      </Container>
    );
  }
}

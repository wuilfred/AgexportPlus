import React, {Component} from 'react';
import {Container,Header,Title,Content,Button,Icon,Right,Body,Left,Picker,Form, Item, Input, Label, Toast, 
        View, Text, TextInpu, List, ListItem } from "native-base";
import Styles from '../utils/Styles';
import { Switch, KeyboardAvoidingView } from 'react-native';
//import { Switch } from 'react-native-switch';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';
import { area, newDataValidation, updateDataValidation } from '../actions/contacts';
//updateDataValidation
import axios from 'axios';


class EditarModal extends Component {
  
  /*constructor(props) {
    super(props);
    this.state = {
      selected: "F",
     
    };
  }*/

  state = {
    loading:            false,
    error:              false,
    messageError:       '',
    modalVisible:       false,
    area:               this.props.area,
    documentID:         [],
    //session id is used contact/company
    session_id:         this.props.contact.data.session_id,
    c_contact_id:       this.props.contact.data.c_contact_id,
    //data contact
    firstname1:         this.props.contact.data.firstname1,
    lastname1:          this.props.contact.data.lastname1,
    selectedSex:        this.props.contact.data.genere,
    selectedDocument:   this.props.contact.data.personal_id_type,
    nameDocu:           this.props.contact.data.personal_id === 'null' ? '' : this.props.contact.data.personal_id,
    selectedToDay:      (this.props.contact.data.e_today == 'Y') ? true : false,
    selectedSector:     this.props.contact.data.e_sector == 'Y' ? true : false,
    selectedInfoEce:    this.props.contact.data.e_ece === 'Y' ? true : false,
    selectedCompeti:    this.props.contact.data.e_competivity === 'Y' ? true : false,
    selectedInfoVupe:   this.props.contact.data.e_vupe === 'Y' ? true : false,
    selectedUrgent:     this.props.contact.data.e_urgent === 'Y' ? true : false,
    phone1:             this.props.contact.data.phone1,
    contact:            this.props.contact,
    email:              this.props.contact.data.email1,
    rol:                this.props.current_rol,
    //data enterprice
    c_bpartner_id:      this.props.contact.data.Company.c_bpartner_id,
    emailCompany:       this.props.contact.data.Company.email,
    mail_review:        this.props.contact.data.Company.mail_review === 'Y' ? true : false,
    nameCompany:        this.props.contact.data.Company.name,
    phoneCompany:       this.props.contact.data.Company.phone,
    phone2Company:      this.props.contact.data.Company.phone2,
    addressCompany:     this.props.contact.data.Company.address,
    switchValue:        true,
  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    this.getInfoContact();
    this.setState({ typeUser: params.typeUser});
  }

  getInfoContact = () => {
    const { session_id } = this.state;
    const UrlGetInfo = `http://aeapi.iflexsoftware.com/contact/catalog.json`;
    const that = this;
        that.setState({ loading: true });
		axios.get(UrlGetInfo)
  		.then(function (response) {
            const data =  response.data;
            console.log(data);
            const { AREAS, CATEGORIA, PERSONAL_ID, PUESTO } = response.data;
            that.props.dispatch(area(data));
            that.setState({ loading: false, documentID: PERSONAL_ID});
  		})
  		.catch(function (error) {
            that.setState({ loading: false })
            if(error.response){
                const { error } = error.response.data;
                const { message } = error;                    
                Toast.show({
                    text: message,
                    position: 'top',
                    buttonText: 'Ok',
                    type:'danger',
                    duration:5000
                });
            }else{
                Toast.show({
                    text: 'Ocurrió un problema, intenta más tarde',
                    position: 'top',
                    buttonText: 'Ok',
                    type:'danger',
                    duration:5000
                });   
            }
  		});
  }


  updateInfoContact = () => {
    
    const that = this;
    const { c_contact_id, firstname1, lastname1, selectedDocument, nameDocu, selectedSex, selectedToDay, selectedSector, 
            selectedInfoEce, selectedCompeti, selectedInfoVupe, selectedUrgent, phone1, email, rol, c_bpartner_id,
            emailCompany, mail_review, nameCompany, phoneCompany, phone2Company, addressCompany } = that.state;
   
    //that.setState({ loading: true });
    const { params } = this.props.navigation.state;
    const { session_id, typeUser } = params;
    const UrlUpInfor = typeUser === 'contact' ? `http://aeapi.iflexsoftware.com/contact.json` : `http://aeapi.iflexsoftware.com/contact/bpartner.json`;
    if(typeUser==='contact'){
        validUser = {
                c_contact_id: c_contact_id,
                session_id: session_id,
                e_today: (selectedToDay === true) ? 'Y' : 'N',
                firstname1,
                lastname1,
                personal_id: nameDocu,
                personal_id_type: selectedDocument,
                genere: selectedSex, 
                e_competivity: selectedCompeti === true ? 'Y' : 'N',
                e_ece: selectedInfoEce === true ? 'Y' : 'N',
                e_sector: (selectedSector === true) ? 'Y' : 'N', 
                e_today: (selectedToDay === true) ? 'Y' : 'N',
                e_urgent: selectedUrgent === true ? 'Y' : 'N',
                e_vupe: selectedInfoVupe === true ? 'Y' : 'N',
                email1: email,
                phone1: phone1
        }
    }else{
        validUser = {
            c_bpartner_id,
            session_id,
            email: emailCompany,
            mail_review: mail_review === true ? 'Y' : 'N',
            name: nameCompany,
            phone: phoneCompany,
            phone2: phone2Company,
            address: addressCompany
        }
    }
    console.log(validUser);
    axios.put(UrlUpInfor, validUser).then(function (response) {
        /** Begin */
        const urlProfile = `http://aeapi.iflexsoftware.com/contact.json/${session_id}/profile`;
            //that.setState({ loading: true });
            axios.get(urlProfile)
            .then(function (responseProfile) {
                console.log(responseProfile);
                //that.setState({ loading: false });
                const { data } = responseProfile;
                console.log('data')
                console.log(data)
                that.props.dispatch(updateDataValidation(data));
                Toast.show({
                    text: 'Dato Contacto Actualizados Correctamente!',
                    position: 'top',
                    buttonText: 'Ok',
                    type:'success',
                    duration:5000
                });
            })
            .catch(function (errorActivities) {
                console.log(errorActivities);
                that.setState({ loading: false })
                if(errorActivities.response){
                    const { error } = errorActivities.response.data;
                    const { message } = error;                    
                    Toast.show({
                        text: message,
                        position: 'top',
                        buttonText: 'Ok',
                        type:'danger',
                        duration:5000
                    });
                }else{
                    Toast.show({
                        text: 'Ocurrió un problema, intenta más tarde',
                        position: 'top',
                        buttonText: 'Ok',
                        type:'danger',
                        duration:5000
                    });   
                }
            });
        /** END */
        //typeUser == 'contact' ? '' : that.props.navigation.goBack();
    }).catch(function(errorupdate){
        that.setState({ loading: false })
        if(errorupdate.response){
            const { error } = errorupdate.response.data;
            const { message } = error;
            Toast.show({
                text: message,
                position: 'top',
                buttonText: 'Ok',
                type:'danger',
                duration:5000
            });
        }else{
            Toast.show({
                text: 'Ocurrió un problema, intenta más tarde',
                position: 'top',
                buttonText: 'Ok',
                type:'danger',
                duration:5000
            });   
        } 
    });
  }

    onValueChangeSex(value) {
        this.setState({
            selectedSex: value,
        });
    }

    onValueChangeDoc = ( value ) => {
        this.setState({
            selectedDocument: value,
        });
    }

    _handleToggleSwitchToDay = (value) => {
        //this.setState(state => ({ selectedToDay: value }))
        console.log('selectedtoday ', value);
        this.setState({ selectedToDay: value  });
    };

    onValueChangeSector = ( value ) => {
        this.setState( state =>  ({ selectedSector: value }));
      }
    
      onValueChangeEce = (value) => {
        this.setState(state => ({ selectedInfoEce: value }));
      }
    
      onValueChangeCompet = (value) =>{
        this.setState({
            selectedCompeti: value,
        });
      }
    
      onValueChangeVupe = (value) => {
        this.setState({
            selectedInfoVupe: value,
        });
       
      }
      
      onValueChangeUrgent = (value) =>{
        this.setState({ selectedUrgent: value });
        
      }
    
      handleDocument = (value) => {
        this.setState({ nameDocu: value })
      }
    
      handlePhone = (number) => {
          this.setState({ phone1: number})
      }
    
      handleFirstname = (value) => {
        this.setState({ firstname1: value})
      }
    
      handleLastname = (value) => {
        this.setState({ lastname1: value})
      }
    
      handleEmail = (value) => {
        this.setState({ email: value})
      }
    
      handleEmailCompany = (value) => {
        this.setState({ emailCompany: value})
      }
    
      handleEmailCompanyReview = (value) => {
        this.setState({ mail_review: value})
      }
    
      handleNameCompany = (value) => {
        this.setState({ nameCompany: value})
      }
      
      handlePhoneCompany = (value ) => {
        this.setState({ phoneCompany: value})
      }
    
      handlePhone2Company = ( value ) => {
        this.setState({ phone2Company: value})
      }
    
      handleAddressCompany = (value) => {
        this.setState({ addressCompany: value})
      }

  render() {
        const { loading, error, messageError, documentID, typeUser } = this.state
        const { session_id, area, contact } = this.props;
        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center',alignItems: 'center' }}>
                    
                </View>
            )
        }

        if (error) {
            return (
                <View style={styles.center}>
                    <Text>
                        { messageError }
                    </Text>
                </View>
            )
        }
        return (
                <Container>
                    <Header style={Styles.headerStyle}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon style={{ color: '#FFFFFF'}} name="arrow-back" />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            <Title style={Styles.colorStyle}>Editar Información</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content style={Styles.backgroundContainer}>
                    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>

                    <View style={ Styles.paddingLRT20 }>
                    
                        <List>
                            <ListItem itemDivider>
                                <Text>Información general:</Text>
                            </ListItem>
                            { typeUser === 'contact' && 
                                <Form>
                                    <Item floatingLabel>
                                        <Label>Nombre</Label>
                                        <Icon active name='md-person' />
                                        <Input
                                            value={this.state.firstname1} />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label>Apellido</Label>
                                        <Icon active name='md-person' />
                                        <Input value={this.state.lastname1} />
                                    </Item>
                                    <View >
                                        <Left>
                                            <Label >Genero</Label>
                                        </Left>
                                        
                                        <Picker
                                            mode="dropdown"
                                            iosHeader="Genero"
                                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                                            placeholder="Seleccione Sexo"
                                            style={{ width: undefined }}
                                            
                                            selectedValue={this.state.selectedSex}
                                            onValueChange={this.onValueChangeSex.bind(this)}
                                            >
                                            <Picker.Item label="Femenino" value="F" />
                                            <Picker.Item label="Masculino" value="M" />

                                        </Picker>
                                        
                                    </View> 
                                    <View>
                                        <Left>
                                            <Icon name="paper"></Icon>
                                        </Left>
                                        <Picker
                                            mode="dropdown"
                                            iosHeader="Documento"
                                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                                            placeholder="Selecione Tipo Documento"
                                            style={{ width: undefined }}
                                            selectedValue={ this.state.selectedDocument }
                                            onValueChange={ this.onValueChangeDoc.bind(this) }
                                            >
                                            {   documentID.map((itemDocument, key)=> {
                                                    return (
                                                        <Picker.Item label={itemDocument.name} key={key} value={ itemDocument.name } />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </View> 
                                    <Item floatingLabel>
                                        <Icon name="paper"></Icon>
                                        <Label >No. Documento: </Label>
                                        <Input 
                                            onChangeText={ this.handleDocument } 
                                            value={this.state.nameDocu}
                                            />
                                    </Item>
                                    <Item floatingLabel>
                                        <Icon active name='mail' />
                                        <Label>Email</Label>
                                        <Input 
                                            placeholder="Email" 
                                            onChangeText={ this.handleEmail } 
                                            value={this.state.email}
                                            />
                                    </Item>

                                    <ListItem>
                                        <Left>
                                            <Text>Agexport Hoy: </Text>
                                        </Left>
                                   
                                        <Right>
                                            <Switch
                                                //onPress={() => this.updateInfoContact() }
                                                onValueChange={this._handleToggleSwitchToDay}
                                                value={this.state.selectedToDay}
                                            />
                                        </Right>
                                    </ListItem>

                                      <ListItem>
                                        <Left>
                                            <Text>Boletín Sectorial: </Text>
                                        </Left>
                                   
                                        <Right>
                                            <Switch
                                            onValueChange={this.onValueChangeSector}
                                            value={this.state.selectedSector}
                                            />
                                        </Right>
                                    </ListItem>


                                    <ListItem>
                                        <Left>
                                            <Text>Información Cursos ECE: </Text>
                                        </Left>
                                   
                                        <Right>
                                            <Switch
                                            onValueChange={this.onValueChangeEce}
                                            value={this.state.selectedInfoEce}
                                            />
                                        </Right>
                                    </ListItem>


                                     <ListItem>
                                        <Left>
                                            <Text>Información Cursos de Competitividad: </Text>
                                        </Left>
                                   
                                        <Right>
                                            <Switch
                                            onValueChange={this.onValueChangeCompet}
                                            value={this.state.selectedCompeti}
                                            />
                                        </Right>
                                    </ListItem>

                                    <ListItem>
                                        <Left>
                                            <Text>Información de Cursos Vupe: </Text>
                                        </Left>
                                   
                                        <Right>
                                            <Switch
                                            onValueChange={this.onValueChangeVupe}
                                            value={this.state.selectedInfoVupe}
                                            />
                                        </Right>
                                    </ListItem>

                                     <ListItem>
                                        <Left>
                                            <Text>Boletines Urgentes: </Text>
                                        </Left>
                    
                                        <Right>
                                            <Switch
                                            onValueChange={this.onValueChangeUrgent}
                                            value={this.state.selectedUrgent}
                                            />
                                        </Right>
                                    </ListItem>
                                    
                                    <Item floatingLabel>
                                        <Label>Numero de Telefono</Label>
                                        <Icon name="call"></Icon>
                                        <Input disabled onChangeText={ this.handlePhone }
                                                value={ this.state.phone1 }/>
                                    </Item>

                                     <Button style={Styles.btnActivar} full 
                                            onPress={() => this.updateInfoContact() }>
                                            <Text>Actualizar Datos</Text>
                                    </Button>
                                </Form>
                            }

                            { typeUser === 'company' &&
                            <Form>
                            <Item floatingLabel>
                                <Icon active name='mail' />
                                <Label>Email</Label>
                                <Input 
                                    onChangeText={ this.handleEmail } 
                                    value={this.state.email}
                                    />
                            </Item>
                           
                            <Item floatingLabel>
                                <Icon active name='person' />
                                <Label>Nombre Compania</Label>
                                <Input editable={false}
                                    onChangeText={ this.handleNameCompany } 
                                    value={this.state.nameCompany}
                                    />
                            </Item>
                            <Item floatingLabel>
                                <Icon active name='call' />
                                <Label>No. Telefono: </Label>
                                <Input 
                                    onChangeText={ this.handlePhoneCompany } 
                                    value={this.state.phoneCompany}
                                    />
                            </Item>
                            <Item floatingLabel>
                                <Icon active name='call' />
                                <Label>No. Telefono 2: </Label>
                                <Input 
                                    onChangeText={ this.handlePhone2Company } 
                                    value={ this.state.phone2Company }
                                    />
                            </Item>
                             <Item floatingLabel>
                                <Icon active name='home' />
                                <Label>Direccion Compañia: </Label>
                                <Input 
                                    onChangeText={ this.handleAddressCompany } 
                                    value={ this.state.addressCompany }
                                    />
                            </Item>

                             <ListItem>
                                <Left>
                                    <Text>Deseo Recibir por Correo Física la Revista DataXport: </Text>
                                </Left>
            
                                <Right>
                                    <Switch
                                    onValueChange={this.handleEmailCompanyReview}
                                    value={this.state.mail_review}
                                    />
                                </Right>
                            </ListItem>
                                   
                            <Button style={Styles.btnActivar} full 
                                    onPress={() => this.updateInfoContact() }>
                                <Text>Actualizar Datos</Text>
                            </Button>
                        </Form>
                        }
                        </List>
                       
                    </View>
                    </KeyboardAvoidingView>
                    </Content>
                </Container>
        );
    }

}

const mapStateToProps = (state) =>{
    const session_id = state.contacts.session_id;
    const area = state.contacts.area;
    const contact = state.contacts.contact;
    const current_rol = state.contacts.rol;
    return{
        session_id,
        area,
        contact,
        current_rol,
    }
}

export default connect(mapStateToProps)(EditarModal);
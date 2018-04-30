 import {    NEW_REGISTER, 
            NEW_OFFERS, 
            NEW_ROL, 
            NEW_DATA_VALIDATION, 
            NEW_ACTIVITIES, 
            NEW_PHONE_NUMBER, 
            NEW_INVITATION_CODE, 
            NEW_SESSION_ID, 
            LOGOUT_APP, 
            CHANGE_QR, 
            AREAS,
            UPDATE_DATA_VALIDATION } from '../actions/contacts';

const initialState = {
    isLoggedIn: false,
    info:{},
    contact:{},
    actividades: {},
    ofertas: {},
    session_id:null,
    phone: null,
    code: null,
    rol: null,
    code_qr: null,
    area: null,
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case NEW_REGISTER:
            return{
                ...state,
                info:action.contact,
            }
        case NEW_DATA_VALIDATION:
            return{
                ...state,
                isLoggedIn: !state.isLoggedIn,
                contact: action.contact
            }
        case NEW_PHONE_NUMBER:
            return {
                ...state,
                phone: action.phone
            }
        case NEW_INVITATION_CODE:
            return{
                ...state,
                code: action.code
            }
        case NEW_SESSION_ID:
            return{
                ...state,
                session_id: action.currentSession
            }
        case NEW_ACTIVITIES:
            return{
                ...state,
                actividades: action.listado
            }
        case NEW_ROL:
            return{
                ...state,
                rol: action.rol
            }
        case NEW_OFFERS:
            return{
                ...state,
                ofertas: action.ofertas
            }
        case UPDATE_DATA_VALIDATION:
            return{
                ...state,
                contact: action.contact
            }    
        case CHANGE_QR:
            return{
                ...state,
                code_qr: action.codeQR
            }
        case AREAS:
            return{
                ...state,
                area: action.area
            }
        case LOGOUT_APP:
            return initialState
        default:
            return initialState;
    }
};

export default reducer;

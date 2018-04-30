export const NEW_REGISTER = 'NEW_REGISTER';
export const CHANGE_CODE_SMS = 'CHANGE_CODE_SMS';
export const NEW_DATA_VALIDATION = 'NEW_DATA_VALIDATION';
export const NEW_PHONE_NUMBER = 'NEW_PHONE_NUMBER';
export const NEW_SESSION_ID   = 'NEW_SESSION_ID';
export const NEW_INVITATION_CODE = 'NEW_INVITATION_CODE';
export const NEW_ACTIVITIES = 'NEW_ACTIVITIES';
export const NEW_ROL = 'NEW_ROL';
export const NEW_OFFERS = 'NEW_OFFERS';
export const CHANGE_ASSISTANCE = 'CHANGE_ASSISTANCE';
export const LOGOUT_APP = 'LOGOUT_APP';
export const UPDATE_DATA_VALIDATION = 'UPDATE_DATA_VALIDATION';
export const CHANGE_QR = 'CHANGE_QR';
export const AREAS = 'AREAS';
export const NEW_DATA_PROFILE = 'NEW_DATA_PROFILE';

export const newRegister = (contact) => {
    return {
        type: NEW_REGISTER,
        contact
    };
};

export const savePhoneNumber = (phone) => {
    return {
        type: NEW_PHONE_NUMBER,
        phone
    }
}

export const saveInvitationCode = (code) => {
    return {
        type: NEW_INVITATION_CODE,
        code
    }
}

export const newDataValidation = (contact) => {
    return {
        type: NEW_DATA_VALIDATION,
        contact
    }
}

export const newSessionID = (currentSession) => {
    return {
        type: NEW_SESSION_ID,
        currentSession
    }
}

export const changeCodeSms = (code) => {
    return{
        type: CHANGE_CODE_SMS,
        code
    }
}

export const newActivities = (listado) => {
    return{
        type: NEW_ACTIVITIES,
        listado
    }
}

export const newDataProfile = (data) => {
    return{
        type: NEW_DATA_PROFILE,
        data
    }
}


export const newRol = (rol) => {
    return{
        type: NEW_ROL,
        rol
    }
}

export const newOffers = (ofertas) => {
    return{
        type: NEW_OFFERS,
        ofertas
    }
}

export const changeAssistance = () => {
    return {
        type: CHANGE_ASSISTANCE,
        ofertas
    }
}

export const changeQR = (codeQR) => {
    return{
        type: CHANGE_QR,
        codeQR
    }
}

export const updateDataValidation = (contact) => {
    return {
        type: UPDATE_DATA_VALIDATION,
        contact
    }
}

export const area = (area) => {
    return{
        type: AREAS,
        area
    }
}

export const logoutApp = () => {
    return{
        type: LOGOUT_APP,
    }
}


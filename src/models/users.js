export const defaultUser = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    roles: [],
};

export const usersDescription = {
    id: {
        descriptionFieldType: 'textField',
        editableField: false,
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'id',
    },
    firstName: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Имя',
    },
    lastName: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Фамилия',
    },
    email: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Email',
    },
    userName: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Имя пользователя',
    },
    password: {
        descriptionFieldType: 'textField',
        showInTable: false,
        flexValues: {
            xs12: true,
        },
        label: 'Пароль',
        type: 'password'
    },
    roles: {
        descriptionFieldType: 'selectField',
        convertFunction: (prop) => {
            return prop.map(role => role.roleName).join(', ')
        },
        flexValues: {
            xs12: true,
        },
        itemText: "roleName",
        itemValue: "id",
        multiple: true,
        returnObject: true,
        label: "Права",
        urlToGetSelectables: 'roles',
    }
};

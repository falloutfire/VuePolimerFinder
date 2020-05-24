export const defaultPolymer = {
    id: 0,
    fullName: "",
    shortName: "",
    casNumber: "",
    densityMin: 0.0,
    densityMax: 0.0,
    meltMin: 0,
    meltMax: 0,
    maxServiceTemp: 0,
    color: "",
    //monomersStructure: "",
    methodSynthesis: "",
};

export const polymerDescription = {
    id: {
        descriptionFieldType: 'textField',
        editableField: false,
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'id',
    },
    fullName: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Полное название',
    },
    shortName: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Аббревиатура ',
    },
    casNumber: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'CAS',
    },
    methodSynthesis: {
        descriptionFieldType: 'textArea',
        flexValues: {
            xs12: true
        },
        label: 'Метод синтеза',
        showInTable: false,
    },
    densityMin: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Плотность мин.',
        showInTable: false,
    },
    densityMax: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Плотность макс.',
        showInTable: false,
    },
    meltMin: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Темп. кипения мин.',
        showInTable: false,
    },
    meltMax: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Темп. кипения макс.',
        showInTable: false,
    },
    maxServiceTemp: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Макс. температура использования',
        showInTable: false,
    },
    color: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Цвет',
        showInTable: false,
    },
    /*monomersStructure: {
        descriptionFieldType: 'textField',
        flexValues: {
            xs12: true,
            sm6: true,
        },
        label: 'Структура мономера',
        showInTable: false,
    },*/
    blends: {
        descriptionFieldType: 'tableView',
        label: 'Совместимость',
        showInTable: false,
    }
};

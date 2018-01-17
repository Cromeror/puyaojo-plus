export default {
    cedula: {
        rules: [{
            required: true,
            message: 'Digite el número de cédula'
        }],
    },
    nombre: {
        rules: [{
            required: true,
            message: 'Digite el nombre de la persona'
        }],
    },
    correo: {
        rules: [{
            required: true,
            message: 'Digite el correo electrónico de la persona'
        }],
    }
}
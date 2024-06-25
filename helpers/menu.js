const getMenu = (role = 'USER_ROLE') => {
    const menu = [
        {
            title: 'Inicio',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Inicio', url: '/' },
                { title: 'Gráficas', url: 'grafics' },
                { title: 'Barras de progreso', url: 'progress' },
                { title: 'Promesas', url: 'promises' },
                { title: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            title: 'Mantenimiento',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                { title: 'Hospitales', url: 'hospitales' },
                { title: 'Médicos', url: 'medicos' }

            ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Usuarios', url: 'usuarios' });
    }

    return menu;
}

module.exports = { getMenu }
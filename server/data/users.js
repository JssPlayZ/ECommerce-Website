import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10), // Default password is '123456'
        isAdmin: true,
    },
    {
        name: 'JssAdmin',
        email: 'jss@admin.com',
        password: bcrypt.hashSync('jssadmin', 10),
        isAdmin: true,
    },
];

export default users;
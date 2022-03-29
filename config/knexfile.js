module.exports = {
    development: {
        client: "mysql",
        connection: {
            database: process.env.DB,
            user: process.env.USER,
            password: process.env.PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: `${__dirname}\\migrations`,
        },
    },
};

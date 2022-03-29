exports.up = function (knex) {
    return knex.schema.createTable("users ", (t) => {
        t.string("username", 50).notNull().primary();
        t.string("password").notNull();
        t.integer("employeeNumber").notNull().references("employeeNumber").inTable("employees");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};

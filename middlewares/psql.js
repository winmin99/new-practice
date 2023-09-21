const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "testDB",
    password: "root",
    port: 5432,
});
client.connect();
const query = {
    text: "INSERT INTO member VALUES ($1, $2)",
    values: [1, "홍길동"],
};
client
    .query(query)
    .then((res) => {
        console.log(res);
        client.end();
    })
    .catch((e) => console.error(e.stack));

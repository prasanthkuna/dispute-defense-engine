import Client, { Local, Environment } from "../client";

const client = new Client(Environment("staging"));

export default client;

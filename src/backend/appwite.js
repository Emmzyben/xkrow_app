import { Account, Client, ID, Databases, Query, Storage } from 'appwrite';
import { API_URL, API_KEY } from '@env';

const client = new Client()
    .setEndpoint(String(API_URL))
    .setProject(String(API_KEY));

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage, Query, ID }
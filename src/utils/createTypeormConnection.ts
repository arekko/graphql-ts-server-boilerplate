import { createConnection, getConnectionOptions } from 'typeorm';

export const createTypeormConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  console.log(connectionOptions)
  return  createConnection({...connectionOptions, name: "default" });
}


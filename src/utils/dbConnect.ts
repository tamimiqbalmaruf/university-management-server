import mongoose from 'mongoose';
import config from '../app/config';
import seedSuperAdmin from '../app/DB';

const dbConnect = async (): Promise<void> => {
  try {
    if (!config.database_url) {
      throw new Error('Database url is not defined');
    }
    await mongoose.connect(config.database_url as string);
    // console.log('Database is connected');
    await seedSuperAdmin();
  } catch (error: unknown | [message?: string] | string | undefined) {
    console.log(`Error connecting to database, ${error}`);
  }
};

export { dbConnect };

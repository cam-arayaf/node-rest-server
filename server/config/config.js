process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.URL_DB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : process.env.MONGO_URI;
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'dev-seed';
process.env.CLIENT_ID = process.env.CLIENT_ID || '737183209739-5cm9849s5g93cvfk6ol7lsmrqj6rmo3b.apps.googleusercontent.com';
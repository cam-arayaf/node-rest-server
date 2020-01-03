const dev_url_db = 'mongodb://localhost:27017/coffee';
const prod_url_db = 'mongodb+srv://cam-arayaf:RQlIWwKHqyTymr9G@cluster0-uir0v.mongodb.net/coffee';
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.URL_DB = process.env.NODE_ENV === 'dev' ? dev_url_db : prod_url_db;
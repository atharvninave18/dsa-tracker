import Localbase from 'localbase';

const db = new Localbase('dsa-tracker');
db.config.debug = false;

export default db;

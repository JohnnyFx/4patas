
class CidadesDAO {
  constructor (connection) {
    this._connection = connection;
  }

  lista(callback){
    this._connection.query('select * from cidades', callback);  
  }

  busca(id,callback){
        this._connection.query(`select * from cidades WHERE id=${id}`, callback);  
  }

}
module.exports = function() {
    return CidadesDAO;
  };
/*function TipoAmparosDAO(connection) {
    this._connection = connection;
}

TipoAmparosDAO.prototype.lista = function(callback) {
    this._connection.query('select * from tipoamparo', callback);
}

TipoAmparosDAO.prototype.salva = function(tipoamparo, callback) {
    this._connection.query('insert into tipoamparo set ?', tipoamparo, callback);
}

module.exports = function() {
    return TipoAmparosDAO;
};
*/

class TipoAmparosDAO {
  constructor (connection) {
    this._connection = connection;
  }

  lista(callback){
    this._connection.query('select * from tipoamparo', callback);  
  }

  salva(tipoamparo,callback){
    this._connection.query('insert into tipoamparo set ?', tipoamparo, callback);
  }

}

module.exports = function() {
    return TipoAmparosDAO;
  };
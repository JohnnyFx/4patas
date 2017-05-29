function AmparosDAO(connection) {
    this._connection = connection;
}

AmparosDAO.prototype.lista = function(callback) {
    this._connection.query('select latitude,longitude from amparos', callback);
}

AmparosDAO.prototype.salva = function(amparo, callback) {
    this._connection.query('insert into amparos set ?', amparo, callback);
}

module.exports = function() {
    return AmparosDAO;
};

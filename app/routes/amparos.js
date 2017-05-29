var request = require('request');
var removeAccents = require('remover-acentos');

module.exports = function(app) {

    app.get('/amparos',  function(req,res,next){
        let connection = app.infra.connectionFactory();
        let TipoAmparosDAO = new app.infra.TipoAmparosDAO(connection);
        let CidadesDAO = new app.infra.CidadesDAO(connection);
        let AmparosDAO = new app.infra.AmparosDAO(connection);

        let listaCidades;
        CidadesDAO.lista(function(err,results){
            listaCidades = results; 
        });

        
        let listaAmparos;
        AmparosDAO.lista(function(err,results){
            listaAmparos = results; 
        });

        console.log(listaAmparos);
        TipoAmparosDAO.lista(function(err, results) {
              res.format({
                html: function() {
                    res.render('amparos/form', { messages: req.flash('info'),listaTipos:results,listaCidades:listaCidades,listaAmparos:listaAmparos});
                },
                json: function() {
                    res.json(results);
                }
            });
        });
        connection.end();
     });

    app.post('/amparos', function(req, res) {
        let connection = app.infra.connectionFactory();
        let amparosDAO = new app.infra.AmparosDAO(connection);
        let CidadesDAO = new app.infra.CidadesDAO(connection);
 
        let amparo = req.body;
        amparo.data = new Date().toLocaleString();

        CidadesDAO.busca(amparo.cidade_id,function(erro,sucesso){
            cidade = removeAccents(sucesso[0].descricao);
            request(`https://maps.google.com/maps/api/geocode/json?address=${amparo.numero},${amparo.endereco},${cidade},SP`, function (error, response, body) {
           
            let localizacaoJson = JSON.parse(body); 
                   
            if(localizacaoJson.status == "OK"){
            
                let localizacaoValida = false;

                localizacaoJson.results[0].address_components.forEach(element => {
                      if(element.types == 'postal_code')
                            localizacaoValida = true;
                });

                if(!localizacaoValida){
                    req.flash('info', 'Não foi possível localizar o endereço');
                    res.redirect('/amparos');
                    return;
                }
                    amparo.latitude = localizacaoJson.results[0].geometry.location.lat;
                    amparo.longitude = localizacaoJson.results[0].geometry.location.lng;
                    
                    amparosDAO.salva(amparo, (err, results) => {
                        app.get('io').emit('novoAmparo', amparo);
                        req.flash('info', 'Adicionado com sucesso');
                        res.redirect('/amparos');
                    });
                    connection.end();
            }else{
                req.flash('info', 'Não foi possível localizar o endereço');
                res.redirect('/amparos');
                return;
            }
        });
     });
    });
}

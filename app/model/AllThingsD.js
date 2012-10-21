/**
 * All Things Digital model
 * @author Grgur Grisogono
 */
Ext.define('App.model.AllThingsD', {
    extend : 'App.model.AbstractFeed',

    config : {
        proxy : {
            type        : 'jsonp',
            callbackKey : 'callback',
            url         : 'http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20xml%20where%20url=%27http://allthingsd.com/feed/%27&format=json',

            reader : {
                type         : 'json',
                rootProperty : 'query.results.rss.channel.item'
            }
        }
    }
});
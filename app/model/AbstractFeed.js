/**
 * Abstract model
 * @author Grgur Grisogono
 */
Ext.define('App.model.AbstractFeed', {
    extend : 'Ext.data.Model',

    config : {
        fields: ['title', 'link', 'description']
    }
});
/**
 * AllThingsDigital feeds store
 * @author Grgur Grisogono
 */
Ext.define('App.store.AllThingsD', {
    extend : 'Ext.data.Store',

    uses : ['App.model.AllThingsD'],

    config : {
        autoLoad : true,
        storeId  : 'AllThingsD',
        model    : 'App.model.AllThingsD'
    }
});
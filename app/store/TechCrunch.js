/**
 * AllThingsDigital feeds store
 * @author Grgur Grisogono
 */
Ext.define('App.store.TechCrunch', {
    extend : 'Ext.data.Store',

    uses : ['App.model.TechCrunch'],

    config : {
//        autoLoad : true,
        storeId  : 'TechCrunch',
        model    : 'App.model.TechCrunch'
    }
});
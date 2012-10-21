/**
 *
 * @author Grgur Grisogono
 */
Ext.define('App.view.AllThingsD', {
    extend : 'Ext.dataview.List',
    xtype: 'allthingsd',

    config : {
        itemTpl : '{title}',
        store   : 'AllThingsD'
    }
});
/**
 *
 * @author Grgur Grisogono
 */
Ext.define('App.view.TechCrunch', {
    extend : 'Ext.dataview.List',
    xtype: 'TechCrunch',

    config : {
        itemTpl : '{title}',
        store   : 'TechCrunch'
    }
});
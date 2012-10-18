Ext.define("App.view.Main", {
    extend   : 'Ext.Container',
    requires : [
        'Ext.TitleBar',
        'Ext.dataview.List',
        'App.ux.ColumnCarousel'
    ],
    config   : {
        layout : 'fit',
        items  : [
            {
                xtype : 'columncarousel',
                items : [
                    {html : 'One', style: {background: '#e8a'}},
                    {html : 'Two', style: {background: '#573'}},
                    {html : 'Three', style: {background: '#8d4'}},
                    {html : 'Four', hidden : false, style: {background: '#87f'}},
                    {html : 'Five', hidden : false, style: {background: '#637'}},
                    {html : 'Six', hidden : false, style: {background: '#f34'}},
                    {html : 'BORDER', docked : 'left', width : 100, style: {background: '#999'}}
                ]
            },

            {
                xtype  : 'titlebar',
                docked : 'top',
                title  : '3-Col Carousel'
            }
        ]
    }
});

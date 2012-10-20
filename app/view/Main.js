Ext.define("App.view.Main", {
    extend : 'Ext.Container',
    xtype  : 'colcarexample',

    requires : [
        'Ext.TitleBar',
        'Ext.dataview.List',
        'App.ux.ColumnCarousel'
    ],

    config : {
        layout : 'fit',
        items  : [
            {
                xtype  : 'titlebar',
                docked : 'top',
                title  : '3-Col Carousel',
                items  : [
                    {
                        xtype      : 'sliderfield',
                        itemId     : 'numCols',
                        cls        : 'tbarslider',
                        label      : 'Cols',
                        labelWidth : 40,
                        value      : 3,
                        minValue   : 1,
                        maxValue   : 5
                    }
                ]
            }
        ],

        carousel : {
            items : [
                {html : 'One', style : {background : '#e8a'}},
                {html : 'Two', style : {background : '#573'}},
                {html : 'Three', style : {background : '#8d4'}},
                {html : 'Four', hidden : false, style : {background : '#87f'}},
                {html : 'Five', hidden : false, style : {background : '#637'}},
                {html : 'Six', hidden : false, style : {background : '#f34'}}
            ]
        },

        leftNav : {
            baseCls : 'leftnav',
            width   : 40,
            docked  : 'left',
            itemId  : 'moveleft'
        },

        rightNav : {
            baseCls : 'rightnav',
            width   : 40,
            docked  : 'right',
            itemId  : 'moveright'
        }
    },

    initialize : function () {
        var leftNav = this.getLeftNav(),
            rightNav = this.getRightNav();

        if (leftNav) {
            this.add(leftNav);
            leftNav.on('tap', Ext.bind(this.fireNavEvent, this, ['leftnav'], false), this, { element : 'element' });
        }

        if (rightNav) {
            this.add(rightNav);
            rightNav.on('tap', Ext.bind(this.fireNavEvent, this, ['rightnav'], false), this, { element : 'element' });
        }

        this.add(this.getCarousel());

        this.callParent();
    },

    fireNavEvent : function (event) {
        this.fireEvent(event, this);
    },

    applyCarousel : function (cfg, oldCfg) {
        return Ext.factory(cfg, Ext.ux.ColumnCarousel, oldCfg);
    },

    applyLeftNav : function (cfg, oldCfg) {
        return Ext.factory(cfg, Ext.Component, oldCfg);
    },

    applyRightNav : function (cfg, oldCfg) {
        return Ext.factory(cfg, Ext.Component, oldCfg);
    }
});

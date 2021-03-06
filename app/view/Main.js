App.slowDevice = Ext.os.is.Android2 || Ext.browser.is.ChromeMobile || (Ext.os.is.iOS && Ext.os.version.lt('5'));

Ext.define("App.view.Main", {
    extend : 'Ext.Container',
    xtype  : 'colcarexample',

    requires : [
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.field.Slider',
        'App.ux.ColumnCarousel'
    ],

    config : {
        cls    : App.slowDevice ? '' : 'feeder',
        layout : 'fit',
        items  : [
            {
                xtype  : 'titlebar',
                docked : 'top',
                title  : 'ATD',
                itemsx  : [
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
            columns   : 1,
            animation : App.slowDevice ? false : true
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
            rightNav.on('tap', Ext.bind(this.fireNavEvent, this, [
                'rightnav'
            ], false), this, { element : 'element' });
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
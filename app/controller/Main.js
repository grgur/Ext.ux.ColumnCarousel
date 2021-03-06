/**
 * Main controller
 * @author Grgur Grisogono
 */
Ext.define('App.controller.Main', {
    extend : 'Ext.app.Controller',

    config : {
        views  : ['Main', 'AllThingsD', 'TechCrunch'],
        models : ['AllThingsD', 'TechCrunch'],
        stores : ['AllThingsD', 'TechCrunch'],

        refs : {
            exampleView : 'colcarexample',
            carousel    : 'colcarexample columncarousel'
        },

        control : {
            exampleView : {
                leftnav  : 'onLeftNav',
                rightnav : 'onRightNav'

            },

            carousel : {
                beginning     : 'onBegining',
                end           : 'onEnd',
                beforeSliding : 'onSlide',
                refresh       : 'onUpdateDimensions',
                afterResize   : 'onResizeCompleted'
            },

            'sliderfield#numCols' : {
                change : 'onColNumChange'
            }
        }

    },

    init : function () {
        var store = Ext.StoreMgr.lookup('AllThingsD');

        // show loading mask
        Ext.Viewport.setMasked({
            xtype     : 'loadmask',
            message   : 'Loading content..',
            indicator : false,
            cls       : 'loadingmask'
        });

        store.on('load', this.onStoreLoad, this);
        store.load();
    },

    launch : function () {
        // hide view to speed up
        this.getExampleView().setHidden(true);
    },

    onStoreLoad : function (store) {
        var me = this,
            view = me.getExampleView(),
            carousel = me.getCarousel(),
            width = Math.round(carousel.getColWidth(true) - 18);

        // update loading mask
        Ext.Viewport.setMasked({
            xtype     : 'loadmask',
            message   : 'Preparing data..',
            indicator : false,
            cls       : 'loadingmask'
        });

        carousel.removeAll();

        store.each(function (record) {
            var tpl = Ext.create('Ext.XTemplate',
                    '<div class="feed-title">{title}</div>',
                    '<tpl if="img">',
                    '<img class="feed-img" src="http://src.sencha.io/{width}/{img}" />',
                    '</tpl>',
                    '<div class="feed-body">{description}</div>',
                    {
                        disableFormats : true
                    }
                ),
                data = {
                    title       : record.get('title'),
                    width       : width,
                    img         : record.get('img'),
                    description : record.get('description')
                };

            carousel.add({
                tpl        : tpl,
                data       : data,
                scrollable : {
                    direction     : 'vertical',
                    directionLock : true
                }
            });
        });

        view.setHidden(false);
        view.element.setStyle('visibility', 'hidden');
    },

    onResizeCompleted : function () {
        var me = this,
            indicator = Ext.get('appLoadingIndicator');

        if (!indicator) return;

        Ext.defer(function () {
            Ext.Viewport.setMasked(false);
            indicator.destroy();
            me.getExampleView().element.setStyle('visibility', 'visible');
        }, 200);
    },

    onLeftNav : function (view) {
        this.getCarousel().prev();
    },

    onRightNav : function (view) {
        this.getCarousel().next();
    },

    onBegining : function (view) {
        this.getExampleView().setLeftNav({cls : 'disabled'});
    },

    onEnd : function (view) {
        this.getExampleView().setRightNav({cls : 'disabled'});
    },

    onColNumChange : function (field) {
        var val = field.getValue();
        this.getCarousel().setColumns(val);
        this.resizeImgs();
    },

    onSlide : function () {
        this.getExampleView().getLeftNav().removeCls('disabled');
        this.getExampleView().getRightNav().removeCls('disabled');
    },

    resizeImgs : function () {
        var imgs = Ext.DomQuery.select('.feed-img'),
            width = 0;

        Ext.each(imgs, function (img) {
            if (!width) {
                width = Ext.get(img).up('.x-scroll-container').getWidth() - 18;
            }
            Ext.get(img).setWidth(width);
        });
    },

    onUpdateDimensions : function (col) {
        var me = this,
            bodyWidth = Ext.getBody().getWidth(),
            cols = Math.round(bodyWidth / 320),
            carousel = this.getCarousel(),
            first = Ext.isNumber(col) ? col : carousel.getFirstItem(0);

        if (cols < 1) {
            cols = 0;
        }

        this.getCarousel().setColumns(cols);

        Ext.defer(function () {
            carousel.setFirstItem(first);
            me.resizeImgs();
        }, 1);

    }
});
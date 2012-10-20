/**
 * Main controller
 * @author Grgur Grisogono
 */
Ext.define('App.controller.Main', {
    extend : 'Ext.app.Controller',

    config : {
        views : ['Main'],

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
                beforeSliding : 'onSlide'
            },

            'sliderfield#numCols' : {
                change : 'onColNumChange'
            }
        }

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
    },

    onSlide: function () {
        this.getExampleView().getLeftNav().removeCls('disabled');
        this.getExampleView().getRightNav().removeCls('disabled');
    }
});
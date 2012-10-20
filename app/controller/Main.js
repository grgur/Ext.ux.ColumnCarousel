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
                beginning : 'onBegining',
                end       : 'onEnd'
            }
        }

    },

    onLeftNav : function (view) {
        this.getCarousel().prev();
        view.getRightNav().removeCls('disabled');
    },

    onRightNav : function (view) {
        this.getCarousel().next();
        view.getLeftNav().removeCls('disabled');
    },

    onBegining : function (view) {
        this.getExampleView().setLeftNav({cls : 'disabled'});
    },

    onEnd : function (view) {
        this.getExampleView().setRightNav({cls : 'disabled'});
    }
});
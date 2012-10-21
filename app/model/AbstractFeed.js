/**
 * Abstract model
 * @author Grgur Grisogono
 */
Ext.define('App.model.AbstractFeed', {
    extend : 'Ext.data.Model',

    config : {
        fields: [
            'title',
            'link',
            {
                name: 'description',
                mapping: 'encoded',
                convert: function (v) {return v.replace(/(<([^>]+)>)/ig,"");}
            },
            {
                name: 'img',
                mapping: 'encoded',
                convert: function (v) {
                    var match = v.match(/<img [^>]*src="(.*?[^"])"[^>]*\/>/i);
                    if (!Ext.isArray(match)) return false;
                    return match[1];
                }
            },
            {
                name: 'pubDate',
                convert: function (v) {return new Date(v);}
            }
        ]
    }
});
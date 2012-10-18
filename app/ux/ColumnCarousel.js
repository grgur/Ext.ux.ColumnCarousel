/**
 *
 * @author Grgur Grisogono
 */
Ext.define('App.ux.ColumnCarousel', {
    extend : 'Ext.Container',
    xtype  : 'columncarousel',

    config : {
        baseCls : 'mc-columncarousel',

        layout : {
            type  : 'hbox',
            align : 'stretch'
        },

        defaults : {
            style : {
                // stack all columns to the left
                float  : 'left'
            }
        },

        /**
         * Number of columns to display
         */
        columns : 3,

        /**
         * Positions the columns so that the first one is the provided index number
         */
        firstItem: 0,

        /**
         * @private
         * Maximum px to go to the left so that all last columns are visible
         */
        maxLeft : 0
    },

    /**
     * @private
     * Leftmost position of the cotnainer when dragging starts
     */
    startLeft    : 0,

    /**
     * @private
     * Page X when dragging starts
     */
    startX       : 0,

    /**
     * @private
     * Leftmost position updated while dragging
     */
    currentLeft  : 0,

    /**
     * @private
     * Last left percentage as set in translate3D
     */
    lastLeftPerc : 0,

    initialize : function () {
        var me = this;
        me.callParent();

        // record positions on touch start
        me.on('touchstart', 'onTouchStart', me, { element : 'element' });

        // track element movement while touching and moving
        me.on('touchmove', 'onTouchMove', me, { element : 'element' });

        // fix columns when movement has ended
        me.on('dragend', 'onDragEnd', me, { element : 'element', delegate : '.mc-columncarousel-inner' });
    },

    /**
     * Move the carousel to the right
     * @return {Number} Index number of the first visible column
     */
    next: function () {
        this.setFirstItem(this.getFirstItem() - 1);
        return -this.getFirstItem();
    },

    /**
     * Move the carousel to the left
     * @return {Number} Index number of the first visible column
     */
    prev: function () {
        var curIdx = this.getFirstItem(),
            newIdx = curIdx === 0 ? 0 : curIdx + 1;

        this.setFirstItem(newIdx);
        return -newIdx;
    },

    /**
     * @private
     * Note startLeft and startX before movement starts
     * @param e Event
     */
    onTouchStart : function (e) {
        var me = this;
        me.startLeft = me.currentLeft;
        me.startX = e.pageX;
        me.setMaxLeft();
    },

    /**
     * @private
     * Fix positions when dragging ends
     * @param e Event
     */
    onDragEnd : function (e) {
        var me = this,
            targetWidth = e.delegatedTarget.offsetWidth,
            maxLeft = me.getMaxLeft(),

            // mind max left and max right (0 > x > maxLeft)
            curleft = (me.currentLeft < maxLeft) ? maxLeft : (me.currentLeft > 0 ) ? 0 : me.currentLeft,
            endPerc = ( curleft / targetWidth ) * 100,
            onePerc = 100 / me.getColumns(),
            ratio = endPerc / onePerc,

            // if tap ends when column is under 50% visible, show it. Otherwise show the next one
            round = Math.round(ratio),
            leftPx;

        me.setFirstItem(round);

        // save current leftmost position
        leftPx = me.lastLeftPerc * targetWidth / 100;
        me.currentLeft = leftPx;
    },

    /**
     * @private
     * Track changes when finger moves
     * @param e
     */
    onTouchMove : function (e) {
        var me = this,
            left = me.startLeft,
            delta = me.startX - e.pageX,
            newLeft = left - delta;

        me.innerElement.setStyle({
            '-webkit-transition' : 'none',
            '-webkit-transform'  : 'translate3d(' + newLeft + 'px,0,0)'
        });
        me.currentLeft = newLeft;
    },

    /**
     * @private
     * Sets position to the percentage of the nearest column
     */
    resetPosition : function () {
        this.innerElement.setStyle({
            '-webkit-transition' : '-webkit-transform 0.2s ease-out',
            '-webkit-transform'  : 'translate3d(' + this.lastLeftPerc + '%,0,0)'
        });
    },

    /**
     * @private
     * Get width in px of a single column
     * @return {Number} Width in px
     */
    getColWidth : function () {
        return this.innerElement.getWidth() / this.getColumns();
    },

    /**
     * @private
     * Calculate the maximum position the container can go to the left
     * so that the last columns occupy 100% available space
     * @return {Number} X position in px
     */
    applyMaxLeft : function () {
        return -( this.getInnerItems().length - this.getColumns() ) * this.getColWidth();
    },

    /**
     * @private
     * Calculate percentage width for each column based on available view width
     * @param {Number} cols Number of columns
     * @return {Number} The provided number of columns
     */
    applyColumns : function (cols) {
        var childWidth = 100 / cols;
        Ext.each(this.getInnerItems(), function (item) {
            item.setWidth(childWidth + '%');
        });

        this.setFirstItem(this.getFirstItem());

        return cols;
    },

    /**
     * @private
     * Positions the columns so that the first one is the provided index number
     * @param {Number} num Index number for the first visible column
     * @return {Number} Index number
     */
    applyFirstItem: function (num) {
        var me = this,
            cols = me.getColumns(),
            onePerc = 100 / cols,
            maxNum = me.getInnerItems().length - cols,
            left;

        if (num > 0) {
            num = -num;
        }

        if (-num > maxNum) {
            num = -maxNum;
        }

        left = num * onePerc;
        me.lastLeftPerc = left;
        me.resetPosition();
        return num;
    }
});
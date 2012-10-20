/**
 * Carousel in which components are stacked in columns instead of cards
 * Uses 3D HW acceleration where available
 * @author Grgur Grisogono
 *
 * @event beginning
 * Fires when the carousel reaches the first available component
 * @param {Ext.ux.ColumnCarousel} this
 *
 * @event end
 * Fires when the carousel reaches the last available component.
 * This is not the last child component, but the point where carousel can go further
 * @param {Ext.ux.ColumnCarousel} this
 */
Ext.define('App.ux.ColumnCarousel', {
    extend             : 'Ext.Container',
    xtype              : 'columncarousel',
    alternateClassName : 'Ext.ux.ColumnCarousel',

    config : {
        baseCls : 'mc-columncarousel',

        layout : {
            type  : 'hbox',
            align : 'stretch'
        },

        defaults : {
            flex: 1
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
         * Use false to disable animation when dragging ends
         */
        animation: true,

        /**
         * @private
         * Maximum px to go to the left so that all last columns are visible
         */
        maxLeft : 0
    },

    /**
     * @private
     * Leftmost position of the container when dragging starts
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

    /**
     * @private
     * Cached column width
     */
    cachedColWidth: 0,

    /**
     * @private
     * Flag that lets the component know whether it should recalc innerElement
     */
    drawn: false,

    initialize : function () {
        var me = this;
        me.callParent();

        // record positions on touch start
        me.on('touchstart', 'onTouchStart', me, { element : 'element' });

        // track element movement while touching and moving
        me.on('touchmove', 'onTouchMove', me, { element : 'element' });

        // fix columns when movement has ended
        me.on('dragend', 'onDragEnd', me, { element : 'element', delegate : '.mc-columncarousel-inner' });

        // recalculate widths when painted
        me.on('painted', 'refreshView');

        Ext.Viewport.on('orientationchange', 'refreshView', this);
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

            oneColWidth = this.getColWidth(true),

            ratio = curleft / oneColWidth,

            // if tap ends when column is under 50% visible, show it. Otherwise show the next one
            round = Math.round(ratio);

        me.setFirstItem(round);
    },

    /**
     * @private
     * Track changes when finger moves
     * @param e
     */
    onTouchMove : function (e) {
        var me = this,
            left = me.startLeft,
            delta = me.startX - e.pageX;

        me.currentLeft = left - delta;

        me.resetPosition();
    },

    /**
     * @private
     * Sets position to the percentage of the nearest column
     */
    resetPosition : function (animate) {
        if (this.getAnimation() === false) {
            animate = false;
        }
        this.innerElement.setStyle({
            '-webkit-transition' : animate ? '-webkit-transform 0.2s ease-out' : 'none',
            'transition'         : animate ? 'transform 0.2s ease-out' : 'none',
            '-webkit-transform'  : 'translate3d(' + this.currentLeft + 'px,0,0)',
            'transform'          : 'translate3d(' + this.currentLeft + 'px,0,0)'
        });
    },

    /**
     * @private
     * Get width in px of a single column
     * @return {Number} Width in px
     */
    getColWidth : function (cached) {
        if (this.cachedColWidth && cached===true) {
            return this.cachedColWidth;
        }

        var visibleColumns = this.getColumns(),
            totalColumns = this.getInnerItems().length,
            visibleRatio = totalColumns / visibleColumns,
            fullWidth = this.innerElement.getWidth(),
            normalizedWidth = this.isDrawn ?  fullWidth / visibleRatio : fullWidth;

        this.cachedColWidth = normalizedWidth / this.getColumns();

        return this.cachedColWidth;
    },

    /**
     * @private
     * Force layout refresh
     */
    refreshView: function () {
        this.resetInnerElWidth();
        this.setColumns(this.getColumns());
    },

    resetInnerElWidth: function () {
        var childWidth,
            totalWidth;

        this.isDrawn = false;
        this.innerElement.setWidth('100%');

        childWidth = this.getColWidth(),
        totalWidth = childWidth * this.getInnerItems().length;

        this.innerElement.setWidth(totalWidth + 'px');

        return totalWidth;
    },

    /**
     * @private
     * Update the width of innerElement to be num-of-cols * one-col-width
     * so that we can flex columns easily.
     * Percentages of pixels perform poorly on Safari due to the rounding down issue
     * @param {Number} cols Number of columns
     * @return {Number} The provided number of columns
     */
    applyColumns : function (cols) {
        if (!this.isPainted()) {
            return cols;
        }

        Ext.defer(this.resetInnerElWidth, 1, this);
        this.setFirstItem(this.getFirstItem());
        this.isDrawn = true;

        return cols;
    },

    /**
     * @private
     * Calculate the maximum position the container can go to the left
     * so that the last columns occupy 100% available space
     * @return {Number} X position in px
     */
    applyMaxLeft : function () {
        return -( this.getInnerItems().length - this.getColumns() ) * this.getColWidth(true);
    },

    /**
     * @private
     * Positions the columns so that the first one is the provided index number
     * @param {Number} num Index number for the first visible column
     * @return {Number} Index number
     */
    applyFirstItem: function (num) {
        // do not process anything extra if cmp is not painted
        if (!this.isPainted()) {
            return num;
        }

        var me = this,
            cols = me.getColumns(),
            oneColWidth = this.getColWidth(true),
            maxNum = me.getInnerItems().length - cols,
            left;

        if (num > 0) {
            num = -num;
        }

        if (-num > maxNum) {
            num = -maxNum;
        }

        if (num === -maxNum) {
            this.fireEvent('end', this);
        } else
        if (num === 0) {
            this.fireEvent('beginning', this);
        }


        left = num * oneColWidth;

        me.currentLeft = left;
        me.resetPosition(true);
        return num;
    }
});
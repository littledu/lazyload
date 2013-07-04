/*
 * @components lazyLoad 图文直播专用图片按需加载(特色功能:跳过图片不加载)
 * @author duguangmin
 * @desc 用于图文直播专用图片按需加载
 * @调用方式   
 * new lazyLoad({
        targets: document.getElementsByTagName('img'),
        threshold: 100,
        lazyTag: '#src'
    });
 * @property
 *      targets：{NodeLists} 需要按需加载的图片
 *
 *      threshold:{Number} 预加载的距离(就是距离图片多高时提前加载)
 *      
 *      lazyTag: {String} 存放图片真实路径的属性
 *
 * @version v1.0
 */

;(function(){

    var lazyLoad = function( config ){
        this.init( config );
    }

    lazyLoad.prototype = {
        init: function( config ){
            var self = this;
            this.targets = config.targets;
            this.threshold = config.threshold || 0;
            this.lazyTag = config.lazyTag || '#src';
            this.lazyList = [];
            this.fnLoaded = this.bind( this, this.loaded );

            //简单的判断目标图片是array-like还是array
            //将对象转成真实数组
            if( !this.targets.push ){
                for( var i = 0, len = this.targets.length; i < len; i++ ){
                    this.lazyList.push( this.targets[i] );
                }
            }else{
                this.lazyList = this.targets;
            }

            this.imageCount = this.lazyList.length;

            //获取各图片的位置
            for(var i = 0, len = this.lazyList.length; i < len; i++ ){
                
                this.lazyList[i].top = this.getY( this.lazyList[i] );

            }

            this.addEvent( window, 'scroll', self.fnLoaded );
            this.addEvent( window, 'resize', self.fnLoaded );

        },

        loaded: function(){

            var scrollH = document.body.scrollTop || document.documentElement.scrollTop,
                pageH = scrollH + document.documentElement.clientHeight,
                length = this.lazyList.length,
                i = 0,
                self = this;

            this.threshold && ( pageH = pageH + this.threshold );

            for( ; i < length; i++ ){
                if( this.lazyList[i].top < pageH && scrollH < this.lazyList[i].top ){
                    this.lazyList[i].src = this.lazyList[i].getAttribute(this.lazyTag);
                    this.lazyList.splice(i, 1);
                    length = this.lazyList.length;
                }
            }

            if( length == 0){
                this.removeEvent( window, 'scroll', self.fnLoaded );
                this.removeEvent( window, 'resize', self.fnLoaded );
            } 
        },

        //得到对象top
        getY: function ( ele ) {
            var y = 0;

            while ( ele.offsetParent ) {
                y += ele.offsetTop;
                ele = ele.offsetParent;
            }

            return y;
        },

        bind: function(object, handler) {
            return function() {
                return handler.apply(object, arguments) 
            }
        },

        addEvent: function( ele,type,fnHandler ){
             return ele.addEventListener ? ele.addEventListener(type,fnHandler,false) : ele.attachEvent('on' + type,fnHandler);
        },

        removeEvent: function( ele, type, fnHandler ){
            return ele.removeEventListener ? ele.removeEventListener(type,fnHandler,false) : ele.detachEvent('on'+type,fnHandler)
        }
    }

    window.lazyLoad = lazyLoad;
})();
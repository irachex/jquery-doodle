/**
 * jquery canvas doodle plugin
 * author: irachex
 * date: 2011-10-23
 * version: 1.0.0
 */

(function($) {
    var methods = {
        init : function(options) {
            var defaults = {
                width : 10.0,
                color : "#000000",
                mouseX : 0,
                mouseY : 0,
                isMouseDown : false
            };
            var options = $.extend(defaults, options);
            this.each(function() {
                var data = $(this).data("doodle");
                    cxt = this.getContext("2d");
                cxt.lineCap = "round";
                cxt.lineJoin = "round";
                cxt.strokeStyle = options.color;
                cxt.lineWidth = options.width; 
                if (!data) {
                    $(this).data("doodle", $.extend(options, {context: cxt }));
                }
                $(this).mousedown(function(e) {
                    var data = $(this).data("doodle");
                    data.mouseX = e.offsetX;
                    data.mouseY = e.offsetY;
            	    data.isMouseDown = true; 
                });

                $(this).mousemove(function(e){
                    var data = $(this).data("doodle");
                    if(data.isMouseDown) {
                        var x1 = data.mouseX;
                        var y1 = data.mouseY;
                        var x2 = e.offsetX;
                        var y2 = e.offsetY;
                        
                        data.context.beginPath();
                        data.context.moveTo(x1, y1);
                        data.context.lineTo(x2, y2);
                        data.context.stroke();
                        
                        data.mouseX = x2;
                        data.mouseY = y2;
                    }
                });

                $(this).mouseup(function(e){
                    $(this).data("doodle").isMouseDown = false;
                });

                $(this).mouseleave(function(e){
                    $(this).data("doodle").isMouseDown = false;
                });
            });
            return $(this);
        },
        
        setWidth: function(value) {
            var data = $(this).data("doodle");
            data.width = value;
            data.context.lineWidth = value;
        },
        
        setColor: function(value) {
            var data = $(this).data("doodle");
            data.color = value;
            data.context.strokeStyle = value;                        
        },
        
        clear: function(value) {
            $(this).data("doodle").context.clearRect(0, 0, this.width, this.height);
        },
        
        save: function(url) {
            this.each(function() {
                var data=this.toDataURL();
        	    $.ajax({
        	        type: "POST",
        	        url: url,
        	        data: data,
        	        async: false
    	        });
    	    });
        },
        
        load: function(value) {
            this.each(function() {
                var imageObj = new Image();
                var data = $(this).data("doodle");
                imageObj.src = value;
                
                imageObj.onload = function() {
                    data.context.drawImage(this, 0, 0);
                };
            });
        }
    };
    $.fn.doodle = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.doodle' );
        }
    };
})(jQuery);
define("#switchable/0.9.5/accordion-debug", ["./switchable-debug", "#widget/0.9.16/widget-debug", "#widget/0.9.16/daparser-debug", "#widget/0.9.16/auto-render-debug", "#jquery/1.7.2/jquery-debug", "#base/0.9.16/base-debug", "#base/0.9.16/aspect-debug", "#base/0.9.16/attribute-debug", "#class/0.9.2/class-debug", "#events/0.9.1/events-debug"], function(require, exports, module) {

    var Switchable = require('./switchable-debug');


    // 手风琴组件
    var Accordion = Switchable.extend({

        attrs: {
            triggerType: 'click',

            // 是否运行展开多个
            multiple: false
        }
    });

    module.exports = Accordion;

});

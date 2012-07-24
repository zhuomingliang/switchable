define("#switchable/0.9.5/const",[],function(require,exports){var UI_SWITCHABLE="ui-switchable";exports.UI_SWITCHABLE=UI_SWITCHABLE,exports.NAV_CLASS=UI_SWITCHABLE+"-nav",exports.CONTENT_CLASS=UI_SWITCHABLE+"-content",exports.TRIGGER_CLASS=UI_SWITCHABLE+"-trigger",exports.PANEL_CLASS=UI_SWITCHABLE+"-panel",exports.ACTIVE_CLASS=UI_SWITCHABLE+"-active",exports.PREV_BTN_CLASS=UI_SWITCHABLE+"-prev-btn",exports.NEXT_BTN_CLASS=UI_SWITCHABLE+"-next-btn",exports.DISABLED_BTN_CLASS=UI_SWITCHABLE+"-disabled-btn"}),define("#switchable/0.9.5/plugins/effects",["#jquery/1.7.2/jquery"],function(require,exports,module){var $=require("#jquery/1.7.2/jquery"),SCROLLX="scrollx",SCROLLY="scrolly",FADE="fade";module.exports={isNeeded:function(){return this.get("effect")!=="none"},install:function(){var panels=this.panels;panels.show();var effect=this.get("effect"),step=this.get("step");if(effect.indexOf("scroll")===0){var content=this.content,firstPanel=panels.eq(0);content.css("position","absolute"),content.parent().css("position")==="static"&&content.parent().css("position","relative"),effect===SCROLLX&&(panels.css("float","left"),content.width("9999px"));var viewSize=this.get("viewSize");viewSize[0]||(viewSize[0]=firstPanel.outerWidth()*step,viewSize[1]=firstPanel.outerHeight()*step,this.set("viewSize",viewSize));if(!viewSize[0])throw new Error("Please specify viewSize manually")}else if(effect===FADE){var activeIndex=this.get("activeIndex"),min=activeIndex*step,max=min+step-1;panels.each(function(i,panel){var isActivePanel=i>=min&&i<=max;$(panel).css({opacity:isActivePanel?1:0,position:"absolute",zIndex:isActivePanel?9:1})})}this._switchPanel=function(panelInfo){var effect=this.get("effect"),fn=$.isFunction(effect)?effect:Effects[effect];fn.call(this,panelInfo)}}};var Effects={fade:function(panelInfo){if(this.get("step")>1)throw new Error('Effect "fade" only supports step === 1');var fromPanel=panelInfo.fromPanels.eq(0),toPanel=panelInfo.toPanels.eq(0),anim=this.anim;anim&&anim.stop(!1,!0),toPanel.css("opacity",1);if(fromPanel[0]){var duration=this.get("duration"),easing=this.get("easing"),that=this;this.anim=fromPanel.animate({opacity:0},duration,easing,function(){that.anim=null,toPanel.css("zIndex",9),fromPanel.css("zIndex",1)})}else toPanel.css("zIndex",9)},scroll:function(panelInfo){var isX=this.get("effect")===SCROLLX,diff=this.get("viewSize")[isX?0:1]*panelInfo.toIndex,props={};props[isX?"left":"top"]=-diff+"px",this.anim&&this.anim.stop();if(panelInfo.fromIndex>-1){var that=this,duration=this.get("duration"),easing=this.get("easing");this.anim=this.content.animate(props,duration,easing,function(){that.anim=null})}else this.content.css(props)}};Effects[SCROLLY]=Effects.scroll,Effects[SCROLLX]=Effects.scroll,module.exports.Effects=Effects}),define("#switchable/0.9.5/plugins/autoplay",["#jquery/1.7.2/jquery"],function(require,exports,module){function throttle(fn,ms){function f(){f.stop(),throttleTimer=setTimeout(fn,ms)}ms=ms||200;var throttleTimer;return f.stop=function(){throttleTimer&&(clearTimeout(throttleTimer),throttleTimer=0)},f}function isInViewport(element){var scrollTop=win.scrollTop(),scrollBottom=scrollTop+win.height(),elementTop=element.offset().top,elementBottom=elementTop+element.height();return elementTop<scrollBottom&&elementBottom>scrollTop}var $=require("#jquery/1.7.2/jquery");module.exports={attrs:{autoplay:!0,interval:5e3,pauseOnScroll:!0,pauseOnHover:!0},isNeeded:function(){return this.get("autoplay")},install:function(){function start(){stop(),that.paused=!1,timer=setInterval(function(){if(that.paused)return;that.next()},interval)}function stop(){timer&&(clearInterval(timer),timer=null),that.paused=!0}var element=this.element,EVENT_NS="."+this.cid,timer,interval=this.get("interval"),that=this;start(),this.stop=stop,this.start=start,this.get("pauseOnScroll")&&(this._scrollDetect=throttle(function(){that[isInViewport(element)?"start":"stop"]()}),win.on("scroll"+EVENT_NS,this._scrollDetect)),this.get("pauseOnHover")&&this.element.hover(stop,start)},destroy:function(){var EVENT_NS="."+this.cid;this.stop(),this._scrollDetect&&(this._scrollDetect.stop(),win.off("scroll"+EVENT_NS))}};var win=$(window)}),define("#switchable/0.9.5/plugins/circular",["./plugins/effects","#jquery/1.7.2/jquery"],function(require,exports,module){function adjustPosition(isBackward,prop,viewDiff){var step=this.get("step"),len=this.get("length"),start=isBackward?len-1:0,from=start*step,to=(start+1)*step,diff=isBackward?viewDiff:-viewDiff*len,toPanels=$(this.panels.get().slice(from,to));return toPanels.css("position","relative"),toPanels.css(prop,-diff+"px"),diff}function resetPosition(isBackward,prop,viewDiff){var step=this.get("step"),len=this.get("length"),start=isBackward?len-1:0,from=start*step,to=(start+1)*step,toPanels=$(this.panels.get().slice(from,to));toPanels.css("position",""),toPanels.css(prop,""),this.content.css(prop,isBackward?-viewDiff*(len-1):"")}var $=require("#jquery/1.7.2/jquery"),SCROLLX="scrollx",SCROLLY="scrolly",Effects=require("./effects").Effects;module.exports={isNeeded:function(){var effect=this.get("effect"),circular=this.get("circular");return circular&&(effect===SCROLLX||effect===SCROLLY)},install:function(){this.set("scrollType",this.get("effect")),this.set("effect","scrollCircular")}},Effects.scrollCircular=function(panelInfo){var toIndex=panelInfo.toIndex,fromIndex=panelInfo.fromIndex,len=this.get("length"),isBackwardCritical=fromIndex===0&&toIndex===len-1,isForwardCritical=fromIndex===len-1&&toIndex===0,isBackward=isBackwardCritical||!isForwardCritical&&toIndex<fromIndex,isCritical=isBackwardCritical||isForwardCritical,isX=this.get("scrollType")===SCROLLX,prop=isX?"left":"top",viewDiff=this.get("viewSize")[isX?0:1],diff=-viewDiff*toIndex;this.anim&&this.anim.stop(!1,!0),isCritical&&(diff=adjustPosition.call(this,isBackward,prop,viewDiff));var props={};props[prop]=diff+"px";if(fromIndex>-1){var duration=this.get("duration"),easing=this.get("easing"),that=this;this.anim=this.content.animate(props,duration,easing,function(){that.anim=null,isCritical&&resetPosition.call(that,isBackward,prop,viewDiff)})}else this.content.css(props)}}),define("#switchable/0.9.5/plugins/multiple",["./const"],function(require,exports,module){var CONST=require("../const");module.exports={isNeeded:function(){return this.get("multiple")},methods:{_switchTrigger:function(toIndex){this.triggers.eq(toIndex).toggleClass(CONST.ACTIVE_CLASS)},_triggerIsValid:function(){return!0},_switchPanel:function(panelInfo){panelInfo.toPanels.toggle()}}}}),define("#switchable/0.9.5/switchable",["./const","./plugins/effects","./plugins/autoplay","./plugins/circular","./plugins/multiple","#jquery/1.7.2/jquery","#widget/0.9.16/widget","#widget/0.9.16/daparser","#widget/0.9.16/auto-render","#base/0.9.16/base","#base/0.9.16/aspect","#base/0.9.16/attribute","#class/0.9.2/class","#events/0.9.1/events"],function(require,exports,module){function generateTriggersMarkup(length,activeIndex){var nav=$("<ul>");for(var i=0;i<length;i++){var className=i===activeIndex?CONST.ACTIVE_CLASS:"";$("<li>",{"class":className,html:i+1}).appendTo(nav)}return nav}var $=require("#jquery/1.7.2/jquery"),Widget=require("#widget/0.9.16/widget"),CONST=require("./const"),Effects=require("./plugins/effects"),Autoplay=require("./plugins/autoplay"),Circular=require("./plugins/circular"),Multiple=require("./plugins/multiple"),Switchable=Widget.extend({attrs:{triggers:{value:[],getter:function(val){return $(val)}},panels:{value:[],getter:function(val){return $(val)}},hasTriggers:!0,triggerType:"hover",delay:100,effect:"none",easing:"linear",duration:500,activeIndex:0,step:1,length:{readOnly:!0,getter:function(){return this.panels.length/this.get("step")}},viewSize:[]},setup:function(){this._parseRole(),this._initElement(),this._initPanels(),this._initTriggers(),this._initPlugins(),this.render()},_parseRole:function(){var role=this.dataset.role;if(!role)return;var element=this.element,triggers=this.get("triggers"),panels=this.get("panels");triggers.length===0&&(role.trigger||role.nav)&&(triggers=element.find(role.trigger||role.nav+" > *")),panels.length===0&&(role.panel||role.content)&&(panels=element.find(role.panel||role.content+" > *")),this.set("triggers",triggers),this.set("panels",panels)},_initElement:function(){this.element.addClass(CONST.UI_SWITCHABLE)},_initPanels:function(){var panels=this.panels=this.get("panels");if(panels.length===0)throw new Error("panels.length is ZERO");this.content=panels.parent().addClass(CONST.CONTENT_CLASS),panels.addClass(CONST.PANEL_CLASS)},_initTriggers:function(){var triggers=this.triggers=this.get("triggers");triggers.length===0&&this.get("hasTriggers")?(this.nav=generateTriggersMarkup(this.get("length"),this.get("activeIndex")).appendTo(this.element),this.triggers=this.nav.children()):this.nav=triggers.parent(),this.triggers.addClass(CONST.TRIGGER_CLASS),this.nav.addClass(CONST.NAV_CLASS),this.triggers.each(function(i,trigger){$(trigger).data("value",i)}),this._bindTriggers()},_initPlugins:function(){this._plugins=[],this._plug(Effects),this._plug(Autoplay),this._plug(Circular),this._plug(Multiple)},_bindTriggers:function(){function focus(ev){that._onFocusTrigger(ev.type,$(this).data("value"))}function leave(){clearTimeout(that._switchTimer)}var that=this;this.get("triggerType")==="click"?this.triggers.click(focus):this.triggers.hover(focus,leave)},_onFocusTrigger:function(type,index){var that=this;type==="click"?this.switchTo(index):this._switchTimer=setTimeout(function(){that.switchTo(index)},this.get("delay"))},switchTo:function(toIndex){return this.set("activeIndex",toIndex),this},_onRenderActiveIndex:function(toIndex,fromIndex){this._triggerIsValid(toIndex,fromIndex)&&this._switchTo(toIndex,fromIndex)},_switchTo:function(toIndex,fromIndex){this.trigger("switch",toIndex,fromIndex),this._switchTrigger(toIndex,fromIndex),this._switchPanel(this._getPanelInfo(toIndex,fromIndex)),this.trigger("switched",toIndex,fromIndex)},_triggerIsValid:function(toIndex,fromIndex){return toIndex!==fromIndex},_switchTrigger:function(toIndex,fromIndex){var triggers=this.triggers;if(triggers.length<1)return;triggers.eq(fromIndex).removeClass(CONST.ACTIVE_CLASS),triggers.eq(toIndex).addClass(CONST.ACTIVE_CLASS)},_switchPanel:function(panelInfo){panelInfo.fromPanels.hide(),panelInfo.toPanels.show()},_getPanelInfo:function(toIndex,fromIndex){var panels=this.panels.get(),step=this.get("step"),fromPanels,toPanels;if(fromIndex>-1){var begin=fromIndex*step,end=(fromIndex+1)*step;fromPanels=panels.slice(begin,end)}return toPanels=panels.slice(toIndex*step,(toIndex+1)*step),{toIndex:toIndex,fromIndex:fromIndex,toPanels:$(toPanels),fromPanels:$(fromPanels)}},prev:function(){var fromIndex=this.get("activeIndex"),index=(fromIndex-1+this.get("length"))%this.length;this.switchTo(index)},next:function(){var fromIndex=this.get("activeIndex"),index=(fromIndex+1)%this.get("length");this.switchTo(index)},_plug:function(plugin){if(!plugin.isNeeded.call(this))return;var pluginAttrs=plugin.attrs,methods=plugin.methods;if(pluginAttrs)for(var key in pluginAttrs)pluginAttrs.hasOwnProperty(key)&&!(key in this.attrs)&&this.set(key,pluginAttrs[key]);if(methods)for(var method in methods)methods.hasOwnProperty(method)&&(this[method]=methods[method]);plugin.install&&plugin.install.call(this),this._plugins.push(plugin)},destroy:function(){$.each(this._plugins,function(i,plugin){plugin.destroy&&plugin.destroy.call(this)}),Switchable.superclass.destroy.call(this)}});module.exports=Switchable});
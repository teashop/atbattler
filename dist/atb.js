
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"underscore": function(exports, require, module) {(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,v=e.reduce,h=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.3";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduce===v)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduceRight===h)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?-1!=n.indexOf(t):E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2);return w.map(n,function(n){return(w.isFunction(t)?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t){return w.isEmpty(t)?[]:w.filter(n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var F=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=F(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(e>r||void 0===e)return-1}return n.index<t.index?-1:1}),"value")};var k=function(n,t,r,e){var u={},i=F(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return k(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return k(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:F(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i};var I=function(){};w.bind=function(n,t){var r,e;if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));if(!w.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));I.prototype=n.prototype;var u=new I;I.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},w.bindAll=function(n){var t=o.call(arguments,1);return 0==t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=S(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&S(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return S(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),w.isFunction=function(n){return"function"==typeof n},w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return void 0===n},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+(0|Math.random()*(t-n+1))};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};T.unescape=w.invert(T.escape);var M={escape:RegExp("["+w.keys(T.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(T.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(M[n],function(t){return T[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=""+ ++N;return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){r=w.defaults({},r,w.templateSettings);var e=RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(D,function(n){return"\\"+B[n]}),r&&(i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(i+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),a&&(i+="';\n"+a+"\n__p+='"),u=o+t.length,t}),i+="';\n",r.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=Function(r.variable||"obj","_",i)}catch(o){throw o.source=i,o}if(t)return a(t,w);var c=function(n){return a.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+i+"}",c},w.chain=function(n){return w(n).chain()};var z=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);}, "domain": function(exports, require, module) {/** === DOMAIN === **/
var _ = require('underscore');

exports.rollPlayerHero = function(id, name) {
  var theHp =  _.random(1000, 1300);
  var theSp =  _.random(100, 300);
  var attributes = {
    speed: _.random(100, 130),
    attack: _.random(200, 220),
    hp: theHp,
    maxHp: theHp,
    sp: theSp,
    maxSp: theSp
  };
  return new exports.Hero(id, name, attributes);
}
exports.rollCpuHero = function(id, name) {
  var theHp = _.random(1200, 1700);
  var theSp =  _.random(300, 500);
  var attributes = {
    speed: _.random(80, 100),
    attack: _.random(90, 390),
    hp: theHp,
    maxHp: theHp,
    sp: theSp,
    maxSp: theSp
  };
  return new exports.Hero(id, name, attributes);
}

/** Hero **/
exports.Hero = function(id, name, attributes) {
  this.id = id;
  this.name = name;

  // TODO: put somewhere else
  this.attributes = attributes;
  this.statuses = {};

  // TODO: mechanics should be managed by game state
  this.turnGauge = 0.00;
}
/** END Hero **/

/** Party **/
exports.Party = function(id, maxSize) {
  this.id = id;
  this.maxSize = maxSize;

  this.heroes = [];
}
var PARTY = exports.Party.prototype;

// TODO: if position is OOB or party is full
PARTY.setHero = function(hero, position) {
  var thePosition = position;
  if (position) {
    this.heroes[position] = hero;
  } else {
    for (var i = 0; i < this.maxSize; i++) {
      if (!this.heroes[i]) {
        this.heroes[i] = hero;
        thePosition = i;
        break;
      }
    }
  }
  return thePosition;
}
// TODO: if position is OOB or party is empty
PARTY.removeHero = function(position) {
  if (position < this.maxSize) {
    this.heroes[position] = null;
  }
  return hero;
}

PARTY.getHeroById = function(heroId) {
  for (var i = 0; i < this.heroes.length; i++) {
    if (this.heroes[i] && this.heroes[i].id == heroId) {
      return this.heroes[i];
    }
  }
  return null;
}

// TODO: JSONify
/** END Party **/

/** Player **/
exports.Player = function(id, name) {
  this.id = id;
  this.name = name;

  this.party = null;
}

var PLAYER = exports.Player.prototype;

PLAYER.setParty = function(party) {
  this.party = party;
}

/** END Player **/
}, "durationevent": function(exports, require, module) {// TODO: better less confusing name.
// used to track a duration-based triggered effect
//    length - total length of the event
//    interval - defines how often effects of this event 'fire' or update. Can be a number, array of predefined ticks, or a function of the form function(totalElapsed, sinceLastInterval){ ... } that returns 'true' if the event should fire given the total elapsed time and time since last interval.
//
exports.DurationEvent = function(length, interval, onFire, onComplete) {
  this.length = length;
  this.elapsed = 0;
  this.sinceLastInterval = 0;
  // if an interval is not specified, fire once after the complete duration
  this.interval = interval || length;
  this.isNextInterval = null;
  this.onFire = onFire;
  
  // TODO, maybe callback this shit as well.
  var that = this;
  if (this.interval instanceof Array) {   
    // rely on supplied array for times where the event should fire.
    this.isNextInterval = function() {
      if (that.interval.length > 0 && that.elapsed >= that.interval[0]) {
        that.interval.shift();
        return true;
      }
      return false;
    };
  } else if (interval instanceof Function) {
    // rely on supplied f'n.  Best used for non-linear calculable intervals.
    this.isNextInterval = function() {
      return interval.apply(that, [that.elapsedTime, that.sinceLastInterval]);
    };
  } else {
    // returns true every time the interval elapses. Simple linear progression.
    this.isNextInterval = function() {      
      return (that.sinceLastInterval >= that.interval);
    };
  }
}
var DE = exports.DurationEvent.prototype;
// updates time elpased.  Returns true iff complete
DE.updateElapsed = function(length) {
  // prevent extraneous calls to a completed event
  if (this.elapsed >= this.length) {
    return true;
  }
  this.elapsed += length;
  this.sinceLastInterval += length;
  var isComplete = this.elapsed >= this.length; 

  // args for calls. TODO: not sure why need to dereference to local var.
  var argElapsed = this.elapsed;
  var argSinceLast = this.sinceLastInterval;
  
  if (this.isNextInterval.call(this, argElapsed, argSinceLast)) {
    // TODO: execute whatever it is that's supposed to be 
  this.onFire(argElapsed, argSinceLast);
    this.sinceLastInterval = 0;
  }
  if (isComplete) {
    // TODO: execute special finishing thing.
  }
  return isComplete;
}
}, "gameclient": function(exports, require, module) {var atb = {};
var _ = require('underscore');

var atbDomain = require('./domain');
var atbGameEvent = require('./gameevent');
var atbUtil = require('./util');
var atbSkill = require('./skill');
var atbItem = require('./item');

atb.Player = atbDomain.Player;
atb.Party = atbDomain.Party;
atb.Hero = atbDomain.Hero;
atb.GameEvent = atbGameEvent.GameEvent;
atb.EventQueue = atbUtil.EventQueue;
atb.Skill = atbSkill.Skill;
atb.Item = atbItem.Item;


/** Game (Client) **/
function GameClient(myId, emitterCallback) {
  this.players = [];
  this.heroes = [];
  this.myId = myId;
  this.me = null;
  this.enemy = null;

  this.eventsIn = new atb.EventQueue(this['processEvent'].bind(this));
  this.emitterCallback = emitterCallback || function(){};

  this.msgFactory = atb.GameEvent.getFactory(myId);
}

var GC = GameClient.prototype;

/**
 * Sets up game state based on data sent from server
 */
GC.setup = function(gameState) {
  // TODO: here we are mimicking 'receiving' player data from server
  var gameStatePlayers = JSON.parse(gameState);

  for (var i = 0; i < gameStatePlayers.length; i++) {
    // take the raw JSON ver of the 'Player' and mash its data into an
    // empty instance of the Domain Player class.
    var rawPlayer = gameStatePlayers[i];
    // this is ugly as sin.
    var playerToAdd = new atb.Player(rawPlayer.id, rawPlayer.name);
    var party = new atb.Party(rawPlayer.party.id, rawPlayer.party.maxSize);
    _.each(rawPlayer.party.heroes, function(rawHero) {
        party.setHero(_.extend(new atb.Hero(), rawHero));
        });
    playerToAdd.setParty(party);
    this.addPlayers(playerToAdd);

    // this is you!
    if (playerToAdd.id == this.myId) {
      this.me = playerToAdd;
    } else {
      // FIXME: works for 1 enemy only
      this.enemy = playerToAdd;
    }
  }
  this.emitterCallback('clientSetupCompleteEvent');
}
GC.ready = function() {
  this.sendToServer(this.msgFactory.create(atb.GameEvent.type.player_ready));
}

GC.start = function() {
  this.emitterCallback('clientGameStartEvent');
  this.log('Game start!');
}

GC.pause = function() {
  this.emitterCallback('clientGamePauseEvent');
  this.log('Game paused!');
}

GC.resume = function() {
  this.emitterCallback('clientGameResumeEvent');
  this.log('Game resumed!');
}

// TODO: should this even be here?
// to be called by the view's game loop
GC.update = function(speedFactor) {
  // client-side 'smooth gauge'.  Use client speed values to
  // extrapolate gauge, subject to server-sync.
  if (!this.isGameOver) {
    var toUpdate = _.filter(this.heroes, function(curHero) {
        if (!curHero.statuses.dead && !curHero.statuses.ready) {
          // TODO: the 180 should be drawn from something tied to the 
          // clock speed of the server - maybe this can be part of the 
          // setup prcoess.
          curHero.turnGauge += curHero.attributes.speed / speedFactor;
          if (curHero.turnGauge >= 100) {
            curHero.turnGauge = 100.00;
          }
          return true;
        }
        return false;
      });
  }
  return toUpdate;
}

GC.queueEvent = function(type, content) {
  this.eventsIn.push(this.msgFactory.create(type, content));
}

GC.processEvent = function() {
  var theEvent = this.eventsIn.shift();
  var args = theEvent.content;
  if (!theEvent || !theEvent.type) {
    console.log('Client: no event or event type, ignoring.');
    console.log(theEvent);
    return;
  }
  switch (theEvent.type) {
    case atb.GameEvent.type.game_setup_state:
      this.setup(args);
      break;
    case atb.GameEvent.type.game_start:
      this.start();
      break;
    case atb.GameEvent.type.game_pause:
      this.pause();
      break;
    case atb.GameEvent.type.game_resume:
      this.resume();
      break;
    case atb.GameEvent.type.heroes_sync:
      // sync player/hero timing. Use as sanity check for gauge.
      // FIXME: for 'smooth' behaviour, only override with sync value
      // if current value is *really* out of whack (+/- 15% )
      var heroesSync = args;
      for (var i = 0; i < heroesSync.length; i++) {
        var theHero = this.heroes[heroesSync[i][0]];
        var diff = theHero.turnGauge - heroesSync[i][1];
        if (Math.abs(diff) > 15) {
          //                console.log('Client: gauge correction for: ' + theHero.id + ', local='+theHero.turnGauge + ', server='+heroesSync[i][1]);
          theHero.turnGauge -= diff;
        }
        this.emitterCallback('clientHeroUpdateEvent', theHero);
      }
      this.emitterCallback('clientSyncHeroEvent', theHero);
      break;
    case atb.GameEvent.type.heroes_ready:
      var readyHeroes = args;
      for (var i = 0; i < readyHeroes.length; i++) {
        var theHero = this.heroes[readyHeroes[i]];
        theHero.statuses.ready = true;
        theHero.turnGauge = 100.00;
        this.emitterCallback('clientHeroUpdateEvent', theHero);
      }
      break;
    case atb.GameEvent.type.heroes_dead:
      var deadHeroes = args;
      for (var i = 0; i < deadHeroes.length; i++) {
        var theHero = this.heroes[deadHeroes[i]];
        this.log(theHero.name + ' was slain!');
        theHero.statuses.dead = true;
        theHero.statuses.ready = false;
        theHero.turnGauge = 0.00;
        theHero.attributes.hp = 0;
        this.emitterCallback('clientHeroUpdateEvent', theHero);
        this.emitterCallback('clientHeroDeadEvent', theHero);
      }
      break;
    case atb.GameEvent.type.heroes_action:
      // execute action
      var action = args;
      var source = this.heroes[action.by];
      var target = this.heroes[action.target];
      var objectId = action.objectId;
      var isCrit = action.isCrit ? action.isCrit : false;
      var skillId = action.skillId;
      var skill = atb.Skill.get(skillId);

      if (!skill) {
        console.log('Client received unknown action.skillId: ' + skillId);
        break;
      }

      switch(true) {
        case (skillId == atb.Skill.ATTACK):
          var msg = source.name + ' attacks ' + target.name + ' for ' + action.amount + ' damage.';
          if (isCrit) {
            msg += ' (Critical Hit)';
          }
          this.log(msg);
          target.attributes.hp -= action.amount;
          if (target.attributes.hp < 0) {
            target.attributes.hp = 0;
          }
          this.emitterCallback('clientHeroActionEvent', action);
          break;
        case (skillId == atb.Skill.ITEM):
          var item = atb.Item[objectId];
          var itemName = item[atb.Item.field.name];

          this.log(source.name + ' uses ['+ itemName +'] on ' + target.name);
          if (action.isRez) {
            target.statuses.dead = false;
            this.log(target.name + ' was revived!');
            this.emitterCallback('clientHeroRezEvent', target);
          }
          if (action.hp > 0) {
            this.log(target.name + ' was healed for ' + action.hp);
            target.attributes.hp += action.hp;
            if (target.attributes.hp > target.attributes.maxHp) {
              target.attributes.hp = target.attributes.maxHp;
            }
            action.amount = action.hp;
            this.emitterCallback('clientHeroActionEvent', action);
          }
          if (action.sp > 0) {
            this.log(target.name + ' recovered ' + action.sp + ' SP');
            target.attributes.sp += action.sp;
            if (target.attributes.sp > target.attributes.maxSp) {
              target.attributes.sp = target.attributes.maxSp;
            }
            action.effectType = 'heal_sp';
            action.amount = action.sp;
            this.emitterCallback('clientHeroActionEvent', action);
          }
          break;
        case (skillId == atb.Skill.DEFEND):
          // FIXME: as you can see, this does nothing
          this.log(source.name + ' defends!');
          this.emitterCallback('clientResetHeroEvent', source);
          break;

        // FIXME: everything else valid is a 'generic skill'
        default:
          var msg = source.name + ' uses [' + skill.name + '] on ' + target.name + ' for ' + action.amount + ' damage.';
          if (isCrit) {
            msg += ' (Critical Hit)';
          }
          this.log(msg);
          target.attributes.hp -= action.amount;
          if (target.attributes.hp < 0) {
            target.attributes.hp = 0;
          }

          // decrement cost of skill from source
          if (action.cost > 0) {
            source.attributes.sp -= action.cost;
//            console.log(skill.name + ' cost ' + action.cost + '; ' + source.name + ' SP should be set to: ' + source.attributes.sp);
          }
          this.emitterCallback('clientHeroActionEvent', action);
          break;
      }
      break;
    case atb.GameEvent.type.heroes_invalid_action:
      // action was invalidated; turn consumed.
      var source = this.heroes[args.by];
      var skill = atb.Skill.get(args.skillId);
      var msg = source.name + ' could not complete ' + skill.name;
      this.log(msg);
      this.emitterCallback('clientResetHeroEvent', source);
      break;
    case atb.GameEvent.type.player_action:
    case atb.GameEvent.type.player_request_pause:
    case atb.GameEvent.type.player_request_resume:
      // send to server
      this.sendToServer(theEvent);
      break;
    case atb.GameEvent.type.game_over:
      this.gameOver(args);
      break;
    default:
      console.log('Unknown event type: ' + theEvent.type);
      break;
  }
}

// adds the specified players to the game
GC.addPlayers = function(players) {
  for (var i = 0; i < arguments.length; i++) {
    var curPlayer = arguments[i];
    this.players.push(curPlayer);
    for (var j = 0; j < curPlayer.party.heroes.length; j++) {
      var curHero = curPlayer.party.heroes[j];
      // augmenting hero with back-link to player
      curHero.player = curPlayer;
      this.heroes[curHero.id] = curHero;
    }
  }
}

// sends an action to the server.
// FIXME: it writes directly to server's inbound event queue
GC.sendToServer = function(theEvent) {
  this.gameInstance.queueAction(theEvent);
}

GC.requestPause = function() {
  this.queueEvent(atb.GameEvent.type.player_request_pause);
}

GC.requestResume = function() {
  this.queueEvent(atb.GameEvent.type.player_request_resume);
}

GC.gameOver = function(theWinner) {
  var winner = _.find(this.players, function(thePlayer) { return thePlayer.id == theWinner.id; });
  this.isGameOver = true;
  this.eventsIn.clear();
  $(this.eventsIn).off('queued');

  var msg = null;
  if (winner) {
    if (winner == this.me) {
      msg = 'You have won the battle!';
    } else {
      msg = 'Player ' + winner.name + ' has won the battle!';
    }
  } else {
    msg = 'Game Over!';
  }
  this.log(msg);
  this.emitterCallback('clientGameOverEvent', winner);
}

// a simple message log.  Allows listener to pickup and handle logging
GC.log = function(msg) {
  this.emitterCallback('clientLogEvent', msg)
}

exports.GameClient = GameClient;
/** END Game (Client) **/


/** CPU Game Client **/

/**
 * The CPU Game Client uses most of the same underlying mechanics as
 * a human player, but overrides the message handling component with
 * AI behaviour.
 */
function CpuGameClient(myId, emitterCallback) {
  GameClient.call(this, myId, emitterCallback);
}
CpuGameClient.prototype = new GameClient();
CpuGameClient.prototype.constructor = CpuGameClient;

var CPUGC = CpuGameClient.prototype;

CPUGC.processEvent = function() {
  var theEvent = this.eventsIn.shift();
  var args = theEvent.content;
  switch (theEvent.type) {
    case atb.GameEvent.type.game_setup_state:
      console.log('CPU Player[' + this.myId + '] setting up state...');
      this.setup(args);
      console.log('CPU Player[' + this.myId + '] is ready!');
      this.ready();
      break;
    case atb.GameEvent.type.heroes_ready:
      var readyHeroes = args;
      var myReadyHeroes = [];
      for (var i = 0; i < readyHeroes.length; i++) {
        var theHero = this.heroes[readyHeroes[i]];
        theHero.statuses.ready = true;
        theHero.turnGauge = 100.00;
        if (theHero.player.id == this.myId) {
          myReadyHeroes.push(theHero);
        }
      }

      // Always attacks!
      // TODO: pick some other actions.
      var enemyHeroes = this.enemy.party.heroes;
      for (var i = 0; i < myReadyHeroes.length; i++) {
        var target = enemyHeroes[_.random(0, enemyHeroes.length-1)];
        if (target.statuses.dead) {
          target = _.find(enemyHeroes, function(theHero) { return !theHero.statuses.dead });
        }
        if (!target) {
          console.log('CPU Player[' + this.myId + '] ERROR! Could not identify any valid targets. Hero dump follows:');
          console.dir(enemyHeroes);
        }
        this.sendToServer(this.msgFactory.create(atb.GameEvent.type.player_action, {skillId: atb.Skill.ATTACK, by: myReadyHeroes[i].id, target: target.id}));
      }
      break;
    case atb.GameEvent.type.heroes_action:
      // TODO: for now, we only care about actions that rez heroes.
      var source = this.heroes[args.by];
      var target = this.heroes[args.target];
      var objectId = args.objectId;

      switch(args.skillId) {
        case atb.Skill.ITEM:
          var item = atb.Item[objectId];
          var itemName = item[atb.Item.field.name];
          if (args.isRez) {
            target.statuses.dead = false;
          }
          break;
        default:
          // don't care
          break;
      }
      break;
    case atb.GameEvent.type.heroes_dead:
      var deadHeroes = args;
      for (var i = 0; i < deadHeroes.length; i++) {
        var theHero = this.heroes[deadHeroes[i]];
        theHero.statuses.dead = true;
        theHero.turnGauge = 0.00;
        theHero.attributes.hp = 0;
      }
      break;
    default:
      // do nothing for now.
      break;
  } // switch
}

exports.CpuGameClient = CpuGameClient;
/** END CPU Game Client */
}, "gameevent": function(exports, require, module) {/** Game Event **/
exports.GameEvent = {
  
  /**
   * payload for a game event message
   */
  Payload: function(type, from, content) {
    this.type = type;
    this.from = from;
    this.content = content;
  },

  /**
   * Convenience factory to generate Payloads
   */
  getFactory: function(from) {
    var factory = {
      create: function(type, content) {
        return new exports.GameEvent.Payload(type, from, content); 
      }
    }
    return factory;
  },

  /**
   * Enumeration of message types
   */
  type: {
    player_action: 'P_ACTION',
    player_ready: 'P_READY',
    player_request_pause: 'P_R_PAUSE',
    player_request_resume: 'P_R_RESUME',
    game_setup_state: 'G_SET_STATE',
    game_ready: 'G_READY',
    game_start: 'G_START',
    game_pause: 'G_PAUSE',
    game_resume: 'G_RESUME',
    game_over: 'G_OVER',
    game_error: 'G_ERROR',
    game_broadcast: 'G_CAST',
    game_tick: 'G_TICK',
    game_duration_tick: 'G_D_TICK',
    heroes_sync: 'H_SYNC',
    heroes_ready: 'H_READY',
    heroes_dead: 'H_DEAD',
    heroes_action: 'H_ACTION',
    heroes_invalid_action: 'H_INV_ACTION'
  }
};

/** END Game Event **/
}, "gameinstance": function(exports, require, module) {var atb = {};
var StateMachine = require('./vendor/state-machine').StateMachine;
var _ = require('underscore');
var async = require('async');

var atbGameEvent = require('./gameevent'); 
var atbUtil = require('./util'); 
var atbSkill = require('./skill');
var atbItem = require('./item');

atb.GameEvent = atbGameEvent.GameEvent;
atb.EventQueue = atbUtil.EventQueue;
atb.Clock = atbUtil.Clock;
atb.Skill = atbSkill.Skill;
atb.Item = atbItem.Item;



/** Default Game Over condition = 1 player dead **/
exports.gameOverDefault = function(gameInstance) {
  var deadPlayer = null;
  var players = gameInstance.players;
  for (var i = 0, len = players.length; i < len; i++) {
    var curPlayer = players[i];
    // every hero in the party is dead
    if (_.all(_.pluck(curPlayer.party.heroes, 'statuses'), function(statuses) { return statuses.dead; })) {
      deadPlayer = curPlayer;
      break;
    }
  } // for i

  // return the winner, if any
  if (deadPlayer) {
    var winner = _.filter(players, function(curPlayer) {
        return(curPlayer.id != deadPlayer.id);
        }, this);
    return winner[0];
  }
  return false;
}

// dispatches based on atb.GameEvent type.
exports.GameInstanceDispatcher = {
    methods: {},

    dispatch: function(type, from, args, instanceContext) {
      return exports.GameInstanceDispatcher.methods[type].call(instanceContext, from, args);
    }
};
var GIDM = exports.GameInstanceDispatcher.methods;

GIDM[atb.GameEvent.type.game_tick] = function(from, args) {
  // update real-tick-based stuff
  this.doTickUpkeep();
}
GIDM[atb.GameEvent.type.game_duration_tick] = function(from, args) {
  // update duration-based stuff.  Filter out completed events.
//     this.durationEventTracker = this.durationEventTracker.filter(this.updateDurationEvent(theEvent));
  var sync = _.map(this.heroes, function(theHero) {
    return [theHero.id, theHero.turnGauge];
  });
  this.queueOutbound(atb.GameEvent.type.heroes_sync, sync);
}
GIDM[atb.GameEvent.type.player_action] = function(from, args) {
  // execute action
  this.executeAction(args);
}
GIDM[atb.GameEvent.type.player_request_pause] = function(from, args) {
  // FIXME: blind pause, no consensus required
  this.fsm.triggerPause();
}
GIDM[atb.GameEvent.type.player_request_resume] = function(from, args) {
  // FIXME: blind resume, no consensus required
  this.fsm.triggerResume();
}
GIDM[atb.GameEvent.type.player_ready] = function(from, args) {
  // FIXME: need to id msgs with a proper 'sender', which would be inherent from the receiving communication
  // for now, any 'ready' message starts the game.
  console.log('GI: player_ready received from Player [' + from + '].');
  if (this.registerReadyPlayer) {
    this.registerReadyPlayer();
  } else {
    console.log('No player ready registration function available');
  }
}

/**
 * hero.speed * this factor = gauge update per tick (at 30 FPS);
 */
exports.SPEED_FACTOR = 100.00 * 30.00;

/** Game Instance (Server) **/
exports.GameInstance = function(clock) {
  // the players
  this.players = [];
  // convenience map for direct access
  this.heroes = {};
  // defines the conditions under which the game ends.
  this.gameOverConditions = [];
  this.isGameOver = false;

  // Game state machine
  this.fsm = StateMachine.create({
      target: this,
      initial: 'new',
      events: [
      { name: 'triggerDoSetup',  from: 'new',  to: 'setup' },
      { name: 'triggerAllReady', from: 'setup', to: 'running' },
      { name: 'triggerPause',  from: 'running', to: 'paused' },
      { name: 'triggerResume',  from: 'paused', to: 'running' },
      { name: 'triggerGameOver', from: ['running', 'paused'], to: 'gameOver' }
    ]});

  // Game clock
  this.clock = clock;

  // 'Real Clock' Duration clock (500ms ticks)
  this.durationClock = new atb.Clock(500);

  // Event Queues
  this.eventsIn = new atb.EventQueue(this['processInbound'].bind(this));
  this.dispatch = this['dispatchInbound'].bind(this);
  this.eventsOut = new atb.EventQueue(this['processOutbound'].bind(this));

  // Msg Factory
  this.msgFactory = atb.GameEvent.getFactory('GI'); // FIXME (instance ID)

  // Speed factor based on game clock tick size
  this.speedFactor = exports.SPEED_FACTOR / this.clock.tickSize;

  // duration based events to keep track of
  this.durationEventTracker = [];

  // handlers
  this.clock.onTick = this['onTick'].bind(this);
  this.durationClock.onTick = this['onDurationTick'].bind(this);
}

var GI = exports.GameInstance.prototype;

// adds the specified players to the game
GI.addPlayers = function(players) {
  for (var i = 0; i < arguments.length; i++) {
    var curPlayer = arguments[i];
    this.players.push(curPlayer);
    for (var j = 0; j < curPlayer.party.heroes.length; j++) {
      var curHero = curPlayer.party.heroes[j];
      this.heroes[curHero.id] = curHero;
    }
  }
  // TODO: players need to augmented with connectivity to their respective clients.
}

// adds the specified game over conditions to the game
GI.addGameOverConditions = function(conditions) {
 this.gameOverConditions = this.gameOverConditions.concat(arguments);
}

GI.checkGameOverConditions = function() {
  var winner = null;
  for (var i = 0; i < this.gameOverConditions.length; i++) {
    winner = this.gameOverConditions[i](this);
    if (winner) {
      // any condition is enogh to trigger Game Over
      this.fsm.triggerGameOver(winner);
      return true;
    }
  }
  return false;
}

// Call once all players have been added to the game;
// this begins the setup process
GI.setup = function() {
  this.fsm.triggerDoSetup();
}

// Finalize Instance params then push game data down to Players.
GI.onsetup = function() {
  console.log('GI: onsetup() called, initializing game instance.');
  // no game over conditions assigned, use the default
  if (this.gameOverConditions.length <= 0) {
    this.gameOverConditions.push(exports.gameOverDefault);
  }

  // Setup to collect 'ready' replies - for now, a simple check that
  // starts the game when number of replies == number of Players.
  // TODO: deal with possibility of timeouts
  this.registerReadyPlayer = _.after(this.players.length, this.fsm.triggerAllReady);
  // Push state to players.
  this.queueOutbound(atb.GameEvent.type.game_setup_state, JSON.stringify(this.players));
}

// start game when all players are ready
GI.ontriggerAllReady = function() {
  console.log('GI: All Players ready, starting game NOW!');
  this.start();
  this.queueOutbound(atb.GameEvent.type.game_start);
  }

GI.onpaused = function() {
  console.log('GI: Game was paused.');
  this.stop();
  // switch dispatch to filtered mode while paused
  this.dispatch = this.filterInbound;
  // any pending events are buffered (stashed) as leaving them in the queue
  // would cause them to be dropped when the game is paused.
  this.eventsIn.stash();
  this.queueOutbound(atb.GameEvent.type.game_pause);
}
GI.ontriggerResume = function() {
  console.log('GI: Game is resumed.');
  // buffered input is processed, regular dispatching resumes
  this.dispatch = this.dispatchInbound;
  this.eventsIn.flush();
  this.start();
  this.queueOutbound(atb.GameEvent.type.game_resume);
}

GI.ongameOver = function(evt, from, to, winner) {
  this.stop();
  this.isGameOver = true;
  this.eventsIn.clear();
  console.log('GI: Game Over! Winner: ' + (winner ? winner.name : '?'));
  this.queueOutbound(atb.GameEvent.type.game_over, winner ? winner : '');
}

/**
 * Starts the game
 */
GI.start = function() {
  this.clock.start();
  this.durationClock.start();
}
GI.stop = function() {
  this.clock.stop();
  this.durationClock.stop();
}
GI.onTick = function() {
  this.queueInbound(atb.GameEvent.type.game_tick);
}
GI.onDurationTick = function() {
  this.queueInbound(atb.GameEvent.type.game_duration_tick);
}
// TODO: this is a hack to allow local comms from client.
GI.queueAction = function(action) {
  this.eventsIn.push(action);
}
// used to queue inbound Events generated internally
GI.queueInbound = function(type, content) {
//  console.log('queueing in: type=' + type + ', content= ' + content);
  this.eventsIn.push(this.msgFactory.create(type, content));
}
// used to filter out incoming events when under a pause state.
// The only Event that will be dispatched are 'resume' events.
// TODO: expand this to other 'game control messages' (e.g. quit)
GI.filterInbound = function(theEvent) {
  if (theEvent.type == atb.GameEvent.type.player_request_resume) {
    this.dispatchInbound(theEvent);
  } else {
    console.log('GI: filtering inbound events, dropping: ' + theEvent.type);
  }
}

GI.queueOutbound = function(type, content) {
//  console.log('queueing out: type=' + type + ', content= ' + content);
  this.eventsOut.push(this.msgFactory.create(type, content));
}
GI.bufferOutbound = function(type, content) {
//  console.log('buffering out: type=' + type + ', content= ' + content);
  this.eventsOut.buffer(this.msgFactory.create(type, content));
}

// Perform upkeep on a real-time tick basis
GI.doTickUpkeep = function() {
  // TODO: do the rest of the stuff!
  this.update();
}

GI.resetHero = function(hero) {
  hero.statuses.ready = false;
  hero.turnGauge = 0.00;
}

GI.killHero = function(hero) {
  hero.attributes.hp = 0;
  hero.statuses.dead = true;
  this.resetHero(hero);

}
// execute an action
GI.executeAction = function(action) {
  // FIXME: this precludes dual-tech/triple-tech etc.
  var actor = this.heroes[action.by];
  var target = this.heroes[action.target];
  var skillId = action.skillId;
  var skill = atb.Skill.get(skillId);

  if (!skill) {
    // drop invalid skills
    console.log('GI: Unknown skillId [' + skillId + '], ignoring action request');
    return;
  } else if (!actor) {
    // drop actions from no/invalid actor
    console.log('GI: no/invalid actor specified, ignoring action request');
    return;
  } else if (!actor.statuses.ready) {
    // drop actions from non-ready actors
    console.log('GI: [' + actor.name + '] is not ready; ignoring action request');
    return;
  } else if (actor.statuses.dead) {
    // drop actions from dead actors
    console.log('GI: [' + actor.name + '] is dead; ignoring action request');
    return;
  }

  // TODO: these should be in handlers or something more organized
  switch(skillId) {
    case atb.Skill.ATTACK:
      if (target.statuses.dead) {
        // reject attacks on dead people.
        this.bufferOutbound(atb.GameEvent.type.heroes_invalid_action, {skillId: skillId, by: actor.id, target: target.id});
      } else {
        var dmg = actor.attributes.attack * (_.random(95, 105)/100); //5% variance for now.
        // 5% crit chance for now
        var isCrit = (_.random(0,99)) < 5;
        if (isCrit) {
          dmg *= 1.5;
        }
        dmg = Math.round(dmg);
        var overkill = 0;
        target.attributes.hp -= dmg;
        this.bufferOutbound(atb.GameEvent.type.heroes_action, {skillId: skillId, by: actor.id, target: target.id, amount: dmg, isCrit: isCrit});
        if (target.attributes.hp <= 0) {
          overkill = -(target.attributes.hp);
          this.killHero(target);
          this.bufferOutbound(atb.GameEvent.type.heroes_dead, [target.id]);
        }
      }
      break;
    case atb.Skill.ITEM:
      var itemId = action.objectId;
      // FIXME - these placeholders and flags are annoying
      var hp = 0;
      var sp = 0;
      var isRez = false;

      // breakdown into component fields
      var statuses = atb.Item[itemId][atb.Item.field.statuses];
      if (statuses) {
        if (statuses[0] < 0 && target.statuses.dead) {
          isRez = true;
          target.statuses.dead = false;
        }
      }
      // non rezzing items can't be used on dead targets
      if (!isRez && target.statuses.dead) {
        this.bufferOutbound(atb.GameEvent.type.heroes_invalid_action, {skillId: skillId, by: actor.id, target: target.id});
        break;
      }
      var attr = atb.Item[itemId][atb.Item.field.attr]; 
      if (attr) {
        hp = attr[0]; 
        sp = attr[1]; 
      }
      target.attributes.hp += hp;
      if (target.attributes.hp > target.attributes.maxHp) {
        target.attributes.hp = target.attributes.maxHp;
      }
      target.attributes.sp += sp;
      if (target.attributes.sp > target.attributes.maxSp) {
        target.attributes.sp = target.attributes.maxSp;
      }

      // TODO: need a consistent way to enumerate status effects.
      var itemEffects = {skillId: atb.Skill.ITEM, objectId: itemId, by: actor.id, target: target.id, hp: hp, sp: sp};
      if (isRez) {
        itemEffects.isRez = true;
      }
      this.bufferOutbound(atb.GameEvent.type.heroes_action, itemEffects);
      break;
    case atb.Skill.DEFEND:
      // FIXME: Defend = skip a turn for now :)
      this.bufferOutbound(atb.GameEvent.type.heroes_action, {skillId: skillId, by: actor.id});
      break;
    default:
      // FIXME generically to dealing with 'everything else'
        var skillCost = skill.cost;
        // TODO: note the huge repetition with ATTACK.  Need to refactor this
        // into a proper 'engine'.
        if (!skill.meetsPrereq(actor, target)) {
          // reject attacks on dead people or if insufficient SP
          this.bufferOutbound(atb.GameEvent.type.heroes_invalid_action, {skillId: skillId, by: actor.id, target: target.id});
        } else {
          var dmg = actor.attributes.attack * (_.random(120, 150)/100); //1.35x multiplier, with 0.15 variance 
          // 5% crit chance for now
          var isCrit = (_.random(0,99)) < 5;
          if (isCrit) {
            dmg *= 1.5;
          }
          // determine damage
          dmg = Math.round(dmg);
          var overkill = 0;
          target.attributes.hp -= dmg;

          // construct the result message
          var skillEffect = {skillId: skillId, by: actor.id, target: target.id, amount: dmg, isCrit: isCrit};
          // decrement skill's cost from actor
          skill.payCost(actor);
          if (skillCost.sp > 0) {
            skillEffect.cost = skillCost.sp;
          }
          this.bufferOutbound(atb.GameEvent.type.heroes_action, skillEffect);
          if (target.attributes.hp <= 0) {
            overkill = -(target.attributes.hp);
            this.killHero(target);
            this.bufferOutbound(atb.GameEvent.type.heroes_dead, [target.id]);
          }
        }
      break;
  } // switch

  // reset actor
  this.resetHero(actor);
  // FIXME: special case, i can't handle a multi-push yet.
  this.eventsOut.flush();
}

// Inbound event processor
GI.processInbound = function(num) {
  var numEvents = num ? num : 1;
  var events = this.eventsIn.shift(numEvents);
  var context = this;
  _.each(events, 
    function(theEvent) {
      if (!theEvent || !theEvent.type) {
        console.log('GI: inbound: no event or event type, ignoring.');
      }
      context.dispatch(theEvent);
    });
}
GI.dispatchInbound = function(theEvent) {
  exports.GameInstanceDispatcher.dispatch(theEvent.type, theEvent.from, theEvent.content, this);
}

// Outbound event processor
GI.processOutbound = function(num) {
  var numEvents = num ? num : 1;
  var events = this.eventsOut.shift(numEvents);
  var context = this;
  _.each(events, 
    function(theEvent) {
      if (!theEvent || !theEvent.type) {
        console.log('GI: outbound: no event or event type, ignoring.');
      }
      // FIXME: this is just a simulated broadcast.
      // async call so that we don't block on communication
      async.forEach(context.players, function(player, cb) { 
        player.sendMessage(theEvent); cb(null); }, 
        function(err) {
//        console.log('GI: broadcast of Event:' + theEvent.type + ' completed');
        });
    });
}

// Game-clock ticks
GI.update = function() {
  if (this.isGameOver || this.checkGameOverConditions()) {
    return;
  }
  // hero ready condition
  var newlyReady = _.filter(this.heroes, function(curHero) {
      if (curHero && !curHero.statuses.dead && !curHero.statuses.ready) {
        curHero.turnGauge += curHero.attributes.speed / this.speedFactor;
        if (curHero.turnGauge >= 100) {
          curHero.statuses.ready = true;
          curHero.turnGauge = 100.00;
          return true;
        }
      }
      return false;
    }, this);
  // broadcast new ready heroes to clients
  // TODO
  if(newlyReady.length > 0) {
    this.queueOutbound(atb.GameEvent.type.heroes_ready, _.pluck(newlyReady, 'id'));
  }
}

/** END Game Instance (server) **/
}, "item": function(exports, require, module) {/** Items and Item Database **/
exports.Item = [
  [0, 'Large Double-Double', 'A large coffee with two creams and two sugars', [200, 0]],
  [1, 'Red Bull', 'Does not actually give you wings', [400, 0]],
  [2, 'Triple Espresso', 'Highly caffeinated', [800, 0]],
  [3, 'Red Rose Tea', 'Orange Pekoe tea', [0, 50]],
  [4, 'Chai Latte', 'Spiced milk tea', [0, 100]],
  [5, 'Green Tea', 'Contains several antioxidant compounds', [0, 200]],
  [6, 'Jumper Cables', 'Shocks a dead hero back to life', [50, 0], [-1]]
];

exports.Item.field = {
  id: 0,
  name: 1,
  desc: 2,
  attr: 3,
  statuses: 4
}
}, "skill": function(exports, require, module) {/** Skills Database **/

exports.SkillData = [
  [0, 'Attack', 'Attack with equipped weapon'],
  [1, 'Defend', 'Increases defenses by 25% for one turn'],
  [2, 'Item', 'Use an Item from your inventory'],
  [3, 'Flee', 'Escape from battle'],
  [4, 'Mighty Swing', 'Deals physical damage to target', [0, 10]],
  [5, 'Flare', 'Deals Fire damage to target', [0, 25]],
  [6, 'Arc Impulse', 'Deals Lightning damage to target', [0, 25]],
  [7, 'Blast Chill', 'Deals Frost damage to target', [0, 25]],
  [8, 'Shockwave', 'Deals physical damage to all enemies', [0, 50]]
];


/** 
 * Convenience encapsulation of SkillData.
 */
exports.Skill = function(id) {
  this.id = id;
  this.data = exports.SkillData[this.id];

  if (!this.data) {
    throw 'Invalid Skill id specified';
  }

  /**
   * Converts cost field array into key-value object.  If cost DNE, returns 
   * null. 
   */
  function toCostObject(cost) {
    if (cost) {
      var theCost = {};
      theCost.hp = cost[0] ? cost[0] : 0;
      theCost.sp = cost[1] ? cost[1] : 0;
      return theCost;
    } else {
      return null;
    }
  }

  this.name = this.data[exports.Skill.field.name];
  this.desc = this.data[exports.Skill.field.desc];
  this.cost = toCostObject(this.data[exports.Skill.field.cost]);
}

// Field enumeration for SkillData attay
exports.Skill.field = {
  id: 0,
  name: 1,
  desc: 2,
  cost: 3
}

{
  var SKILL = exports.Skill.prototype;

  /**
   * Determines if the given hero/target state satisfies the prerequisites to
   * execute the given skill.  Assumes nothing about the target(s).
   * 
   * @return {boolean} true iff the provided state satisfies skill prereqs.
   */
  SKILL.meetsPrereqCast = function(hero) {
    // TODO: generalize for other skills, including items.
    var skillCost = this.cost;
    var skillCostSp = 0;
    
    var meetsPrereqs = true;

    if (skillCost) {
      meetsPrereqs = (hero.attributes.sp >= skillCost.sp 
        && hero.attributes.hp >= skillCost.hp);
    }
    return (meetsPrereqs && !hero.statuses.dead);
  }

  SKILL.meetsPrereq = function(hero, target) {
    return (this.meetsPrereqCast(hero)
      && !target.statuses.dead);
  }

  /**
   * Deducts the skill cost from the executing hero. Assumes hero meets 
   * prerequisites to execute skill.
   *
   * @param {Hero} hero to deduct Skill cost from.
   */
  SKILL.payCost = function(hero) {
    var skillCost = this.cost;
    if (skillCost) {
      hero.attributes.hp -= skillCost.hp;
      hero.attributes.sp -= skillCost.sp;
    }
  }
}


/**
 * Retrieves a Skill object representing the Skill for the given id.
 *
 * @return {Skill} the Skill.  If no such Skill exists, return null;
 */
exports.Skill.get = function(id) {
  return exports.Skill.isValid(id) ? new exports.Skill(id) : null;
}


// Convenience lookups for 'command' skills
exports.Skill.ATTACK = 0;
exports.Skill.DEFEND = 1;
exports.Skill.ITEM = 2;
exports.Skill.FLEE = 3;

// FIXME: this is a hack to specify the range of 'everything else'
exports.Skill.SKILLS_START = 4;


exports.Skill.isValid = function(skillId) {
  return exports.SkillData[skillId] ? true : false; 
}
}, "util": function(exports, require, module) {var _ = require('underscore');

/**
 * A simple, event-firing clock with a configurable tick size.
 * The Clock uses JavaScript setTimeout with self-adjustment to ensure that 
 * the ticks are not skewed by variance in the timer.
 */
function Clock(tickSize) {
  this.tickSize = tickSize;
  this.prevTime = (new Date()).getTime();
  this.timer = null;
  // prevents additional ticks after stop() is called
  this.stopNextTick = false;
  this.onTick = function(){};
}

var C = Clock.prototype;
C.getAdjustment = function(now) {
  var adjustment = 0;
  adjustment = now - this.prevTime - this.tickSize;
  this.prevTime = now;
  return adjustment;
}
C.nextTick = function() {
  var adjustment = this.getAdjustment((new Date()).getTime());
  // TODO: convert to Node event emit
  if (!this.stopNextTick) {
    this.onTick();
    // start next tick
    this.start(adjustment);
  } else {
    console.log('clock stopped, swallowing tick.');
  }
}
C.stop = function() {
  this.stopNextTick = true;
  clearTimeout(this.timer);
}
C.pause = function() {
  this.stop();
  // determine how much of time is left before the next tick.
  // this will be used to adjust the clock on a call to resume().
  this.pauseAdjustment = (new Date()).getTime() - this.prevTime;
  while (this.pauseAdjustment > this.tickSize) {
    this.pauseAdjustment -= this.tickSize;
  }
}
C.resume = function() {
  this.start(this.pauseAdjustment ? this.pauseAdjustment : 0);
}
C.start = function(adjustment) {
  this.stopNextTick = false;
  this.timer = setTimeout(this.nextTick.bind(this), adjustment ? this.tickSize - adjustment : this.tickSize);
}

exports.Clock = Clock;
/** END Clock **/


/**
 * A simple representation of an 'event-queue', which calls a provided callback 
 * each time an event is added.  Note that the user must manually call shift() 
 * to retrieve an event.
 */
function EventQueue(callback) {
  this.events = [];
  this.buf = [];
  this.callback = callback;
}
var EQ = EventQueue.prototype;
EQ.push = function(theEvent) {
  this.events.push(theEvent);
  this.callback(1);
}
EQ.length = function() {
  return this.events.length;
}
EQ.shift = function(num) {
  if (!num) {
    return this.events.shift();
  } else {
    var removed = _.first(this.events, num);
    this.events = _.rest(this.events, removed.length);
    return removed;
  }
}
EQ.clear = function() {
  this.events = [];
  this.buf = [];
}
EQ.bufferLength = function(events) {
  return this.buf.length;
}
EQ.buffer = function(events) {
  this.buf.push.apply(this.buf, arguments);
}
// copies contents of the event queue to the buffer
EQ.stash = function() {
  this.buf.push.apply(this.buf, this.events);
  this.events = [];
}
EQ.flush = function() {
  // add all of the buffered events to the queue, then callback with the 
  // number of added events.
  this.events.push.apply(this.events, this.buf);
  var numBuffered = this.buf.length;
  this.buf = [];
  this.callback(numBuffered);
}

exports.EventQueue = EventQueue;
/** END Event Queue */

}, "vendor/state-machine": function(exports, require, module) {(function(b){var a={VERSION:"2.2.0",Result:{SUCCEEDED:1,NOTRANSITION:2,CANCELLED:3,ASYNC:4},Error:{INVALID_TRANSITION:100,PENDING_TRANSITION:200,INVALID_CALLBACK:300},WILDCARD:"*",ASYNC:"async",create:function(g,h){var j=(typeof g.initial=="string")?{state:g.initial}:g.initial;var f=h||g.target||{};var l=g.events||[];var i=g.callbacks||{};var d={};var k=function(m){var p=(m.from instanceof Array)?m.from:(m.from?[m.from]:[a.WILDCARD]);d[m.name]=d[m.name]||{};for(var o=0;o<p.length;o++){d[m.name][p[o]]=m.to||p[o]}};if(j){j.event=j.event||"startup";k({name:j.event,from:"none",to:j.state})}for(var e=0;e<l.length;e++){k(l[e])}for(var c in d){if(d.hasOwnProperty(c)){f[c]=a.buildEvent(c,d[c])}}for(var c in i){if(i.hasOwnProperty(c)){f[c]=i[c]}}f.current="none";f.is=function(m){return this.current==m};f.can=function(m){return !this.transition&&(d[m].hasOwnProperty(this.current)||d[m].hasOwnProperty(a.WILDCARD))};f.cannot=function(m){return !this.can(m)};f.error=g.error||function(o,s,r,n,m,q,p){throw p||q};if(j&&!j.defer){f[j.event]()}return f},doCallback:function(h,f,d,j,i,c){if(f){try{return f.apply(h,[d,j,i].concat(c))}catch(g){return h.error(d,j,i,c,a.Error.INVALID_CALLBACK,"an exception occurred in a caller-provided callback function",g)}}},beforeEvent:function(e,d,g,f,c){return a.doCallback(e,e["onbefore"+d],d,g,f,c)},afterEvent:function(e,d,g,f,c){return a.doCallback(e,e["onafter"+d]||e["on"+d],d,g,f,c)},leaveState:function(e,d,g,f,c){return a.doCallback(e,e["onleave"+g],d,g,f,c)},enterState:function(e,d,g,f,c){return a.doCallback(e,e["onenter"+f]||e["on"+f],d,g,f,c)},changeState:function(e,d,g,f,c){return a.doCallback(e,e.onchangestate,d,g,f,c)},buildEvent:function(c,d){return function(){var i=this.current;var h=d[i]||d[a.WILDCARD]||i;var f=Array.prototype.slice.call(arguments);if(this.transition){return this.error(c,i,h,f,a.Error.PENDING_TRANSITION,"event "+c+" inappropriate because previous transition did not complete")}if(this.cannot(c)){return this.error(c,i,h,f,a.Error.INVALID_TRANSITION,"event "+c+" inappropriate in current state "+this.current)}if(false===a.beforeEvent(this,c,i,h,f)){return a.CANCELLED}if(i===h){a.afterEvent(this,c,i,h,f);return a.NOTRANSITION}var g=this;this.transition=function(){g.transition=null;g.current=h;a.enterState(g,c,i,h,f);a.changeState(g,c,i,h,f);a.afterEvent(g,c,i,h,f)};this.transition.cancel=function(){g.transition=null;a.afterEvent(g,c,i,h,f)};var e=a.leaveState(this,c,i,h,f);if(false===e){this.transition=null;return a.CANCELLED}else{if("async"===e){return a.ASYNC}else{if(this.transition){this.transition()}return a.SUCCEEDED}}}}};if("function"===typeof define){define(function(c){return a})}else{b.StateMachine=a}}(this));
}});

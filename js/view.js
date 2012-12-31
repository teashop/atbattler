var atb = atb || {};

/*
   A class to implement a gradually incrementing/decrementing numeric
   value.  JavaScript timeouts are used to periodically change a tracked value;
   these in turn can be reflected to the view via a specified callback.

   This class supports chaining increments - by modifying the target value, 
   the class will reconfigure itself based on its current progress and the new
   target.

   Each call to setTarget() can be supplied with a duration - this will
   RESET the total time remaining to the specified duration. If no duration is
   specified, the total time remaining will reset to the original duration.
   
   This is expressed via a recalculation of the step size:

   newStep = (newTarget-current)/duration*tickSize
*/
atb.GradualIncrementer = function(theTarget, theCurrent, onUpdate, duration) {
	this.target = theTarget;
	this.current = (+theCurrent);
	this.duration = duration;
	this.onUpdate = (onUpdate instanceof Function) ? onUpdate : function(){};
	this.tickSize = 33; // ~30 FPS
	this.timeout = null;
	this.step = this.calculateStep();
}
/* GradualIncrementer prototype functions */
{
  var GR_INC = atb.GradualIncrementer.prototype;
  GR_INC.getTarget = function() {
    return this.target;
  }
  GR_INC.setTarget = function(newTarget, newDuration) {
    // don't bother incrementing if there's no change
    if (this.target == newTarget) {
      return;
    }
    this.target = newTarget;
    if (newDuration) {
      this.duration = newDuration;
    }
    this.step = this.calculateStep();
    this.start();
  }
  GR_INC.calculateStep = function() {
    if (this.duration <= 0) {
      // duration shouldn't ever be <= 0; if so treat as a 1 step Op
      return this.target - this.current;
    } else {
      // err on the side of larger steps.
      return Math.ceil((this.target - this.current)/(this.duration * this.tickSize));
    }
  }
  GR_INC.stepThrough = function() {
    this.current = this.current + this.step;
    var isStepPositive = this.step > 0;
    if ((this.current >= this.target && isStepPositive)
        || this.current <= this.target && !isStepPositive) {
      this.onUpdate(this.target);
      clearTimeout(this.timeout);
      this.timeout = null;
      return;
    }
    this.onUpdate(this.current, isStepPositive);
    this.timeout = setTimeout(this.stepThrough.bind(this), this.tickSize);
  }
  GR_INC.start = function() {
    // if there's no currently running timer, start a new one
    if (!this.timeout) {
      this.timeout = setTimeout(this.stepThrough.bind(this), this.tickSize);
    }
  }
  GR_INC.complete = function() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.current = this.target;
    this.onUpdate(this.target);
  }
}

/** 
 * Carousel for 'command panes' (command list for ready heroes)
 */
atb.CommandCarousel = function(container) {
  this.obj = container;
  this.paneWidth = 200;
  this.paneIdPrefix = 'com_';
  this.obj.append('<div class="command-tray" style="display:none"></div>');
  this.tray = $('.command-tray',this.obj);
  this.numPanes = 0;
  // callbacks - provide as required
  this.onAdd = function() {};
  this.onRemove = function() {};
  this.onMoveStart = function() {};
  this.onMoveEnd = function() {};
}
/** CommandCarousel prototype functions */
{
  var CC = atb.CommandCarousel.prototype;

  CC.moveRight = function() {
    var dist = 1;
    if(this.numPanes <= 1 || this.tray.is(':animated')) {
      return;
    }
    this.onMoveStart(this.getInFocusOrigId());
    this.getPaneInFocus().slice(-dist).prependTo(this.tray);
    var width = this.paneWidth;
    this.tray.css({left:'-='+(this.paneWidth*dist)+'px'});
    this.tray.stop().animate({left:"+="+this.paneWidth*dist+"px"},200,(function(){
        this.onMoveEnd(this.getInFocusOrigId());
    }).bind(this));
  }

  CC.moveLeft = function() {
    var dist = 1;
    if(this.numPanes <= 1 || this.tray.is(':animated')) {
      return;
    }
    this.onMoveStart(this.getInFocusOrigId());
    this.tray.stop().animate({left:"-="+(this.paneWidth)*dist+"px"},200,
      (function(){
        this.getPaneInFocus().slice(0, dist).appendTo(this.tray);
        this.tray.css({left:'+='+(this.paneWidth)+'px'});
        this.onMoveEnd(this.getInFocusOrigId());
      }).bind(this)
    );
  }

  CC.add = function(item, position) {
    var toAdd = item.container;
    toAdd.addClass('command-pane');
    toAdd.data('position', position);
    var curPane = this.getPaneInFocus();
    // protip: current pane in focus in the tray is the 1st element
    var paneInFocusId = curPane.attr('id');
    var ancestorId = null;
    // look for closest ancestor
    while (curPane.length > 0) {
      if (curPane.data('position') < position) {
        if (!ancestorId || ancestorId < curPane.attr('id')) {
          ancestorId = curPane.attr('id');
        }
      }
      curPane = curPane.next();
    }
    // couldn't find it == add to end.
    if (!ancestorId) {
      toAdd.appendTo('.command-tray');
    } else {
      // found it, insert after closest ancestor 
      $('#' + ancestorId).after(toAdd);
    }
    // first pane = show tray && inform focus
    if (this.numPanes == 0) {
      this.tray.slideToggle(100);
      this.onMoveEnd(this.getPaneOrigId(item.id));
    }
    this.numPanes++;
    this.onAdd(this.numPanes);
  }

  CC.remove = function(id) {
    var targetId = this.paneIdPrefix + id;
    var target = $('#' + targetId);
    if (target.length > 0) {
      var curPane = this.getPaneInFocus();
      var requiresMove = false;
      // if we're removing the pane in focus, this counts as a carousel move
      if (curPane.attr('id') == targetId) {
        this.onMoveStart(this.getPaneOrigId(curPane.prop('id')));
        requiresMove = true;
      }
      target.slideToggle(100, (function() {
        target.detach(); 
        if (requiresMove) {
          this.onMoveEnd(this.getInFocusOrigId());
        }
      }).bind(this));
      this.numPanes--;
      this.onRemove(this.numPanes);
      // last pane removed, so hide
      if (this.numPanes == 0) {
        this.tray.slideToggle(100);
      }
    }
  }

  CC.clear = function() {
    this.getPaneInFocus().detach();
    this.numPanes = 0;
    this.onRemove(this.numPanes);
  }

  CC.getPaneInFocus = function() {
    return this.obj.find('.command-pane');
  }

  CC.getInFocusOrigId = function() {
    return this.getPaneOrigId(this.getPaneInFocus().prop('id'));
    
  }
  CC.getPaneOrigId = function(domId) {
    return domId ? domId.substr(domId.indexOf('_')+1) : undefined;
  }
}

atb.MenuItemsBoundingTemplate = _.template('<div class="menu-bounding" style="position: relative"></div>');

atb.MenuItemsTemplate = _.template(
    '<ul class="menu-item-list"><% _.each(items, function(item, index) { %>' +
    '<li id="<%= prefix %><%= index %>"><%= item %></li>' +
    '<% }); %></ul>');

/**
 * A menu-items widget supporting a cursor, implied row/column navigation, and
 * auto-scrolling.  Primarily used to support keyboard-based navigation.
 * This widget should be embedded into the actual menu
 */
atb.MenuItems = function(container, prefix) {
  this.container = container;
  this.id = this.container.attr('id');
  this.itemPrefix = prefix ? prefix : this.id + '_it_';

  this.numItems = 0;
  this.curSelected = null;

  // options
  this.itemsPerRow = 1;
  this.isWrapAround = false;

  // callbacks
  this.onSelect = function() {};
  this.onDeselect = function() {};
  // setup blank menu items
  this.container.append(atb.MenuItemsBoundingTemplate({id: this.id}));

  // items will be added/maniuplated within here:
  this.itemContainer = this.container.find('.menu-bounding');

  // FIXME? we only support y (vertical) auto-scroll, not horizontal.
  var containerCssOverflowY = this.container.css('overflow-y');
  this.isScrollY = containerCssOverflowY == 'scroll';
}
/** Menu prototype functions */
{
  var MI = atb.MenuItems.prototype;

  MI.addItems = function(items) {
    this.numItems = items.length;
    this.itemContainer.append(atb.MenuItemsTemplate({items: items, prefix: this.itemPrefix}));
    var selectId = this.itemPrefix + '0';
    this.curSelected = $('#' + selectId, this.itemContainer).addClass('selected');
    this.onSelect(this.curSelected);
  }

  MI.moveCursor = function(dir) {
    if (!dir) {
      return;
    }

    // determine next position based on current pos and desired dir
    var curPos = this.curSelected.attr('id');
    curPos = +curPos.substr(curPos.lastIndexOf('_')+1);
    var nextPos = null;
    switch(dir) {
      case 'left':
        nextPos = curPos-1;
        break;
      case 'right':
        nextPos = curPos+1;
        break;
      case 'up':
        nextPos = curPos - this.itemsPerRow;
        break;
      case 'down':
        nextPos = curPos + this.itemsPerRow;
        break;
      default:
        // do nothin
    } // switch

    this.selectItem(nextPos);
  }

  MI.selectItem = function(nextPos) {
    if (this.isWrapAround) {
      nextPos = (nextPos + this.numItems) % this.numItems;
    }

    if (nextPos >= 0 && nextPos < this.numItems) {
      this.curSelected.removeClass('selected');
      var selectId = this.itemPrefix + nextPos;
      this.curSelected = $('#' + selectId, this.itemContainer).addClass('selected');
      if (this.isScrollY) {
        $(this.container).stop().animate({scrollTop: this.curSelected.position().top - this.curSelected.height()}, 100);
      }
      this.onSelect(this.curSelected);
    }

  }
}

/**
 * A menu class, providing keyboard-input hooks and event hooks.
 */
atb.Menu = function(template, templateParams, parentMenu) {
  this.container = $(template(templateParams));
  this.id = this.container.prop('id');
  //  this.container = $('#'+this.id);
  this.items = null;
  this.parentMenu = parentMenu;
  this.childMenus = {};

  this.onKeydInput = function() {};
  this.onPreClose = function() { return true;};
  this.onClose = function() {};

  if (this.parentMenu) {
    this.parentMenu.registerChild(this);
  }
}

{
  M = atb.Menu.prototype;

  M.addMenuItems = function(selector) {
    this.items = new atb.MenuItems($(selector, this.container));
  }

  M.close = function() {
    this.onPreClose(this);
    this.container.empty().remove();
    this.container = null;
    if (this.parentMenu) {
      this.parentMenu.deregisterChild(this);
    }
    this.onClose(this);
  }

  // recursively closes all child menus
  M.cascadeClose = function() {
    _.each(this.childMenus, (function(menu) {
      menu.cascadeClose();
      this.deregisterChild(menu);
    }).bind(this));
    this.close();
  }

  M.registerChild = function(child) {
    //console.log('registering ' + child.id + ' as child of: ' + this.id);
    this.childMenus[child.id] = child;
  }

  M.deregisterChild = function(child) {
    delete this.childMenus[child.id];
  }
}

var TabControlBehavior = Behavior.create({
  initialize: function() {
    this.tabs = $A();
    this.tabContainer = this.element.select('.tabs')[0];
    this.tabContainer.observe('click', this.onTabClick);
    this.detect();
    this.select(this.tabs.first());
  },
  
  detect: function(element) {
    this.element.select('.page').each(function(page) {
      if (!this.findTabByPage(page)) this.addTab(page);
    }.bind(this));
  },
  
  findTabByPage: function(page) {
    
  },
  
  addTab: function(page) {
    var tab = new TabControlBehavior.Tab(page);
    this.tabs.push(tab);
    this.tabContainer.insert(tab);
  },
  
  select: function(tab) {
    if (this.selected) this.selected.unselect();
    this.selected = tab;
    tab.select();
  },
  
  findTabByElement: function(element) {
    return this.tabs.detect(function(tab) { return tab.element == element; });
  },
  
  onTabClick: function(event) {
    event.stop();
    var e;
    if (event.target.className == 'tab') {
      e = event.target;
    } else {
      e = event.target.up('.tab');
    }
    if (tab) {
      var tab = this.findTabByElement(e);
      console.log(tab);
    }
  }
});

TabControlBehavior.Tab = Class.create({
  initialize: function(page) {
    this.page = page;
    this.caption = page.readAttribute('caption');
  },

  select: function() {
    this.page.show();
    this.element.addClassName('here');
  },

  unselect: function() {
    this.page.hide();
    this.element.removeClassName('here');
  },
  
  toElement: function() {
    this.element = $a({'class': 'tab', 'href': '#'}, $span(this.caption));
    return this.element;
  }
});

TabControlBehavior.instances = $A();

  // /*
  //   Creates a new tab. The variable +tab_id+ is a unique string used to identify the tab
  //   when calling other methods. The variable +caption+ is a string containing the caption
  //   of the tab. The variable +page+ is the ID of an HTML element, or the HTML element
  //   itself. When a tab is initially added the page element is hidden.
  // */
  // addTab: function(tab_id, caption, page) {
  //   var tab = new TabControl.Tab(this, tab_id, caption, page);
  //   
  //   this.tabs.set(tab.id, tab);
  //   return this.tab_container.appendChild(tab.createElement());
  // },
  // 
  // /*
  //   Removes +tab+. The variable +tab+ may be either a tab ID or a tab element.
  // */
  // removeTab: function(tab) {
  //   if (Object.isString(tab)) tab = this.tabs.get(tab);
  //   tab.remove();
  //   this.tabs.unset(tab);
  //   
  //   if (this.selected == tab) {
  //     var first = this.firstTab();
  //     if (first) this.select(first);
  //     else this.selected = null;
  //   }
  // },
  // 
  // /*
  //   Selects +tab+ updating the control. The variable +tab+ may be either a tab ID or a
  //   tab element.
  // */
  // select: function(tab) {
  //   if (Object.isString(tab)) tab = this.tabs.get(tab);
  //   if (this.selected) this.selected.unselect();
  //   tab.select();
  //   this.selected = tab;
  //   var persist = this.pageId() + ':' + this.selected.id;
  //   document.cookie = "current_tab=" + persist + "; path=/admin";
  // },
  // 
  // /*
  //   Returns the first tab element that was added using #addTab().
  // */
  // firstTab: function() {
  //   return this.tabs.get(this.tabs.keys().first());
  // },
  // 
  // /*
  //   Returns the the last tab element that was added using #addTab().
  // */
  // lastTab: function() {
  //   return this.tabs.get(this.tabs.keys().last());
  // },
  // 
  // /*
  //   Returns the total number of tab elements managed by the control.
  // */
  // tabCount: function() {
  //   return this.tabs.keys().length;
  // },
  // 
  // autoSelect: function() {
  //   if (!this.tabs.any()) return; // no tabs in control
  //   
  //   var tab, matches = document.cookie.match(/current_tab=(.+?);/);
  //   if (matches) {
  //     matches = matches[1].split(':');
  //     var page = matches[0], tabId = matches[1];
  //     if (!page || page == this.pageId()) tab = this.tabs.get(tabId);
  //   }
  //   this.select(tab || this.firstTab());
  // },
  // 
  // pageId: function() {
  //   return /(\d+)/.test(window.location.pathname) ? RegExp.$1 : '';
  // }

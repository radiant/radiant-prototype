var TabControlBehavior = Behavior.create({
  initialize: function() {
    new TabControl(this.element);
  }
});

var TabControl = Class.create({
  initialize: function(element) {
    this.element = $(element);
    TabControls[this.element.identify()] = this;
    this.tabs = $A();
    this.tabContainer = this.element.down('.tabs');
    this.tabContainer.observe('click', this.ontabclick.bind(this));
    this.updateTabs();
    this.autoSelect();
  },
  
  updateTabs: function(element) {
    this.element.select('.page').each(function(page) {
      if (!this.findTabByPage(page)) this.addTab(page);
    }.bind(this));
  },
  
  addTab: function(page) {
    var tab = new TabControl.Tab(page);
    this.tabs.push(tab);
    this.tabContainer.insert({bottom: tab});
    page.hide();
  },
  
  removeSelected: function() {
    var tab = this.selected;
    var index = this.tabs.indexOf(tab);
    var newSelectedTab = this.tabs[index-1];
    tab.remove();
    this.tabs = this.tabs.without(tab);
    this.select(newSelectedTab || this.tabs.first());
  },
  
  select: function(tab) {
    if (this.selected) this.selected.unselect();
    this.selected = tab;
    tab.select();
    cookie = Cookie.set('current_tab', tab.caption, 24, '/admin');
  },
  
  autoSelect: function() {
    if (!this.tabs.any()) return;
    var caption = Cookie.get('current_tab');
    var tab = this.findTabByCaption(caption);
    this.select(tab || this.tabs.first());
  },
  
  ontabclick: function(event) {
    var e = event.target.hasClassName('tab') ? event.target : event.target.up('.tab');
    if (e) {
      var tab = this.findTabByElement(e);
      if (tab) {
        this.select(tab);
        event.stop();
      }
    }
  },
  
  findTabByCaption: function(caption) {
    return this.tabs.detect(function(tab) { return tab.caption == caption });
  },
  
  findTabByPage: function(page) {
    return this.tabs.detect(function(tab) { return tab.page == page });
  },
  
  findTabByElement: function(element) {
    return this.tabs.detect(function(tab) { return tab.element == element });
  }
});

TabControl.Tab = Class.create({
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
  
  remove: function() {
    this.page.remove();
    this.element.remove();
  },
  
  toElement: function() {
    this.element = $a({'class': 'tab', 'href': '#'}, $span(this.caption));
    return this.element;
  }
});

var TabControls = {};
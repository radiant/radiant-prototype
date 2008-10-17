var TabControlBehavior = Behavior.create({
  initialize: function() {
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
    this.tabs.each(function(tab) {
      if (tab.page.parentNode == null) console.log('null parent:' + tab.caption);
    });
  },
  
  addTab: function(page) {
    var tab = new TabControlBehavior.Tab(page);
    this.tabs.push(tab);
    this.tabContainer.insert({bottom: tab});
    page.hide();
  },
  
  select: function(tab) {
    if (this.selected) this.selected.unselect();
    this.selected = tab;
    tab.select();
    cookie = Cookie.set('current_tab', tab.caption, null, '/admin');
  },
  
  autoSelect: function() {
    if (!this.tabs.any()) return;
    var caption = Cookie.get('current_tab');
    var tab = this.findTabByCaption(caption);
    this.select(tab || this.tabs.first());
  },
  
  ontabclick: function(event) {
    var e = event.target.hasClassName('tab') ?  event.target : event.target.up('.tab');
    if (e) {
      var tab = this.findTabByElement(e);
      if (tab) {
        this.select(tab);
        event.stop();
      }
    }
  },
  
  'onpage:added': function(event) {
    this.updateTabs();
    this.select(this.tabs.last());
  },
  
  'onremove:selected': function(event) {
    var tab = this.selected;
    var index = this.tabs.indexOf(tab);
    tab.remove();
    this.select(this.tabs[index-1] || this.tabs.first());
    this.tabs = this.tabs.without(tab);
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
  
  remove: function() {
    this.page.remove();
    this.element.remove();
  },
  
  toElement: function() {
    this.element = $a({'class': 'tab', 'href': '#'}, $span(this.caption));
    return this.element;
  }
});

TabControlBehavior.instances = $A();
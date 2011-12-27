if(typeof(relative_url_root) === 'undefined'){ relative_url_root = ''}

(function($) {

  var Tab = function(page) {
    var self = this;

    self.page = $(page);
    self.caption = self.page.data('caption');
    
    self.select = function() {
      self.page.show();
      self.element.addClass('here');
    };
    
    self.unselect = function() {
      self.page.hide();
      self.element.removeClass('here');
    };
    
    self.remove = function() {
      self.page.remove();
      self.element.remove();
    };
    
    self.toElement = function() {
      var template = '<a href="#" class="tab"><span>' + self.caption + '</span><img src="' + relative_url_root + '/images/admin/tab_close.png" class="close" alt="Remove part" title="Remove part" /></a>';
      self.element = $(template);
      return self.element;
    };

    return self;
  };

  $.fn.tabcontrol = function() {
    var self = $(this)
    ,   tabs = []
    ,   tabContainer = self.find('.tabs')
    ,   selected = null
    ;

    function without(array, item) {
      var result = []
      ,   index = array.indexOf(item)
      ;
      for (var i = 0; i < array.length; i++) {
        if (i != index) {
          result.push(array[i]);
        }
      }
      return result;
    }

    function findTab(comparison) {
      var found = null;
      for (var i = 0; i < tabs.length; i++) {
        if (comparison(tabs[i])) { found = tabs[i]; break; }
      }
      return found;
    }

    function findTabByCaption(caption) {
      return findTab(function(tab) { return tab.caption == caption; });
    }
    
    function findTabByPage(page) {
      return findTab(function(tab) { return tab.page == page; });
    }
    
    function findTabByElement(element) {
      var element = $(element);
      return findTab(function(tab) { return tab.element.get(0) == element.get(0); });
    }

    function addTab(page) {
      var page = $(page)
      ,   tab = new Tab(page)
      ;
      tabs.push(tab);
      tabContainer.append(tab.toElement());
      page.hide();
    }
    
    function select(tab) {
      if (selected) selected.unselect();
      selected = tab;
      tab.select();
      cookie = Cookie.set('current_tab', tab.caption, 24, '/admin');
    }
    
    function autoSelect() {
      if (tabs.length == 0) return;
      var caption = Cookie.get('current_tab')
      ,   tab = findTabByCaption(caption)
      ;
      select(tab || tabs[0]);
    }
    
    function removeSelected() {
      var tab = selected
      ,   index = tabs.indexOf(tab)
      ,   newTab = tabs[index - 1]
      ;
      tab.remove();
      tabs = without(tabs, tab);
      select(newTab || tabs[0]);
    }

    function updateTabs() {
      self.find('.page').each(function(page) {
        if (!findTabByPage(this)) { addTab(this); }
      });
    }

    tabContainer.delegate('.tab', 'click', function(event) {
      var target = $(event.target)
      ,   e = target.hasClass('tab') ? target : target.parents('.tab').first()
      ;
      if (e) {
        var tab = findTabByElement(e);
        if (tab) {
          if ($(e).hasClass('close')) {
            if (confirm('Remove the "' + tab.caption + '" part?')) {
              var lastSelected = selected;
              select(tab);
              removeSelected();
              if (lastSelected != tab) select(lastSelected);
            }
          } else {
            select(tab);
          }
          event.stopPropagation();
        }
      }
    });
    
    updateTabs();
    autoSelect();
    
  };

})(jQuery);

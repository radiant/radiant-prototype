// Popup Images
Popup.BorderImage            = '/admin/images/popup_border_background.png';
Popup.BorderTopLeftImage     = '/admin/images/popup_border_top_left.png';
Popup.BorderTopRightImage    = '/admin/images/popup_border_top_right.png';
Popup.BorderBottomLeftImage  = '/admin/images/popup_border_bottom_left.png';
Popup.BorderBottomRightImage = '/admin/images/popup_border_bottom_right.png';

// Behaviors
Event.addBehavior({
  'a.popup': Popup.TriggerBehavior(),
  
  'table#site-map': SiteMapBehavior(),
  
  'input#page_title': function() {
    var title = this;
    var slug = $('page_slug');
    var breadcrumb = $('page_breadcrumb');
    var oldTitle = title.value;
    
    if (!slug || !breadcrumb) return;
    
    new Form.Element.Observer(title, 0.15, function() {
      if (oldTitle.toSlug() == slug.value) slug.value = title.value.toSlug();
      if (oldTitle == breadcrumb.value) breadcrumb.value = title.value;
      oldTitle = title.value;
    });
  },
  
  'div#tab-control': function() {
    tabControl = new TabControl(this);
    
    $$('#pages div.part > input[type=hidden]:first-child').each(function(part, index) {
      var page = part.up('.page');
      tabControl.addTab('tab-' + (index + 1), part.value, page.id);
    });
    
    tabControl.autoSelect();
  },
  
  'table.index': RuledTableBehavior(),
  
  'form input.activate': function() {
    this.activate();
  }
});
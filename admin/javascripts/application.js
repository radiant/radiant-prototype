// Popup Images
Popup.BorderImage            = '/admin/images/popup_border_background.png';
Popup.BorderTopLeftImage     = '/admin/images/popup_border_top_left.png';
Popup.BorderTopRightImage    = '/admin/images/popup_border_top_right.png';
Popup.BorderBottomLeftImage  = '/admin/images/popup_border_bottom_left.png';
Popup.BorderBottomRightImage = '/admin/images/popup_border_bottom_right.png';

// Status Images
Status.SpinnerImage          = '/admin/images/status_spinner.gif';
Status.BackgroundImage       = '/admin/images/status_background.png';
Status.TopLeftImage          = '/admin/images/status_top_left.png';
Status.TopRightImage         = '/admin/images/status_top_right.png';
Status.BottomLeftImage       = '/admin/images/status_bottom_left.png';
Status.BottomRightImage      = '/admin/images/status_bottom_right.png';

Event.addBehavior.reassignAfterAjax = true;

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
  
  'div#tab-control': TabControlBehavior(),
  
  'table.index': RuledTableBehavior(),
  
  'form': Status.FormBehavior(),
  
  'form input.activate': function() {
    this.activate();
  }
});
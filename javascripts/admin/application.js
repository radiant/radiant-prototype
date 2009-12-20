// Ensure that relative_url_root is defined
if(typeof(relative_url_root) === 'undefined'){ relative_url_root = ''}

// Popup Images
Popup.BorderImage            = relative_url_root + '/images/admin/popup_border_background.png';
Popup.BorderTopLeftImage     = relative_url_root + '/images/admin/popup_border_top_left.png';
Popup.BorderTopRightImage    = relative_url_root + '/images/admin/popup_border_top_right.png';
Popup.BorderBottomLeftImage  = relative_url_root + '/images/admin/popup_border_bottom_left.png';
Popup.BorderBottomRightImage = relative_url_root + '/images/admin/popup_border_bottom_right.png';

// Status Images
Status.SpinnerImage          = relative_url_root + '/images/admin/status_spinner.gif';
Status.BackgroundImage       = relative_url_root + '/images/admin/status_background.png';
Status.TopLeftImage          = relative_url_root + '/images/admin/status_top_left.png';
Status.TopRightImage         = relative_url_root + '/images/admin/status_top_right.png';
Status.BottomLeftImage       = relative_url_root + '/images/admin/status_bottom_left.png';
Status.BottomRightImage      = relative_url_root + '/images/admin/status_bottom_right.png';

// Status Message Styles
Status.MessageColor = '#e5e5e5';
Status.MessageFontFamily = '"Lucida Grande", "Bitstream Vera Sans", Helvetica, Verdana, Arial, sans-serif';
Status.MessageFontSize = '90%';

// Use Modal Status Windows
Status.Modal = true;
Status.ModalOverlayColor = 'black';
Status.ModalOverlayOpacity = 0.2;

// Reload behaviors for Ajax Requests
Event.addBehavior.reassignAfterAjax = true;

// Wire in Behaviors
Event.addBehavior({
  'body': ShortcutKeysBehavior(),
  
  'a.popup': Popup.TriggerBehavior(),
  
  'table#site_map': SiteMapBehavior(),
  
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
  
  'div#tab_control': TabControlBehavior(),
  
  'table.index': RuledTableBehavior(),
  
  'form': Status.FormBehavior(),
  
  'form input.activate': function() {
    this.activate();
  },
  
  'form textarea': CodeAreaBehavior()
});

// Toolbars
var teButtons = TextileEditor.prototype.buttons;
teButtons.push(new EditorButton('strong',     'bold.png',          '*',   '*',  'b', 'Bold','s'));
teButtons.push(new EditorButton('emphasis',   'italic.png',        '_',   '_',  'i', 'Italicize','s'));
teButtons.push(new EditorButton('ol',         'list_numbers.png',  '# ', '\n', ',', 'Numbered List'));
teButtons.push(new EditorButton('ul',         'list_bullets.png',  '* ', '\n', '.', 'Bulleted List'));
teButtons.push(new EditorButton('h1',         'h1.png',            'h1',  '\n', '1', 'Header 1'));
teButtons.push(new EditorButton('h2',         'h2.png',            'h2',  '\n', '2', 'Header 2'));
teButtons.push(new EditorButton('h3',         'h3.png',            'h3',  '\n', '3', 'Header 3'));
teButtons.push(new EditorButton('block',      'blockquote.png',    'bq',  '\n', 'q', 'Blockquote'));
teButtons.push(new EditorButtonSeparator(''));
teButtons.push("<button class=\"link\" onclick=\"alert('not yet ported from textile_editor');return false; new LinkPopup(this);return false;\" accesskey=\"a\" class=\"standard\"><img src=\""+relative_url_root+"/images/admin/toolbar/link.png\" title=\"Link\" alt=\"Link\" /></button>");
teButtons.push("<button class=\"img\" onclick=\"alert('not yet ported from textile_editor');return false; new ImagePopup(this);return false;\" accesskey=\"m\" class=\"standard\"><img src=\""+relative_url_root+"/images/admin/toolbar/image.png\" title=\"Image\" alt=\"Image\" /></button>");

var meButtons = MarkdownEditor.prototype.buttons;
meButtons.push(new EditorButton('strong',     'bold.png',          '**',   '**',  'b', 'Bold','s'));
meButtons.push(new EditorButton('emphasis',   'italic.png',        '_',   '_',  'i', 'Italicize','s'));

var reButtons = RadiusEditor.prototype.buttons;
reButtons.push(new EditorButtonSeparator(''));
reButtons.push("<button class=\"snippet\" onclick=\"loadSnippetReference(0); return false;\" accesskey=\"s\" class=\"standard\"><img src=\""+relative_url_root+"/images/admin/toolbar/snippet.png\" title=\"Snippets\" alt=\"Snippets\" /></button>");
reButtons.push("<button class=\"tag\" onclick=\"loadTagReference(0); return false;\" accesskey=\"t\" class=\"standard\"><img src=\""+relative_url_root+"/images/admin/toolbar/tag.png\" title=\"Tags\" alt=\"Tags\" /></button>");

function load_toolbars() {
  parts = $$('.pages textarea').each(function(textarea) {
    new RadiusEditor(textarea.id, "extended");
    new filterObserver(textarea);
  });
}
Event.observe(window, 'load', load_toolbars);
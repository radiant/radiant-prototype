/*
 *  sitemap.js
 *  
 *  depends on: jquery
 *  
 *  Used by Radiant to create the expandable sitemap.
 *  
 *  To use, simply add the following lines to application.js:
 *  
 *    $('table#pages').sitemap();
 *
 */

(function($) {

  $.fn.sitemap = function() {
    var self = this
    ,   updating = false
    ,   expanded = null
    ;

    // Read expanded rows
    var matches = document.cookie.match(/expanded_rows=(.+?);/);
    expanded = matches ? decodeURIComponent(matches[1]).split(',') : [];

    // Return an array with uniq items
    function uniq(array) {
      var sorted = array.slice(0).sort(function(a, b) { return a - b; })
      ,   result = []
      ;
      for (var i = 0, len = sorted.length; i < len; i++) {
        if (i == 0 || sorted[i] != sorted[i - 1]) {
          result.push(sorted[i]);
        }
      }
      return result;
    }

    // Remove an item from an array
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

    // Save expanded rows cookie
    function saveExpandedCookie() {
      document.cookie = "expanded_rows=" + encodeURIComponent(uniq(expanded).join(",")) + "; path=/admin";
    } 

    // Persist collapsed row
    function persistCollapsed(row) {
      var pageId = extractPageId(row);
      expanded = without(expanded, pageId);
      saveExpandedCookie();
    }

    // Persist expanded row
    function persistExpanded(row) {
      expanded.push(extractPageId(row));
      saveExpandedCookie();
    }

    // Test if element is expander
    function isExpander(element) {
      return $(element).hasClass('expander');
    }

    // Test if element is a row
    function isRow(element) {
      var e = $(element).get(0);
      return !!(e && e.tagName && e.tagName.match(/tr/i));
    }

    function isExpanded(row) {
      return $(row).hasClass('children_visible');
    }

    // Test if row has children
    function hasChildren(row) {
      return !row.hasClass('no_children');
    }

    // Extract the current level for row
    function extractLevel(row) {
      var classes = row.attr('class') || ''
      , matches = classes.match(/level_(\d+)/i)
      ;
      if (matches) { return parseInt(matches[1]); }
    }

    function extractPageId(row) {
      var id = row.attr('id')
      ,   matches = id.match(/page_(\d+)/i) 
      ;
      if (matches) { return parseInt(matches[1]); }
    }

    // Find the expander for a row
    function getExpanderImageForRow(row) {
      return row.find('.expander');
    }

    // Toggle the visibility of the children of a row
    function toggleExpanded(row, img) {
      if (!img) img = getExpanderImageForRow(row);
      var row = $(row)
      ,   img = $(img)
      ,   image = img.get(0)
      ;

      if (isExpanded(row)) {
        image.src = image.src.replace('collapse', 'expand');
        row.removeClass('children_visible');
        row.addClass('children_hidden');
        persistCollapsed(row);
      } else {
        image.src = image.src.replace('expand', 'collapse');
        row.removeClass('children_hidden');
        row.addClass('children_visible');
        persistExpanded(row);
      }
    }

    // Fetch HTML for children of row
    function getBranch(row) {
      var id = extractPageId(row)
      ,   level = extractLevel(row)
      ,   spinner = $('#busy_' + id)
      ;
      updating = true;
      spinner.show();
      $.ajax({
        url: '/admin/pages/' + id + '/children?level=' + level,
        dataType: 'html',
        success: function(data) {
          row.after(data);
          spinner.fadeOut('slow');
          updating = false;
        }
      });
    }

    // Hide children for row
    function hideBranch(parent, img) {
      var parent = $(parent)
      ,   img = $(img)
      ,   level = extractLevel(parent)
      ,   row = parent.next()
      ;

      while (isRow(row) && extractLevel(row) > level) {
        row.hide();
        row = row.next();
      }

      toggleExpanded(parent, img);
    }

    function showBranch(parent, img) {
      var parent = $(parent)
      ,   img = $(img)
      ,   level = extractLevel(parent)
      ,   row = parent.next()
      ,   children = false
      ,   expandLevels = [level + 1]
      ;

      while (isRow(row)) {
        var currentLevel = extractLevel(row);
        if (currentLevel <= level) break;
        children = true;
        if (currentLevel < expandLevels[expandLevels.length]) { expandLevels.pop(); }
        if (expandLevels.indexOf(currentLevel) > -1) {
          row.show();
          if (isExpanded(row)) expandLevels.push(currentLevel + 1);
        }
        row = row.next();
      }

      if (!children) getBranch(parent);

      toggleExpanded(parent, img);
    }

    // Toggle children for row
    function toggleBranch(row, img) {
      if (!updating) {
        if (isExpanded(row)) {
          hideBranch(row, img);
        } else {
          showBranch(row, img);
        }
      }
    }

    this.on('click', function(event) {
      if (isExpander(event.target)) {
        var row = $(event.target).parents('tr').first();
        if (hasChildren(row)) {
          toggleBranch(row, event.target);
        }
      }
    });
  };

})(jQuery);

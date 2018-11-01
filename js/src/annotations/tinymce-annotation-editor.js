(function($){

  $.TinyMCEAnnotationBodyEditor = function(options) {

    jQuery.extend(this, {
      annotation: null,
      windowId: null,
      config: {
        plugins: '',
        toolbar: '',
        tags: []
      }
    }, options);

    this.init();
  };

  $.TinyMCEAnnotationBodyEditor.prototype = {
    init: function() {
      var _this = this;
      var annoText = "",
        restricted = "",
        selectedTags = [],
        tags = [];
      if (!jQuery.isEmptyObject(_this.annotation)) {
        if (typeof _this.annotation.permissions !== "undefined") {
          if (typeof _this.annotation.permissions.read[0] !== "undefined") {
            restricted = "checked";
          }
        }
        if (jQuery.isArray(_this.annotation.resource)) {
          jQuery.each(_this.annotation.resource, function(index, value) {
            if (value['@type'] === "oa:Tag") {
              selectedTags.push(value.chars);
            } else {
              annoText = value.chars;
            }
          });
        } else {
          annoText = _this.annotation.resource.chars;
        }
      }
      (this.config.tags || []).forEach(function(item) {
        if (selectedTags.indexOf(item) < 0) {
          tags.push(item);
        }
      });
      tags = tags.concat(selectedTags);
      
      var optionSelected='commenting'; /* JH */
      $.Handlebars.registerHelper('selectAnnotype', function(selected, options) {
        return options.fn(this).replace(
        new RegExp(' value=\"' + optionSelected + '\"'),
        '$& selected="selected"');
      });

      this.editorMarkup = this.editorTemplate({
        content: annoText,
        selectedTags : selectedTags,
        tags: tags,
        windowId : _this.windowId
      });
    },

    show: function(selector) {
      this.editorContainer = jQuery(selector)
        .prepend(this.editorMarkup);
      tinymce.init({
        selector: selector + ' textarea',
        plugins: this.config.plugins,
        menubar: false,
        statusbar: false,
        toolbar_items_size: 'small',
        toolbar: this.config.toolbar,
        default_link_target:"_blank",
        setup: function(editor) {
          editor.on('init', function(args) {
            tinymce.execCommand('mceFocus', false, args.target.id);
            jQuery('.tags-editor').select2({
              tags: true,
              placeholder: "Add tags here..."
              // tokenSeparators: [',', ' ']  // spaces for backward compatibility
            });
          });
        }
      });
    },

    isDirty: function() {
      return tinymce.activeEditor.isDirty();
    },

    createAnnotation: function() {
      var tags = this.editorContainer.find('.tags-editor').val(),
        resourceText = tinymce.activeEditor.getContent();

      var motivation = [],
        motivationSelected = "",
        resource = [],
        restricted = false,     /* JBH */
        on;

      restricted = this.editorContainer.find('.anno-privacy').prop('checked');
      motivationSelected = this.editorContainer.find('#select-annotype').find(":selected").prop('value');

      if (tags && tags.length > 0) {
        motivation.push("oa:tagging");
        jQuery.each(tags, function(index, value) {
          resource.push({
            "@type": "oa:Tag",
            "chars": value
          });
        });
      }
      motivation.push("oa:"+motivationSelected);
      if (motivationSelected == "transcribing" || motivationSelected == "translating") {
        motivation.push("oa:supplementing");
      }

      resource.push({
        "@type": "dctypes:Text",
        "format": "text/html",
        "chars": resourceText
      });
      return {
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@type": "oa:Annotation",
        "motivation": motivation,
        "restricted": restricted,
        "resource": resource
      };
    },
    
    updateAnnotation: function(oaAnno) {
      var selectedTags = this.editorContainer.find('.tags-editor').val(),
        resourceText = tinymce.activeEditor.getContent();

      var motivation = [],
        privacy = false,
        selectedMotivation = "",
        resource = [];

      // get "keep private" checkbox value
      var restricted = this.editorContainer.find('.anno-privacy').prop('checked');
      oaAnno.restricted = restricted;

      oaAnno.motivation = [];
      var motivationSelected = this.editorContainer.find('#select-annotype').find(":selected").prop('value');
      if (typeof motivationSelected !== "undefined") {
        oaAnno.motivation.push("oa:"+motivationSelected);
      }
      if (motivationSelected == "transcribing" || motivationSelected == "translating") {
        oaAnno.motivation.push("oa:supplementing");
      }

      oaAnno.resource = jQuery.grep(oaAnno.resource, function(value) {
        return value["@type"] !== "oa:Tag";
      });
      //re-add tagging if we have them
      if (selectedTags.length > 0) {
        oaAnno.motivation.push("oa:tagging");
        jQuery.each(selectedTags, function(index, value) {
          oaAnno.resource.push({
            "@type": "oa:Tag",
            "chars": value
          });
        });
      }
      jQuery.each(oaAnno.resource, function(index, value) {
        if (value["@type"] === "dctypes:Text") {
          value.chars = resourceText;
        }
      });
    },

    editorTemplate: $.Handlebars.compile([
      '<textarea class="text-editor" placeholder="{{t "comments"}}…">{{#if content}}{{content}}{{/if}}</textarea>',
      '<select id="tags-editor-{{windowId}}" class="tags-editor" multiple="true">{{#each tags}}',
      '<option value="{{this}}" {{#ifContains ../selectedTags this }}selected="selected"{{/ifContains}}>{{this}}</option>',
      '{{/each}}</select>'
    ].join(''))
  };
  
  var optionSelected='commenting'; // default motivation
  $.Handlebars.registerHelper('selectAnnotype', function(selected, options) {
    return options.fn(this).replace(
    new RegExp(' value=\"' + optionSelected + '\"'),
    '$& selected="selected"');
  });

  // Handlebars helper: Contains
  // check if a value is contained in an array
  $.Handlebars.registerHelper("ifContains", function( array, value, options ){
    array = ( array instanceof Array ) ? array : [array];
    return (array.indexOf(value) > -1) ? options.fn( this ) : "";
  });
}(Mirador));

(function($) {

  /**
   * Default values for settings
   */
  $.DEFAULT_SETTINGS = {

    'workspaceAutoSave': true,

    'currentWorkspace': 'singleObject',

    'availableWorkspaces': ['singleObject', 'compare', 'bookReading'],
      
    'workspaces' : {
       'singleObject': {
            'slots': [{
                'width': '100%'
            }],
            'label': 'Single Object',
            'addNew': false,
            'move': false,
            'iconClass': 'image'
        },
        
        'compare': {
            'slots': [
                {},
                {}
            ],
            'label': 'Compare',
            'iconClass': 'columns'
        },
        
        'bookReading': {
            'slots': [
              {}
            ],
            'defaultWindowOptions': {
            },
            'label': 'Book Reading',
            'addNew': true,
            'move': false,
            'iconClass': 'book'
        }
        // add new workspace types by appending a 
        // profile with plugin initialisation code:
        // $.DEFAULT_SETTINGS.workspaces['myNwqWorkspace'] = {...}
    },
    
    // main (top) menu
    'mainMenu': {
      'autoHide': true,
      'height': 25,
      'width': '100%'
    },

   'repoImages' : {
      'Yale University': 'yale_logo.jpeg',
      'Stanford University': 'sul_logo.jpeg',
      'Harvard University': 'harvard_logo.png',
      'other': 'iiif_logo.png'
    },

    // // metadata view
    // unclear what options should exist here.
    // 'metadataView': {
    //   'height': 400,
    //   'width': 600
    // },

    // // metadata view
    //
    // What can we learn from this and the
    // openi https://github.com/CtrHellenicStudies/OpenSeaDragonAnnotation
    // annotator-based branches of the RC? 
    //
    // 'openLayersAnnotoriusView': {
    //   'appId': 'lQ9BqPkPRVJR4Qbe652BapTP2JVDNzS0G2k6GCWW', // Parse.com app id
    //   'jsKey': 'VbYdon3U70Wi8aht9Y8Z2eRk3FmOsO2n1lQhx1vV', // Parse.com js_key
    //   'height': 400,
    //   'width': 600,
    //   'maxSize': 2500, // max longest side to load in open layers
    //   'maxZoomLevel': 4
    // },
    
    'annotationEndpoint': {
      'url': '',
      'storeId': 123,
      'APIKey': '23983hf98j3f9283jf2983fj'
    },
    
    // parameters of saving system
    'saveController': {
        // TODO: make saving a function of significant user action, not timed intervals.
    },

    'sharingEndpoint': {
      'url': '',
      'storeId': 123,
      'APIKey': '23983hf98j3f9283jf2983fj'
    },

    // linked image views configuration
    'lockController' : {
      'lockProfile' : 'lazyZoom',
      'notifyMaxMin' : true
    }
  };

}(Mirador));

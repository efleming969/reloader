var connections = null

var createConnection = function( id, callback ) {

  var ws = new WebSocket('ws://localhost:8080')

  ws.onmessage = function( event ) {
    console.log( 'message:' + event.data )
    if ( event.data == 'reload' ) {
      chrome.tabs.reload( id )
    }
  }

  ws.onopen = function( event ) {
    callback( ws )
  }

  ws.onclose = function( event ) {
    chrome.browserAction.setIcon( { path: 'icon-off-19.png' }, function() {
      connection = null
    } )
  }

}

chrome.browserAction.onClicked.addListener( function ( tab ) {
  createConnection( tab.id, function( ws ) {
    chrome.browserAction.setIcon( { path: 'icon-on-19.png' }, function() {
      connections.push( ws )
    } )
  } )
} )

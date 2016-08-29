var ws = null
var tabs = []

var isLocalHost = function( url ) {
  return url != undefined && url.indexOf( 'http://localhost:8080' ) == 0
}

chrome.browserAction.onClicked.addListener( function ( tab ) {

  if ( ws == null || ws.readyState == WebSocket.CLOSED ) {

    ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = function( event ) {
      if ( event.data == 'reload' ) {
        tabs.forEach( function( tabId ) {
          chrome.tabs.reload( tabId )
        } )
      }
    }

    ws.onopen = function( event ) {
      chrome.browserAction.setIcon( { path: 'icon-on-19.png' }, function() {
        console.log( 'connected to localhost' )
      } )
    }

    ws.onclose = function( event ) {
      chrome.browserAction.setIcon( { path: 'icon-off-19.png' }, function() {
        console.log( 'diconnected from localhost' )
      } )
    }
  }
  else if ( ws.readyState == WebSocket.OPEN ) {
    ws.close()
  }

} )

chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {
  if ( isLocalHost( tab.url ) && tabs.includes( tabId ) == false ) {
    tabs.push( tabId )
  }
} )

chrome.tabs.onRemoved.addListener( function( removed_tabId ) {
  tabs.splice( tabs.findIndex( function( tabId, index ) {
    return tabId == removed_tabId
  } ), 1 )
} )


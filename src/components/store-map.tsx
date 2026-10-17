import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { Colors } from '@/constants/theme';
import type { Store } from '@/data/types';

interface StoreMapProps {
  stores: Store[];
  you: { latitude: number; longitude: number };
  selectedId: string;
  onSelect: (id: string) => void;
}

// Leaflet + CARTO/OpenStreetMap tiles in a WebView: no Google Maps key needed,
// and it renders the same in Expo Go and store builds on both platforms.
function buildHtml(stores: Store[], you: StoreMapProps['you'], selectedId: string) {
  const data = JSON.stringify(stores.map((s) => ({ id: s.id, lat: s.latitude, lng: s.longitude, name: s.name })));
  const glasses =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6.5" cy="14" r="3.8"/><circle cx="17.5" cy="14" r="3.8"/><path d="M10.3 14c1-1 2.4-1 3.4 0M2.7 14 4 7.5h2M21.3 14 20 7.5h-2"/></svg>';

  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #map { margin: 0; height: 100%; background: #EEF0F0; }
  .pin { width: 40px; height: 40px; border-radius: 20px; background: ${Colors.ink}; color: ${Colors.teal};
    border: 3px solid #fff; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 14px rgba(0,0,0,.25); transition: transform .15s; }
  .pin.active { background: ${Colors.teal}; color: ${Colors.ink}; transform: scale(1.2); }
  .tip { width: 0; height: 0; margin: -2px auto 0; border-left: 7px solid transparent; border-right: 7px solid transparent;
    border-top: 9px solid ${Colors.ink}; }
  .active + .tip { border-top-color: ${Colors.teal}; }
  .you { width: 14px; height: 14px; border-radius: 7px; background: ${Colors.sky}; border: 3px solid #fff;
    box-shadow: 0 0 0 8px rgba(43,184,240,.25); }
  .leaflet-control-attribution { font-size: 9px; }
</style></head><body><div id="map"></div><script>
  var stores = ${data};
  var map = L.map('map', { zoomControl: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);

  L.marker([${you.latitude}, ${you.longitude}], {
    icon: L.divIcon({ className: '', html: '<div class="you"></div>', iconSize: [20, 20], iconAnchor: [10, 10] })
  }).addTo(map);

  var markers = {};
  function select(id) {
    Object.keys(markers).forEach(function (k) {
      var el = markers[k].getElement();
      if (el) el.querySelector('.pin').classList.toggle('active', k === id);
    });
  }
  stores.forEach(function (s) {
    var m = L.marker([s.lat, s.lng], {
      icon: L.divIcon({ className: '', html: '<div class="pin">${glasses}</div><div class="tip"></div>', iconSize: [40, 49], iconAnchor: [20, 49] })
    }).addTo(map);
    m.on('click', function () {
      select(s.id);
      map.panTo([s.lat, s.lng]);
      window.ReactNativeWebView.postMessage(s.id);
    });
    markers[s.id] = m;
  });

  // Frame the stores near you; far-away cities stay reachable by panning.
  var near = stores.filter(function (s) {
    return Math.abs(s.lat - ${you.latitude}) < 0.5 && Math.abs(s.lng - ${you.longitude}) < 0.5;
  });
  var pts = (near.length ? near : stores).map(function (s) { return [s.lat, s.lng]; });
  pts.push([${you.latitude}, ${you.longitude}]);
  map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
  select(${JSON.stringify(selectedId)});
</script></body></html>`;
}

export function StoreMap({ stores, you, selectedId, onSelect }: StoreMapProps) {
  // Built once per store list; later selections come from taps inside the map.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => buildHtml(stores, you, selectedId), [stores, you]);

  return (
    <WebView
      source={{ html, baseUrl: 'https://www.specsmakers.in/' }}
      originWhitelist={['*']}
      onMessage={(event) => onSelect(event.nativeEvent.data)}
      style={styles.map}
      setSupportMultipleWindows={false}
      javaScriptEnabled
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, backgroundColor: '#EEF0F0' },
});

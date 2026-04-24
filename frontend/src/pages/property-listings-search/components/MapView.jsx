import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useLanguage } from '../../../contexts/LanguageContext';

const MapView = ({ properties, selectedProperty, onPropertySelect }) => {
    const { language } = useLanguage();
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);
    const [libLoaded, setLibLoaded] = useState(false);
    const [geocodedData, setGeocodedData] = useState({});

    // Load Leaflet from CDN
    useEffect(() => {
        if (window.L) {
            setLibLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setLibLoaded(true);
        document.head.appendChild(script);

        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(style);
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!libLoaded || !mapRef.current || mapInstance.current) return;

        const L = window.L;
        // Gujarat Center
        const gujaratCenter = [22.2587, 71.1924];

        mapInstance.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView(gujaratCenter, 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(mapInstance.current);

        markersLayer.current = L.featureGroup().addTo(mapInstance.current);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [libLoaded]);

    // Geocoding Helper
    const geocode = useCallback(async (locationStr) => {
        if (geocodedData[locationStr]) return geocodedData[locationStr];

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationStr + ', Gujarat, India')}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                setGeocodedData(prev => ({ ...prev, [locationStr]: coords }));
                return coords;
            }
        } catch (e) {
            console.error('Geocoding error:', e);
        }
        return null;
    }, [geocodedData]);

    // Update Markers
    useEffect(() => {
        if (!libLoaded || !mapInstance.current || !markersLayer.current) return;
        const L = window.L;
        markersLayer.current.clearLayers();

        const updateMarkers = async () => {
            const bounds = L.latLngBounds();
            let hasMarkers = false;

            for (const prop of properties) {
                const address = `${prop.location_village || ''} ${prop.location_district || ''}`.trim();
                const coords = await geocode(address || 'Gujarat');

                if (coords) {
                    const isSelected = selectedProperty?.id === (prop.id || prop._id);

                    const markerIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 transition-all duration-300 hover:scale-125 ${isSelected ? 'bg-[#3b82f6] border-white text-white' : 'bg-white border-[#3b82f6] text-[#3b82f6]'}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                               </div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    });

                    const marker = L.marker(coords, { icon: markerIcon })
                        .on('click', () => onPropertySelect(prop));

                    markersLayer.current.addLayer(marker);
                    bounds.extend(coords);
                    hasMarkers = true;
                }
            }

            if (hasMarkers && properties.length > 0) {
                mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
            }
        };

        updateMarkers();
    }, [properties, libLoaded, geocode, onPropertySelect, selectedProperty]);

    // Sync selected property view
    useEffect(() => {
        if (selectedProperty && mapInstance.current && geocodedData) {
            const address = `${selectedProperty.location_village || ''} ${selectedProperty.location_district || ''}`.trim();
            const coords = geocodedData[address];
            if (coords) {
                mapInstance.current.setView(coords, 14, { animate: true });
            }
        }
    }, [selectedProperty, geocodedData]);

    return (
        <div className='relative w-full h-full bg-[#f8fafc] overflow-hidden group'>
            {/* Map Container */}
            <div ref={mapRef} className="w-full h-full z-0" />

            {!libLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-50">
                    <div className="flex flex-col items-center gap-3">
                        <Icon name="Loader2" className="animate-spin text-primary" size={32} />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Map...</p>
                    </div>
                </div>
            )}

            {/* Selected Property Popup (Overlay) */}
            {selectedProperty && (
                <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-40px)] max-w-sm pointer-events-none'>
                    <div className='bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300'>
                        <div className='flex gap-4'>
                            <div className='w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner'>
                                <Image
                                    src={selectedProperty.images?.[0] || "/assets/images/no_image.png"}
                                    className='w-full h-full object-cover'
                                    alt={selectedProperty.title}
                                />
                            </div>
                            <div className='flex-1 min-w-0 py-1'>
                                <div className="flex justify-between items-start">
                                    <h4 className='text-sm font-black text-slate-900 uppercase truncate mb-1'>{selectedProperty.title}</h4>
                                    <button
                                        onClick={() => onPropertySelect(null)}
                                        className="text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        <Icon name="X" size={14} />
                                    </button>
                                </div>
                                <p className='text-primary font-black text-xl mb-3'>₹{Number(selectedProperty.price).toLocaleString()}</p>
                                <Link to={'/property-detail-view?id=' + (selectedProperty.id || selectedProperty._id)}>
                                    <button className='w-full bg-slate-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg shadow-slate-200'>
                                        {language === 'en' ? 'VIEW FULL DETAILS' : 'સંપૂર્ણ વિગતો જુઓ'}
                                        <Icon name='ArrowRight' size={12} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Controls */}
            <div className='absolute top-6 right-6 flex flex-col gap-2 z-[900]'>
                <button
                    onClick={() => mapInstance.current?.zoomIn()}
                    className='w-11 h-11 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90 border border-slate-100'
                >
                    <Icon name='Plus' size={20} />
                </button>
                <button
                    onClick={() => mapInstance.current?.zoomOut()}
                    className='w-11 h-11 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90 border border-slate-100'
                >
                    <Icon name='Minus' size={20} />
                </button>
                <button
                    onClick={() => {
                        const gujaratCenter = [22.2587, 71.1924];
                        mapInstance.current?.setView(gujaratCenter, 7);
                    }}
                    className='w-11 h-11 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90 border border-slate-100'
                >
                    <Icon name='Navigation' size={20} />
                </button>
            </div>

            {/* Legend */}
            <div className='absolute top-6 left-6 bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl border border-border shadow-2xl z-[900]'>
                <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3'>Map Legend</p>
                <div className='flex items-center gap-3'>
                    <div className='w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/30 border-2 border-white' />
                    <span className='text-xs font-black text-slate-700 uppercase tracking-tight'>Available Land</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-div-icon { background: transparent; border: none; }
                .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; overflow: hidden; }
                .leaflet-popup-content { margin: 0; }
                .leaflet-container { font-family: inherit; }
            `}} />
        </div>
    );
};

export default MapView;

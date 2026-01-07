'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    am5: unknown;
    am5map: unknown;
    am5geodata_worldLow: unknown;
    am5themes_Animated: unknown;
  }
}

export default function LocationsSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<unknown>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only initialize map when section is visible
  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const initMap = () => {
      if (!mapRef.current) return;
      
      const am5 = window.am5 as {
        Root: { new: (id: string) => unknown };
        array: { each: (arr: unknown[], fn: (item: unknown) => void) => void };
        registry: { rootElements: unknown[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
      
      const am5map = window.am5map as {
        MapChart: { new: (root: unknown, settings: unknown) => unknown };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
      
      const am5geodata_worldLow = window.am5geodata_worldLow;
      const am5themes_Animated = window.am5themes_Animated as { new: (root: unknown) => unknown };

      if (!am5 || !am5map || !am5geodata_worldLow || !am5themes_Animated) {
        setTimeout(initMap, 200);
        return;
      }

      // Dispose existing root
      am5.array.each(am5.registry.rootElements, function(root: unknown) {
        const typedRoot = root as { dom?: { id?: string }; dispose: () => void };
        if (typedRoot.dom?.id === "worldmap") {
          typedRoot.dispose();
        }
      });

      try {
        const root = am5.Root.new("worldmap");
        rootRef.current = root;

        const typedRoot = root as {
          setThemes: (themes: unknown[]) => void;
          container: { children: { push: (item: unknown) => unknown } };
        };

        typedRoot.setThemes([am5themes_Animated.new(root)]);

        const chart = typedRoot.container.children.push(
          am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "translateY",
            wheelY: "zoom",
            projection: am5map.geoNaturalEarth1(),
            homeGeoPoint: { longitude: -20, latitude: 25 },
            homeZoomLevel: 1.2
          })
        ) as { 
          set: (key: string, value: unknown) => unknown;
          series: { push: (item: unknown) => unknown };
          appear: (duration: number, delay: number) => void;
        };

        // Add zoom control
        const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {
          x: am5.p100,
          centerX: am5.p100,
          y: am5.p100,
          centerY: am5.p100,
          marginRight: 20,
          marginBottom: 20
        })) as { homeButton: { set: (key: string, value: boolean) => void } };
        zoomControl.homeButton.set("visible", true);

        // Background for oceans
        const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {})) as {
          mapPolygons: { template: { setAll: (settings: unknown) => void } };
          data: { push: (item: unknown) => void };
        };
        backgroundSeries.mapPolygons.template.setAll({
          fill: am5.color(0xDCE8E8),
          stroke: am5.color(0xDCE8E8),
          strokeWidth: 0
        });
        backgroundSeries.data.push({
          geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

        // Countries
        const polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"]
          })
        ) as {
          mapPolygons: { 
            template: { 
              setAll: (settings: unknown) => void;
              states: { create: (name: string, settings: unknown) => void };
            };
          };
          data: { setAll: (items: unknown[]) => void };
        };

        polygonSeries.mapPolygons.template.setAll({
          fill: am5.color(0x3D8A99),
          stroke: am5.color(0xF7F7F4),
          strokeWidth: 1,
          tooltipText: "{name}",
          interactive: true,
          templateField: "polygonSettings"
        });

        polygonSeries.mapPolygons.template.states.create("hover", {
          fill: am5.color(0x2D6E7A)
        });
        
        // Highlight Canada and Egypt
        polygonSeries.data.setAll([
          { id: "CA", polygonSettings: { fill: am5.color(0x2D6E7A) } },
          { id: "EG", polygonSettings: { fill: am5.color(0x2D6E7A) } }
        ]);

        // Point markers
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        ) as {
          bullets: { push: (fn: () => unknown) => void };
          data: { setAll: (items: unknown[]) => void };
        };

        pointSeries.bullets.push(function() {
          const container = am5.Container.new(root, {});

          container.children.push(am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xD4AF37),
            stroke: am5.color(0xFFFFFF),
            strokeWidth: 2,
            tooltipText: "{name}"
          }));

          const circle2 = container.children.push(am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xD4AF37),
            opacity: 0.5
          })) as { animate: (settings: unknown) => void };

          circle2.animate({
            key: "scale",
            from: 1,
            to: 3,
            duration: 2000,
            easing: am5.ease.out(am5.ease.cubic),
            loops: Infinity
          });

          circle2.animate({
            key: "opacity",
            from: 0.5,
            to: 0,
            duration: 2000,
            easing: am5.ease.out(am5.ease.cubic),
            loops: Infinity
          });

          return am5.Bullet.new(root, { sprite: container });
        });

        pointSeries.data.setAll([
          { name: "Toronto 🇨🇦", geometry: { type: "Point", coordinates: [-79.3832, 43.6532] } },
          { name: "Cairo 🇪🇬", geometry: { type: "Point", coordinates: [31.2357, 30.0444] } }
        ]);

        chart.appear(1000, 100);

      } catch (error) {
        console.error("Map error:", error);
      }
    };

    // Delay initialization to allow scripts to load
    const timer = setTimeout(initMap, 500);

    return () => {
      clearTimeout(timer);
      if (rootRef.current) {
        (rootRef.current as { dispose: () => void }).dispose();
      }
    };
  }, [isVisible]);

  return (
    <section id="locations" className="section locations-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Global Presence</span>
          <h2 className="section-title">Where We Serve</h2>
          <div className="section-line"></div>
          <p className="section-description">Bridging communities across continents — Toronto 🇨🇦 & Cairo 🇪🇬</p>
        </div>
        <div id="worldmap" ref={mapRef} className="locations-map"></div>
      </div>
    </section>
  );
}


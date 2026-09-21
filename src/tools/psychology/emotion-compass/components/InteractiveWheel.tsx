"use client";

import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import * as d3 from "d3-hierarchy";
import { arc } from "d3-shape";
import { EmotionNode, emotionWheelData } from "../data/emotions";
import { translations } from "../data/translations";

interface InteractiveWheelProps {
  size?: number;
  selectedEmotions: string[];
  language?: string;
  onEmotionToggle: (emotion: string) => void;
}

function lightenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

export function InteractiveWheel({ size = 700, selectedEmotions, language = "en", onEmotionToggle }: InteractiveWheelProps) {
  const radius = size / 2;
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Rotation state
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const wheelGroupRef = useRef<SVGGElement>(null);
  const isDragging = useRef(false);
  const pointerIsDown = useRef(false);
  const lastAngle = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const root = useMemo(() => {
    const hierarchy = d3.hierarchy<EmotionNode>(emotionWheelData)
      .sum(d => (d.children && d.children.length > 0 ? 0 : 1));
    return d3.partition<EmotionNode>().size([2 * Math.PI, radius])(hierarchy);
  }, [radius]);

  // Reduced central space to make it compact
  const mapRadius = useCallback((y: number): number => {
    const normalized = y / radius;
    if (normalized === 0) return 0;
    // Start at 8% (small center hole) to 100%
    const mapped = 0.08 + (normalized * 0.92);
    return mapped * radius;
  }, [radius]);

  const arcGenerator = useMemo(() => {
    return arc<d3.HierarchyRectangularNode<EmotionNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => (d.depth === 0 ? 0 : mapRadius(d.y0) - (size * 0.05)))
      .outerRadius(d => mapRadius(d.y1) - (size * 0.05))
      .padAngle(0.003)
      .padRadius(radius / 2);
  }, [radius, mapRadius, size]);

  const getColor = useCallback((node: d3.HierarchyRectangularNode<EmotionNode>) => {
    if (node.depth === 0) return "transparent";
    let ancestor = node;
    while (ancestor.depth > 1 && ancestor.parent) {
      ancestor = ancestor.parent;
    }
    const baseColor = ancestor.data.color || "#94a3b8";

    if (node.depth === 1) return baseColor;
    if (node.depth === 2) return lightenHex(baseColor, 0.2);
    return lightenHex(baseColor, 0.40);
  }, []);

  const descriptionMap = useMemo(() => {
    const map = new Map<string, string>();
    const traverse = (node: EmotionNode) => {
      if (node.name && node.description) {
        map.set(node.name, node.description);
      }
      if (node.children) node.children.forEach(traverse);
    };
    traverse(emotionWheelData);
    return map;
  }, []);

  // Helper to get translated name and description
  const getTranslation = useCallback((enName: string) => {
    if (language === "en" || !translations[enName] || !translations[enName][language]) {
      return { name: enName, description: descriptionMap.get(enName) || "" };
    }
    const t = translations[enName][language];
    return { name: t.name || enName, description: t.description || descriptionMap.get(enName) || "" };
  }, [language, descriptionMap]);

  // --- Drag to rotate logic ---
  const getAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = clientX - centerX;
    const y = clientY - centerY;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerIsDown.current = true;
    isDragging.current = false; // Reset drag state on touch/click start
    lastAngle.current = getAngle(e.clientX, e.clientY);
    rotationRef.current = rotation;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerIsDown.current) return;
    
    const currentAngle = getAngle(e.clientX, e.clientY);
    let delta = currentAngle - lastAngle.current;
    
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Set dragging true only if moved significantly (avoid blocking simple taps)
    if (Math.abs(delta) > 0.5) {
      isDragging.current = true;
    }
    
    if (!isDragging.current) return;
    
    rotationRef.current += delta;
    if (wheelGroupRef.current) {
      // Direct DOM manipulation to bypass React render loop for 60fps performance on mobile
      wheelGroupRef.current.style.transform = `translate(${radius}px, ${radius}px) rotate(${rotationRef.current}deg)`;
    }
    lastAngle.current = currentAngle;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointerIsDown.current = false;
    // Commit the rotation to state to re-evaluate text uprightness on drag end
    if (isDragging.current) {
      setRotation(rotationRef.current);
    }
    // We do NOT reset isDragging.current here yet.
    // It stays true so that the onClick event knows a drag just occurred.
  };

  return (
    <div className="w-full relative flex items-center justify-start overflow-hidden h-[200vw] sm:h-auto sm:aspect-square max-h-[800px]">
      {/* 
        On mobile, the container height is 200vw to fit the 200vw diameter wheel without severe clipping.
        The wheel is 200vw width, pushed left by 100vw (-left-[100vw]).
        This displays the perfect right-half of the wheel.
      */}
      <div className="absolute w-[200vw] h-[200vw] -left-[100vw] sm:relative sm:w-full sm:h-full sm:left-0 sm:max-w-[800px] flex-shrink-0">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full h-auto select-none outline-none cursor-grab active:cursor-grabbing"
          aria-label="Feelings Wheel"
          style={{ overflow: "visible", pointerEvents: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Rotate the entire wheel based on the drag state */}
          <g 
            ref={wheelGroupRef}
            transform={`translate(${radius},${radius}) rotate(${rotation})`}
            style={{ pointerEvents: "auto", touchAction: "none" }}
          >
            {root.descendants().filter(d => d.depth > 0).map((node, i) => {
              const isSelected = selectedEmotions.includes(node.data.name);
              const isHovered = hoveredNode === node.data.name && !isDragging.current;
              const pathData = arcGenerator(node);
              if (!pathData) return null;

              const [cx, cy] = arcGenerator.centroid(node);

              // Text rotation logic (keeps text readable relative to its own angle, 
              // but doesn't automatically right itself during rotation to avoid jerky updates)
              // Calculate text rotation keeping it upright relative to the screen
              const angleDeg = ((node.x0 + node.x1) / 2) * (180 / Math.PI);
              
              // absolute rotation on screen = angle + global rotation
              let absRot = (angleDeg - 90 + rotation) % 360;
              if (absRot > 180) absRot -= 360;
              if (absRot < -180) absRot += 360;

              let textRotate = angleDeg - 90;
              // If the absolute rotation makes it upside down, flip it 180 degrees
              if (absRot > 90 || absRot < -90) {
                textRotate += 180;
              }

              const baseColor = getColor(node);
              const fill = isSelected ? "#6366f1" : baseColor;
              const { name: translatedName, description } = getTranslation(node.data.name);

              const fontSize = node.depth === 1 ? 16 : node.depth === 2 ? 11 : 9;
              const fontWeight = node.depth === 1 ? 600 : 400;

              return (
                <g
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={translatedName}
                  aria-pressed={isSelected}
                  onClick={(e) => {
                    if (isDragging.current === false) {
                      onEmotionToggle(node.data.name);
                    }
                  }}
                  onMouseEnter={() => setHoveredNode(node.data.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEmotionToggle(node.data.name); } }}
                >
                  <path
                    d={pathData}
                    fill={fill}
                    stroke="white"
                    strokeWidth={isHovered || isSelected ? 2.5 : 1}
                    style={{
                      transition: isDragging.current ? "none" : "fill 0.25s ease, stroke-width 0.2s ease, opacity 0.2s ease, transform 0.15s ease",
                      opacity: isSelected ? 1 : isHovered ? 1 : 0.92,
                      filter: isSelected
                        ? "brightness(1.05) drop-shadow(0 2px 6px rgba(99, 102, 241, 0.5))"
                        : isHovered
                          ? "brightness(1.08)"
                          : "none",
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: isHovered ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    <title>{description || translatedName}</title>
                  </path>
                  <text
                    transform={`translate(${cx},${cy}) rotate(${textRotate})`}
                    dy=".35em"
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    fill={isSelected ? "#fff" : "#1e293b"}
                    className="pointer-events-none select-none"
                    style={{
                      textShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                      transition: "fill 0.2s ease",
                    }}
                  >
                    {translatedName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';

const ATTRIBUTE_KEYS = [
  'STRENGTH',
  'ENDURANCE',
  'DISCIPLINE',
  'FOCUS',
  'INTELLIGENCE',
  'AGILITY',
] as const;

const LABELS = ['STR', 'END', 'DIS', 'FOC', 'INT', 'AGI'];

/** Vertex index for INTELLIGENCE (replaced with image). */
const INTELLIGENCE_VERTEX = ATTRIBUTE_KEYS.indexOf('INTELLIGENCE');

const INTELLIGENCE_ICON = require('../assets/images/intelligence_icon.png');
const INTELLIGENCE_ICON_SIZE = 32;
const INTELLIGENCE_ICON_HALF = INTELLIGENCE_ICON_SIZE / 2;

type Attributes = Record<(typeof ATTRIBUTE_KEYS)[number], number>;

type Props = {
  attributes: Attributes;
  level: number;
  size?: number;
};

function angleForIndex(index: number, count: number) {
  return -Math.PI / 2 + (2 * Math.PI * index) / count;
}

export default function AttributeRadarChart({
  attributes,
  level,
  size = 260,
}: Props) {
  const maxStat = level * 5 + 5;
  const n = ATTRIBUTE_KEYS.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.32;
  const labelRadius = size * 0.4;

  const gridRings = [0.33, 0.66, 1];

  const { polygonPoints, axisLines, labelPositions } = useMemo(() => {
    const pts: string[] = [];
    const labels: { x: number; y: number; text: string }[] = [];

    for (let i = 0; i < n; i++) {
      const angle = angleForIndex(i, n);
      const raw = attributes[ATTRIBUTE_KEYS[i]] ?? 0;
      const t = maxStat > 0 ? Math.min(1, raw / maxStat) : 0;
      const r = t * maxRadius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      pts.push(`${x},${y}`);

      const lx = cx + labelRadius * Math.cos(angle);
      const ly = cy + labelRadius * Math.sin(angle);
      labels.push({ x: lx, y: ly, text: LABELS[i] });
    }

    const axes = Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i, n);
      const x2 = cx + maxRadius * Math.cos(angle);
      const y2 = cy + maxRadius * Math.sin(angle);
      return { x2, y2 };
    });

    return {
      polygonPoints: pts.join(' '),
      axisLines: axes,
      labelPositions: labels,
    };
  }, [attributes, maxStat, maxRadius, cx, cy, n, labelRadius]);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {gridRings.map((scale, idx) => {
          const ringPts = Array.from({ length: n }, (_, i) => {
            const angle = angleForIndex(i, n);
            const r = maxRadius * scale;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');
          return (
            <Polygon
              key={`grid-${idx}`}
              points={ringPts}
              fill="none"
              stroke="#374151"
              strokeWidth={1}
            />
          );
        })}

        {axisLines.map((line, i) => (
          <Line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={line.x2}
            y2={line.y2}
            stroke="#374151"
            strokeWidth={1}
          />
        ))}

        <Polygon
          points={polygonPoints}
          fill="rgba(250, 204, 21, 0.35)"
          stroke="#facc15"
          strokeWidth={2}
        />
      </Svg>

      {/* RN Text/Image: avoids react-native-svg Text + matches Expo Go native svg. */}
      {labelPositions.map((lp, i) =>
        i === INTELLIGENCE_VERTEX ? (
          <Image
            key={`lbl-${i}`}
            source={INTELLIGENCE_ICON}
            style={[
              styles.intelligenceIcon,
              {
                left: lp.x - INTELLIGENCE_ICON_HALF,
                top: lp.y - INTELLIGENCE_ICON_HALF,
              },
            ]}
            resizeMode="contain"
          />
        ) : (
          <Text
            key={`lbl-${i}`}
            style={[
              styles.label,
              {
                left: lp.x - LABEL_HALF_W,
                top: lp.y - LABEL_HALF_H,
              },
            ]}
          >
            {lp.text}
          </Text>
        )
      )}
    </View>
  );
}

const LABEL_HALF_W = 16;
const LABEL_HALF_H = 8;

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignSelf: 'center',
  },
  label: {
    position: 'absolute',
    width: 32,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
  },
  intelligenceIcon: {
    position: 'absolute',
    width: INTELLIGENCE_ICON_SIZE,
    height: INTELLIGENCE_ICON_SIZE,
  },
});

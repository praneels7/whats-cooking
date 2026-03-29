import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../theme/colors';

export default function CircularProgress({ size = 130, strokeWidth = 12, progress = 0, color = COLORS.primary }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

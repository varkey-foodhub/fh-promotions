// src/components/ui/JaggedEdge.tsx
import React from "react";
import { Platform, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface JaggedEdgeProps {
  width: number;
  color: string; // pass the receipt background color
}

const JaggedEdge = ({ width, color }: JaggedEdgeProps) => {
  const toothWidth = 20;
  const toothHeight = 10;
  const numberOfTeeth = Math.ceil(width / toothWidth);
  const totalWidth = numberOfTeeth * toothWidth;

  // SVG path — zigzags downward
  let d = `M0,0`;
  for (let i = 0; i < numberOfTeeth; i++) {
    const x1 = i * toothWidth + toothWidth / 2;
    const x2 = (i + 1) * toothWidth;
    d += ` L${x1},${toothHeight} L${x2},0`;
  }
  d += ` L${totalWidth},0 Z`;

  if (Platform.OS !== "web") {
    // Native — rotated box trick
    return (
      <View
        style={{
          flexDirection: "row",
          height: toothHeight,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: numberOfTeeth }).map((_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              backgroundColor: color,
              width: toothWidth / Math.SQRT2,
              height: toothWidth / Math.SQRT2,
              left: i * toothWidth - toothWidth / 2,
              top: -10,
              transform: [{ rotate: "45deg" }],
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <Svg width={totalWidth} height={toothHeight}>
      <Path d={d} fill={color} />
    </Svg>
  );
};

export default JaggedEdge;

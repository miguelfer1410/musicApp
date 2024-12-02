import React from 'react';
import { Text, TextStyle } from 'react-native';

interface SubTextProps {
  text: string;
  size?: number;
  color?: string;
  family?: string;
  letterSpacing?: number;
  align?: TextStyle['textAlign'];
  leading?: number;
  borderWidth?: number;
  borderColor?: string;
}

const SubText: React.FC<SubTextProps> = ({
  text,
  size = 14, // Valor padrão
  color = '#000', // Valor padrão
  family,
  letterSpacing = -0.02, // Valor padrão
  align = 'left', // Valor padrão
  leading,
  borderWidth,
  borderColor,
}) => {
  return (
    <Text
      style={{
        fontSize: size,
        color: color,
        fontFamily: family,
        letterSpacing: letterSpacing,
        textAlign: align,
        lineHeight: leading,
        borderWidth: borderWidth,
        borderColor: borderColor,
      }}
    >
      {text}
    </Text>
  );
};

export default SubText;

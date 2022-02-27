import {
  PixelRatio,
  Dimensions,
  Platform
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const width_base = SCREEN_WIDTH / 360;

export const scale = (size) => {
  const newSize = size * width_base;
  if (!newSize) return size;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};

export const scaleFont = (size) => {
  const newSize = size * width_base;
  if (!newSize) return size;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize) - 2);
  }
};
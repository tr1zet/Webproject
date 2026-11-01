export type RGBColor = [number, number, number];

export enum ColorName {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}

const colors: Record<ColorName, RGBColor> = {
  [ColorName.Red]: [255, 0, 0],
  [ColorName.Green]: [0, 128, 0],
  [ColorName.Blue]: [0, 0, 255]
};

function validateChannel(channel: number): void {
  if (!Number.isInteger(channel) || channel < 0 || channel > 255) {
    throw new RangeError(`Канал RGB должен быть целым числом от 0 до 255: ${channel}`);
  }
}

export function rgbToHex(color: RGBColor): string {
  color.forEach(validateChannel);
  return `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function getColorInfo(name: ColorName): { rgb: RGBColor; hex: string } {
  const rgb: RGBColor = [...colors[name]];
  return { rgb, hex: rgbToHex(rgb) };
}

for (const name of Object.values(ColorName)) {
  console.log(name, getColorInfo(name));
}

try {
  console.log(rgbToHex([255, -1, 300]));
} catch (error: unknown) {
  if (error instanceof RangeError) {
    console.log('Ожидаемая ошибка RGB:', error.message);
  }
}

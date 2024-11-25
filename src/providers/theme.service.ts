interface rgb {
  r: number,
  g: number,
  b: number
}

interface hsl {
  h: number,
  s: number,
  l: number
}

export class Theme {

  public static setCharityColors(charity) {
    if (!charity) {
      return;
    }

    const primaryTextRgb = this.hexColorStringToRgb(charity.details.onlineCollecterenPrimaryTextColor);
    this.setRgbCssProperty('--primary-text', primaryTextRgb);

    const secondaryTextRgb = this.hexColorStringToRgb(charity.details.onlineCollecterenSecondaryTextColor);
    this.setRgbCssProperty('--secondary-text', secondaryTextRgb);

    const primaryColorHsl = this.hexColorStringToHsl(charity.details.onlineCollecterenPrimaryColor);
    this.setHslCssProperty('--primary', primaryColorHsl);

    const secondaryColorHsl = this.hexColorStringToHsl(charity.details.onlineCollecterenSecondaryColor);
    this.setHslCssProperty('--secondary', secondaryColorHsl);

    const primaryTextIsBlack = (
      primaryTextRgb.r === 0 &&
      primaryTextRgb.g === 0 &&
      primaryTextRgb.b === 0
    );
    const monoBg = primaryTextIsBlack ?  '#ffffff':'#000000';
    this.setCssProperty('--monochrome-background', monoBg);

  }

  private static setCssProperty(property: string, value: string) {
    document.documentElement.style.setProperty(property, value);
  }

  private static setRgbCssProperty(property: string, value: rgb) {
    const rgbStr = `${value.r},${value.g},${value.b}`;
    this.setCssProperty(property, rgbStr);
  }

  private static setHslCssProperty(property: string, input: hsl) {
    document.documentElement.style.setProperty(`${property}-h`, `${input.h}`);
    document.documentElement.style.setProperty(`${property}-s`, `${input.s}%`);
    document.documentElement.style.setProperty(`${property}-l`, `${input.l}%`);
  }

  private static parseHslString(input: string) {
    const valuesStr = input.substring(4, input.length - 1);
    return valuesStr.split(',');
  }

  private static hexColorStringToRgb(hex: string): rgb {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private static hexColorStringToHsl(hex: string): hsl {

    // Convert hex to RGB first
    let {r, g, b} = this.hexColorStringToRgb(hex);

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
      h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
      h, s, l
    };
  }

}

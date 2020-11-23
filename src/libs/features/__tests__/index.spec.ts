import {
  popSlash,
  relativeUrl,
  regexpEscape,
  filterPhone,
  stringReplace,
  addTime,
  getMemoizedFn,
  shuffleArr,
  getThrottle,
  getDOM,
  getScrollbarWidth,
  getScrollbarHeight,
} from '../index';

describe('popSlash', () => {
  it('should return url without slash on the end', () => {
    const trailed = 'https://example.com/';
    const untrailed = 'https://example.com';
    expect(popSlash(trailed)).toBe(untrailed);
    expect(popSlash(untrailed)).toBe(untrailed);
  });
});

describe('relativeUrl', () => {
  it('should convert any url to relative url without trailing slash', () => {
    const absolute = 'https://example.com/path/to/the/page';
    const relative = '/path/to/the/page';
    expect(relativeUrl(absolute)).toBe(relative);
    expect(relativeUrl(relative)).toBe(relative);
  });
});

describe('regexpEscape', () => {
  it('should escape following symbols: . * + \\ - ? ^ $ { } ( ) | [ ]', () => {
    expect(regexpEscape('.')).toBe('\\.');
    expect(regexpEscape('*')).toBe('\\*');
    expect(regexpEscape('\\')).toBe('\\\\');
    expect(regexpEscape('-')).toBe('\\-');
    expect(regexpEscape('?')).toBe('\\?');
    expect(regexpEscape('^')).toBe('\\^');
    expect(regexpEscape('$')).toBe('\\$');
    expect(regexpEscape('{')).toBe('\\{');
    expect(regexpEscape('}')).toBe('\\}');
    expect(regexpEscape('(')).toBe('\\(');
    expect(regexpEscape(')')).toBe('\\)');
    expect(regexpEscape('[')).toBe('\\[');
    expect(regexpEscape(']')).toBe('\\]');
  });
});

describe('filterPhone', () => {
  it('should return raw phone number', () => {
    const phone = '+38 (012) 345-6789';
    const filtered = '380123456789';
    expect(filterPhone(phone, '38')).toBe(filtered);
  });
});

describe('stringReplace', () => {
  it('should search all keys of passed object and replace them with respective values', () => {
    const string = 'The quick brown fox jumped to snow';
    const search = {
      quick: 'slow',
      brown: 'black',
      fox: 'dog',
    };
    const result = 'The slow black dog jumped to snow';
    expect(stringReplace(string, search)).toBe(result);
  });
});

describe('addTime', () => {
  it('should add time strings (HH:MM, HH:MM:SS) together, returning string with seconds only if one of passed strings has seconds', () => {
    expect(addTime('1:25', '02:45')).toBe('04:10');
    expect(addTime('1:30:30', '01:50:00', '02:45', '1:10')).toBe('07:15:30');
    expect(addTime('2:30:30', '03:29:30')).toBe('06:00:00');
  });
});

describe('getMemoizedFn', () => {
  it('should return function that returns same result for same parameters', () => {
    let value;
    const memoizedFn = getMemoizedFn((description) => {
      value = Symbol(description);
      return value;
    });
    memoizedFn('unique');
    expect(memoizedFn('unique')).toBe(value);
  });
});

describe('shuffleArr', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.99);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should randomly shuffle passed array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleArr(arr)).toEqual(arr);
  });
});

describe('getThrottle', () => {
  it('should return a function that would call the callback with passed parameters within set `time` after last call was made to the function', () => {
    const callback = jest.fn((a: number, b: number) => a + b);
    const time = 15;
    const throttling = getThrottle(callback, time);

    const testStart = performance.now();
    const testPeriod = 100;
    const test = () => {
      throttling(3, 5);
      if (performance.now() - testStart < testPeriod) requestAnimationFrame(() => test());
    };
    test();

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(3, 5);
    }, time);
  });

  test('If passed `maxDelay` returned function should make calls to the callback with at least `maxDelay` frequency', () => {
    const callback = jest.fn((a: number, b: number, c: number) => a + b + c);
    const time = 15;
    const maxDelay = 30;
    const throttling = getThrottle(callback, time, maxDelay);

    const testStart = performance.now();
    const testPeriod = 100;
    const test = () => {
      throttling(1, 2, 3);
      if (performance.now() - testStart < testPeriod) requestAnimationFrame(() => test());
    };
    test();

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith(1, 2, 3);
    }, time);
  });
});

describe('getDOM', () => {
  it('should convert html string to equal array of elements', () => {
    const html = '<div class="block"></div><div class="block"></div>';
    const elements = getDOM(html);
    const block = document.createElement('div');
    elements.forEach((element) => block.appendChild(element));
    expect(block.innerHTML).toEqual(html);
  });
});

describe('getScrollbarWidth', () => {
  it('should return difference of window width and body client width', () => {
    expect(getScrollbarWidth()).toBe(window.innerWidth - document.body.clientWidth);
  });
});

describe('getScrollbarHeight', () => {
  it('should return difference of window height and body client height', () => {
    expect(getScrollbarHeight()).toBe(window.innerHeight - document.body.clientWidth);
  });
});

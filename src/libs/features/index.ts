// Remove trailing slash from the end of an url if needed
export const popSlash = (url: string) =>
  url[url.length - 1] === '/' ? url.slice(0, -1) : url;

// Get relative url from absolute url
export const relativeUrl = (url: string): string => {
  const regexp: RegExp = /^(https?:\/\/)?[^\/]+/;
  return popSlash(url.replace(regexp, ''));
};

// Escape string to use it in a regular expression
export const regexpEscape = (string: string): string =>
  string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

// Filter phone from all symbols and whitespaces, adding `countryCode` if needed
export const filterPhone = (phone: string, countryCode = '38'): string => {
  const regexp: RegExp = new RegExp(
    '(^\\s*\\+?\\s*(' + regexpEscape(countryCode) + '))?[^0-9]*',
    'g'
  );
  return countryCode + phone.replace(regexp, '');
};

// Replace string with `key: value` entries of the search object.
export const stringReplace = (string: string, search: { [key: string]: string }): string => {
  const regexp = new RegExp(
    Object.keys(search)
      .map((item) => regexpEscape(item))
      .join('|'),
    'g'
  );
  return string.replace(regexp, (match) => search[match]);
};

// Function for adding up time of format HH:MM or HH:MM:SS
export const addTime = (...time: string[]): string => {
  let operands = time.reduce(
    (acc, item) => (item.split(':').length > acc ? item.split(':').length : acc),
    0
  );
  let sum = Array(operands)
    .fill(0)
    .map((_, i) => time.reduce((acc, _, j) => acc + Number(time[j].split(':')[i] || 0), 0));
  for (let i = operands - 2; i >= 0; i--) {
    sum[i] += Math.floor(sum[i + 1] / 60);
    sum[i + 1] %= 60;
  }
  return sum.map((item) => (item < 10 ? '0' + item : item)).join(':');
};

// Get memoized function from regular function for better performance of the function
export const getMemoizedFn = (fn: (...args: any) => any) => {
  const cache: {
    [key: string]: any;
  } = {};
  return (...args: any) => {
    const key = JSON.stringify(args);
    return cache[key] || (cache[key] = fn(...args));
  };
};

// Get randomly shuffled array
export const shuffleArr = (array: any[]): any[] => {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[randIndex]] = [arr[randIndex], arr[i]];
  }
  return arr;
};

// Get throttling function for reducing requests frequency
export const getThrottle = (
  callback: (...parameters: any[]) => unknown,
  time: number,
  maxDelay?: number
): ((...parameters: any[]) => any) => {
  let timeout: NodeJS.Timeout = null;
  let lastCall: number = null;
  const call = (...parameters: any[]) => {
    lastCall = null;
    callback(...parameters);
  };
  return (...parameters: any[]) => {
    if (!lastCall) lastCall = performance.now();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (maxDelay && performance.now() - lastCall >= maxDelay) call(...parameters);
    else timeout = setTimeout(() => call(...parameters), time);
  };
};

// Uses `callback` when user is scrolling within set `distance` with `scrollPercent` argument that represents percent of scrolled `distance`.
// `distance` - is either array [start, end] or function that returns such array
export const onScroll = (function () {
  let scrollTop = window.pageYOffset;
  let pageHeight = document.body.scrollHeight;

  window.addEventListener('scroll', () => (scrollTop = window.pageYOffset));
  window.addEventListener('resize', () => (pageHeight = document.body.scrollHeight));

  return (
    distance: [number, number] | (() => [number, number]),
    callback: (scrollPercent: number) => any
  ) => {
    let lastRendered: number = null;

    const animation = () => {
      let start, end;
      if (distance instanceof Function) [start, end] = distance();
      else [start, end] = distance;

      start = Math.max(start, 0);
      end = Math.min(end, pageHeight);

      let scrollPercent;
      if (scrollTop < start) scrollPercent = 0;
      else if (scrollTop > end) scrollPercent = 1;
      else scrollPercent = (scrollTop - start) / (end - start);

      if (lastRendered !== scrollPercent) {
        lastRendered = scrollPercent;
        callback(scrollPercent);
      }
    };
    animation();
    window.addEventListener('load', animation);
    window.addEventListener('scroll', animation);
  };
})();

// Uses `callback` when element passed by `selector` is within user's viewport with `scrollPercent` argument that represents percent of scrolled distance.
export const onViewportEnter = (function () {
  let windowHeight = window.innerHeight;

  window.addEventListener('resize', () => (windowHeight = window.innerHeight));

  return (selector: string, callback: (scrollPercent: number, element: Element) => any) => {
    Array.from(document.querySelectorAll(selector)).forEach((element) => {
      const boundingRect = element.getBoundingClientRect();
      let viewportStart = boundingRect.top - windowHeight;
      let viewportEnd = viewportStart + boundingRect.height + windowHeight;

      window.addEventListener('resize', () => {
        const boundingRect = element.getBoundingClientRect();
        viewportStart = boundingRect.height - windowHeight;
        viewportEnd = viewportStart + boundingRect.height + windowHeight;
      });

      onScroll(
        () => [viewportStart, viewportEnd],
        (scrollPercent) => callback(scrollPercent, element)
      );
    });
  };
})();

// Simple on swipe event handler based on PointerEvents
export const onSwipe = (
  element: HTMLElement,
  callback: (e: TouchEvent, direction: 'left' | 'right' | 'up' | 'down') => any
) => {
  const opts = {
    startX: 0,
    startY: 0,
    swipeLength: 50,
  };
  const onTouchStart = (e: TouchEvent) => {
    const { clientX, clientY } = e.changedTouches[0];
    opts.startX = clientX;
    opts.startY = clientY;
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchmove', onTouchMove);
  };
  const onTouchMove = (e: TouchEvent) => {
    const { startX, startY, swipeLength } = opts;
    const { clientX, clientY } = e.changedTouches[0];
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    if (deltaX >= swipeLength) callback(e, 'right');
    if (deltaX <= -swipeLength) callback(e, 'left');
    if (deltaY >= swipeLength) callback(e, 'down');
    if (deltaY <= -swipeLength) callback(e, 'up');
    if (Math.abs(deltaX) >= swipeLength || Math.abs(deltaY) >= swipeLength) {
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchmove', onTouchMove);
    }
  };
  const onTouchEnd = () => {
    element.removeEventListener('touchend', onTouchEnd);
    element.removeEventListener('touchmove', onTouchMove);
  };
  element.addEventListener('touchstart', onTouchStart);
};

// Get array of DOM elements from html string
export const getDOM = (html: string): Element[] => {
  const block = document.createElement('div');
  block.innerHTML = html;
  return Array.from(block.children);
};

// Get vertical scrollbar width
export const getScrollbarWidth = () => window.innerWidth - document.body.clientWidth;

// Get horizontal scrollbar height
export const getScrollbarHeight = () => window.innerHeight - document.body.clientHeight;

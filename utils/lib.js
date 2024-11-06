import moment from 'moment';
export const isBrowser = () => typeof window !== 'undefined';

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const convertStringToBoolean = (obj) => {
  Object.keys(obj).forEach(function (key) {
    if (obj[key] === '1') {
      obj[key] = true;
    } else if (obj[key] === '0') {
      obj[key] = false;
    }
  });
  return obj;
};

export const getMonthNumber = (monthName) => {
  const parsedDate = moment(monthName, 'MMMM', true);
  if (!parsedDate.isValid()) {
    throw new Error('Invalid month name');
  }
  return parsedDate.month() + 1;
};

export function countNestedLevels(arr, propertyName) {
  let maxLevels = 0;

  function findNestedLevels(obj, currentLevel) {
    if (
      obj.hasOwnProperty(propertyName) &&
      Array.isArray(obj[propertyName]) &&
      obj[propertyName].length > 0
    ) {
      for (const item of obj[propertyName]) {
        const levels = findNestedLevels(item, currentLevel + 1);
        maxLevels = Math.max(maxLevels, levels);
      }
    }
    return currentLevel;
  }

  for (const item of arr) {
    const levels = findNestedLevels(item, 1);
    maxLevels = Math.max(maxLevels, levels);
  }

  return maxLevels;
}

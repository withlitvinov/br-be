import * as dayjs from 'dayjs';
import * as customFormat from 'dayjs/plugin/customParseFormat';
import * as tz from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(customFormat);
dayjs.extend(utc);
dayjs.extend(tz);

const setGlobalTz = (tz: string) => {
  dayjs.tz.setDefault(tz);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Global time zone applied: ${tz}`);
  }
};

const resetTime = (date: dayjs.Dayjs) => {
  let _date = date.clone();

  _date = _date.hour(0);
  _date = _date.minute(0);
  _date = _date.second(0);
  _date = _date.millisecond(0);

  return _date;
};

const now = (tz?: string) => {
  return dayjs().tz(tz);
};

const getTime = (date?: dayjs.Dayjs | Date, tz?: string) => {
  return dayjs(date).tz(tz);
};

const getDate = (date?: dayjs.Dayjs | Date, tz?: string) => {
  return getTime(date, tz);
};

export { dayjs, setGlobalTz, now, getTime, getDate, resetTime };

import { Validator } from '../../hooks/useValidation';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../../models/validation';
import { DateValidationError } from '../../../models';
import { applyDefaultDate } from '../date-utils';

export interface DateComponentValidationProps<TDate>
  extends DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

export const validateDate: Validator<
  any | null,
  any,
  DateValidationError,
  DateComponentValidationProps<any>
> = ({ props, value, adapter }): DateValidationError => {
  if (value === null) {
    return null;
  }

  const now = adapter.utils.date()!;
  const minDate = applyDefaultDate(adapter.utils, props.minDate, adapter.defaultDates.minDate);
  const maxDate = applyDefaultDate(adapter.utils, props.maxDate, adapter.defaultDates.maxDate);

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(props.shouldDisableDate && props.shouldDisableDate(value)):
      return 'shouldDisableDate';

    case Boolean(props.shouldDisableMonth && props.shouldDisableMonth(value)):
      return 'shouldDisableMonth';

    case Boolean(props.shouldDisableYear && props.shouldDisableYear(value)):
      return 'shouldDisableYear';

    case Boolean(props.disableFuture && adapter.utils.isAfterDay(value, now)):
      return 'disableFuture';

    case Boolean(props.disablePast && adapter.utils.isBeforeDay(value, now)):
      return 'disablePast';

    case Boolean(minDate && adapter.utils.isBeforeDay(value, minDate)):
      return 'minDate';

    case Boolean(maxDate && adapter.utils.isAfterDay(value, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};
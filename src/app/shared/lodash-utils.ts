import * as _ from 'lodash';

export const _assign = _.assign;
export const _clone = _.clone;
export const _debounce = _.debounce;
export const _difference = _.difference;
export const _differenceBy = _.differenceBy;
export const _flatten = _.flatten;
export const _intersectionBy = _.intersectionBy;
export const _isEmpty = _.isEmpty;
export const _isEqual = _.isEqual;
export const _isNil = _.isNil;
export const _isNumber = _.isNumber;
export const _isString = _.isString;
export const _minBy = _.minBy;
export const _union = _.union;
export const _unionBy = _.unionBy;
export const _uniq = _.uniq;
export const _uniqBy = _.uniqBy;
export const _merge = _.merge;
export const _orderBy = _.orderBy;
export const _cloneDeep = _.cloneDeep;
export const _isNilOrEmpty = (item: any) => {
	if (_isNil(item)) {
		return true;
	}
	if (_isNumber(item)) {
		console.error(
			"Don't use this function for numbers! _isNilOrEmpty -> ",
			item
		);
	}
	if (_isEmpty(item)) {
		return true;
	}
	return false;
};
export const _isNilOrZero = (nr: number) => {
	if (_isNil(nr)) {
		return true;
	}
	if (_isNumber(nr) === false) {
		console.error(
			'Use this function only for numbers! _isNilOrZero -> ',
			nr
		);
	}
	if (nr === 0) {
		return true;
	}
	return false;
};

export const _hasOnlyDigits = (num: any) => {
	if (num.match(/^-?\d+$/)) {
		return true;
	} else if (num.match(/^\d+\.\d+$/)) {
		return true;
	} else {
		return false;
	}
}

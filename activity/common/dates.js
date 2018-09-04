var sd = new Date();
var sYear = sd.getFullYear();
var sMonth = sd.getMonth() + 1;
var sDay = sd.getDate();
var startDateFinal = sYear + '.' + sMonth + '.' + sDay;

var ed = new Date();
ed.setDate(ed.getDate() + 1);
var eYear = ed.getFullYear();
var eMonth = ed.getMonth() + 1;
var eDay = ed.getDate();
var endDateFinal = eYear + '.' + eMonth + '.' + eDay;

exports.startDate = startDateFinal;
exports.endDate = endDateFinal;

exports.sYear = sYear;
exports.sMonth = sMonth;
exports.sDay = sDay;


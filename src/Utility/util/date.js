let hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
let bulan = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const convertDate = date => {
  let tanggal = date.getDate();
  let _hari = hari[date.getDay()];
  let _bulan = bulan[date.getMonth()];
  let _tahun = date.getYear();
  let tahun = _tahun < 1000 ? _tahun + 1900 : _tahun;
  return `${_hari}, ${tanggal} ${_bulan} ${tahun}`;
};

function addZero(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export const convertTime = date => {
  let tanggal = date.getDate();
  let _hari = hari[date.getDay()];
  let _bulan = bulan[date.getMonth()];
  let _tahun = date.getYear();
  let tahun = _tahun < 1000 ? _tahun + 1900 : _tahun;
  return `${_hari}, ${tanggal} ${_bulan} ${tahun} / ${getHour(date)}`;
};

export const getHour = date => {
  let jam = addZero(date.getHours());
  let menit = addZero(date.getMinutes());
  return `${jam}:${menit}`;
};

export const convertDateOnly = date => {
  let tanggal = date.getDate();
  let _bulan = bulan[date.getMonth()];
  let _tahun = date.getYear();
  let tahun = _tahun < 1000 ? _tahun + 1900 : _tahun;
  return `${tanggal} ${_bulan} ${tahun}`;
};

export const convertTimestamp = date => {
  let tanggal = date.getDate();
  let bulan = date.getMonth();
  let _tahun = date.getYear();
  let tahun = _tahun < 1000 ? _tahun + 1900 : _tahun;
  var myDate = `${tanggal}-${bulan}-${tahun}`;
  myDate = myDate.split('-');
  var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
  return newDate.getTime();
};

export const convertAge = date => {
  let today = new Date();
  let birthday = new Date(date);
  let year = 0;
  if (today.getMonth() < birthday.getMonth()) {
    year = 1;
  } else if (
    today.getMonth() == birthday.getMonth() &&
    today.getDate() < birthday.getDate()
  ) {
    year = 1;
  }
  let age = today.getFullYear() - birthday.getFullYear() - year;

  if (age < 0) {
    age = 0;
  }
  return `${age}`;
};

export const convertDateTime = date => {
  let tanggal = date.getDate();
  let _hari = hari[date.getDay()];
  let _bulan = bulan[date.getMonth()];
  let _tahun = date.getYear();
  let _hour = date.getHours();
  let _minute = date.getMinutes();
  let tahun = _tahun < 1000 ? _tahun + 1900 : _tahun;
  return `${_hari}, ${tanggal} ${_bulan} ${tahun}, ${_hour}:${_minute}`;
};

export const getUniqueCode = (oldDate, idMix) => {
  const hour = oldDate.getHours();
  const minute = oldDate.getMinutes();
  const year = oldDate.getFullYear();
  const month = oldDate.getMonth() + 1;
  const date = oldDate.getDate();

  return `${date}${month}${String(year).substr(2)}${hour}${minute}${idMix}`;
};
